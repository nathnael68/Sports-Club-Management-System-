import json
import joblib
from datetime import datetime
from pathlib import Path

from sqlalchemy.orm import Session

from app.ml import features as feat
from app.models import Athlete, PerformanceRecord, InjuryRecord, MLModel

ARTIFACT_DIR = feat.ARTIFACT_DIR


def _artifact_path(name: str, version: str) -> Path:
    return ARTIFACT_DIR / f"{name}_{version}.joblib"


def train_injury_model(db: Session, version: str = "1.0.0"):
    import pandas as pd
    from sklearn.linear_model import LogisticRegression
    from sklearn.preprocessing import StandardScaler
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import roc_auc_score, accuracy_score

    csv_path = feat.DATA_PATH
    if not csv_path.exists():
        return {
            "status": "skipped",
            "reason": f"dataset not found at {csv_path}",
            "samples": 0,
        }

    df = pd.read_csv(csv_path)
    X = df[feat.DATASET_INJURY_FEATURES].fillna(0)
    y = df["injury_label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler().fit(X_train)
    clf = LogisticRegression(class_weight="balanced", max_iter=1000, random_state=42)
    clf.fit(scaler.transform(X_train), y_train)

    y_pred_proba = clf.predict_proba(scaler.transform(X_test))[:, 1]
    y_pred = clf.predict(scaler.transform(X_test))
    auc = float(roc_auc_score(y_test, y_pred_proba))
    acc = float(accuracy_score(y_test, y_pred))

    path = _artifact_path("injury", version)
    joblib.dump({"model": clf, "scaler": scaler, "features": feat.DATASET_INJURY_FEATURES}, path)

    metrics = {
        "samples": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "roc_auc": round(auc, 4),
        "accuracy": round(acc, 4),
        "positive_rate": float(y.mean()),
        "features": feat.DATASET_INJURY_FEATURES,
    }
    _record_model(db, "injury-risk", "injury", version, metrics, str(path))
    return {
        "status": "trained",
        "samples": len(df),
        "roc_auc": round(auc, 4),
        "accuracy": round(acc, 4),
        "artifact": str(path),
    }


def train_performance_model(db: Session, version: str = "1.0.0"):
    import pandas as pd
    from sklearn.ensemble import GradientBoostingRegressor
    from sklearn.preprocessing import StandardScaler
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

    csv_path = feat.DATA_PATH
    if not csv_path.exists():
        return {
            "status": "skipped",
            "reason": f"dataset not found at {csv_path}",
            "samples": 0,
        }

    df = pd.read_csv(csv_path)
    X = df[feat.DATASET_PERFORMANCE_FEATURES].fillna(0)
    # Scale performance_score (range 3.0 to 8.67) to standard 0-100 fitness scale
    y = df["performance_score"] * 12.0

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    scaler = StandardScaler().fit(X_train)
    reg = GradientBoostingRegressor(n_estimators=100, random_state=42).fit(
        scaler.transform(X_train), y_train
    )

    y_pred = reg.predict(scaler.transform(X_test))
    r2 = float(r2_score(y_test, y_pred))
    mse = float(mean_squared_error(y_test, y_pred))
    mae = float(mean_absolute_error(y_test, y_pred))

    path = _artifact_path("performance", version)
    joblib.dump({"model": reg, "scaler": scaler, "features": feat.DATASET_PERFORMANCE_FEATURES}, path)

    metrics = {
        "samples": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "r2_score": round(r2, 4),
        "mse": round(mse, 4),
        "mae": round(mae, 4),
        "features": feat.DATASET_PERFORMANCE_FEATURES,
    }
    _record_model(db, "performance", "performance", version, metrics, str(path))
    return {
        "status": "trained",
        "samples": len(df),
        "r2_score": round(r2, 4),
        "mae": round(mae, 4),
        "artifact": str(path),
    }


def predict_injury_risk(db: Session, athlete_id: int):
    latest = (
        db.query(MLModel)
        .filter(MLModel.model_type == "injury")
        .order_by(MLModel.trained_at.desc())
        .first()
    )
    if not latest:
        return _heuristic_injury_risk(db, athlete_id)
    try:
        bundle = joblib.load(latest.artifact_path)
        feats = feat.build_features(db, athlete_id)
        feature_cols = bundle.get("features", feat.DATASET_INJURY_FEATURES)
        X = [[feats.get(c, 0.0) for c in feature_cols]]
        proba = bundle["model"].predict_proba(bundle["scaler"].transform(X))[0]
        risk = float(proba[1]) if len(proba) > 1 else float(proba[0])
        return {
            "athlete_id": athlete_id,
            "injury_risk_probability": round(risk, 3),
            "risk_level": _risk_level(risk),
            "model_version": latest.version,
            "features": feats,
        }
    except Exception:
        return _heuristic_injury_risk(db, athlete_id)


def predict_performance(db: Session, athlete_id: int):
    latest = (
        db.query(MLModel)
        .filter(MLModel.model_type == "performance")
        .order_by(MLModel.trained_at.desc())
        .first()
    )
    if not latest:
        return _heuristic_performance(db, athlete_id)
    try:
        bundle = joblib.load(latest.artifact_path)
        feats = feat.build_features(db, athlete_id)
        feature_cols = bundle.get("features", feat.DATASET_PERFORMANCE_FEATURES)
        X = [[feats.get(c, 0.0) for c in feature_cols]]
        pred = float(bundle["model"].predict(bundle["scaler"].transform(X))[0])
        pred = max(20.0, min(100.0, pred))
        return {
            "athlete_id": athlete_id,
            "predicted_fitness_score": round(pred, 2),
            "model_version": latest.version,
            "features": feats,
        }
    except Exception:
        return _heuristic_performance(db, athlete_id)


def recommendations(db: Session, athlete_id: int):
    injury = predict_injury_risk(db, athlete_id)
    perf = predict_performance(db, athlete_id)
    recs = []
    feats = injury.get("features", {})

    if injury.get("risk_level") in ("high", "moderate"):
        recs.append(
            "Elevated injury risk detected. Reduce high-intensity sessions and increase recovery time."
        )
    if feats.get("avg_training_load", 0) > 600:
        recs.append("Average training load is high; consider periodization to avoid overtraining.")
    if feats.get("attendance_rate", 1) < 0.8:
        recs.append("Attendance is below 80%; consistent presence improves fitness outcomes.")
    if feats.get("avg_fitness_score", 50) < 50:
        recs.append("Fitness score is low; add endurance and strength conditioning.")
    if not recs:
        recs.append("Metrics look healthy. Maintain current training plan.")

    return {
        "athlete_id": athlete_id,
        "injury_risk": injury.get("risk_level"),
        "predicted_fitness": perf.get("predicted_fitness_score"),
        "recommendations": recs,
    }


def _risk_level(risk: float) -> str:
    if risk >= 0.66:
        return "high"
    if risk >= 0.33:
        return "moderate"
    return "low"


def _heuristic_injury_risk(db: Session, athlete_id: int):
    feats = feat.build_features(db, athlete_id)
    score = 0.0
    if feats["injury_count"] > 0:
        score += 0.4
    if feats["avg_training_load"] > 600:
        score += 0.3
    if feats["attendance_rate"] < 0.8:
        score += 0.15
    if feats["avg_fitness_score"] and feats["avg_fitness_score"] < 50:
        score += 0.15
    score = min(score, 0.99)
    return {
        "athlete_id": athlete_id,
        "injury_risk_probability": round(score, 3),
        "risk_level": _risk_level(score),
        "model_version": "heuristic",
        "features": feats,
    }


def _heuristic_performance(db: Session, athlete_id: int):
    feats = feat.build_features(db, athlete_id)
    score = feats.get("avg_fitness_score", 50.0)
    return {
        "athlete_id": athlete_id,
        "predicted_fitness_score": round(score, 2),
        "model_version": "heuristic",
        "features": feats,
    }


def _record_model(db, name, model_type, version, metrics, path):
    record = MLModel(
        name=name,
        model_type=model_type,
        version=version,
        metrics=json.dumps(metrics),
        artifact_path=path,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
