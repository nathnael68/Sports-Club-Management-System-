from datetime import date, datetime
from pathlib import Path
from typing import Any
from sqlalchemy.orm import Session

from app.models import PerformanceRecord, InjuryRecord, Attendance

ARTIFACT_DIR = Path(__file__).resolve().parent / "artifacts"
ARTIFACT_DIR.mkdir(exist_ok=True)

DATA_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "football_ml_model_ready.csv"
if not DATA_PATH.exists():
    DATA_PATH = Path(__file__).resolve().parent.parent.parent / "docs" / "football_ml_model_ready.csv"

DATASET_INJURY_FEATURES = [
    "daily_training_load",
    "weekly_load_index",
    "total_distance_km",
    "top_speed",
    "average_running_speed",
    "high_intensity_running",
    "acwr",
    "atl",
    "ctl28",
    "monotony",
    "strain",
    "previous_injury_count",
    "fatigue",
    "soreness",
    "stress",
    "readiness",
    "sleep_quality",
    "sleep_duration_hours",
]

DATASET_PERFORMANCE_FEATURES = [
    "daily_training_load",
    "total_distance_km",
    "top_speed",
    "average_running_speed",
    "high_intensity_running",
    "acwr",
    "atl",
    "ctl28",
    "readiness",
    "sleep_quality",
    "sleep_duration_hours",
    "fatigue",
]

FEATURE_COLUMNS = DATASET_INJURY_FEATURES


def build_features(db: Session, athlete_id: int) -> dict[str, float]:
    perfs = (
        db.query(PerformanceRecord)
        .filter(PerformanceRecord.athlete_id == athlete_id)
        .order_by(PerformanceRecord.recorded_at.desc())
        .all()
    )
    injuries = (
        db.query(InjuryRecord).filter(InjuryRecord.athlete_id == athlete_id).all()
    )
    attendances = (
        db.query(Attendance).filter(Attendance.athlete_id == athlete_id).all()
    )

    now = date.today()

    def _days_ago(val: Any) -> int:
        if val is None:
            return 999
        if isinstance(val, datetime):
            return (now - val.date()).days
        if isinstance(val, date):
            return (now - val).days
        return 999

    training_loads: list[float] = []
    fitness_scores: list[float] = []
    max_hr: list[float] = []
    distances: list[float] = []
    top_speeds: list[float] = []
    sprints: list[float] = []
    loads_7d: list[float] = []
    loads_28d: list[float] = []

    for p in perfs:
        rec: Any = p
        t_load = rec.training_load
        if t_load is not None:
            flt_load = float(t_load)
            training_loads.append(flt_load)
            days = _days_ago(rec.recorded_at)
            if days <= 7:
                loads_7d.append(flt_load)
            if days <= 28:
                loads_28d.append(flt_load)

        if rec.fitness_score is not None:
            fitness_scores.append(float(rec.fitness_score))
        if rec.max_heart_rate is not None:
            max_hr.append(float(rec.max_heart_rate))
        if rec.distance_km is not None:
            distances.append(float(rec.distance_km))
        if rec.top_speed_kmh is not None:
            top_speeds.append(float(rec.top_speed_kmh))
        if rec.sprint_count is not None:
            sprints.append(float(rec.sprint_count))

    rpes: list[float] = []
    for att in attendances:
        a: Any = att
        if a.rpe is not None:
            rpes.append(float(a.rpe))

    avg_load = (sum(training_loads) / len(training_loads)) if training_loads else 420.0
    avg_fitness = (sum(fitness_scores) / len(fitness_scores)) if fitness_scores else 65.0
    avg_max_hr = (sum(max_hr) / len(max_hr)) if max_hr else 180.0
    avg_dist = (sum(distances) / len(distances)) if distances else 4.8
    avg_top_speed = (sum(top_speeds) / len(top_speeds)) if top_speeds else 28.5
    avg_sprints = (sum(sprints) / len(sprints)) if sprints else 18.0
    avg_rpe = (sum(rpes) / len(rpes)) if rpes else 6.0

    atl = (sum(loads_7d) / 7.0) if loads_7d else (avg_load * 0.9)
    ctl28 = (sum(loads_28d) / 28.0) if loads_28d else (avg_load * 0.85)
    acwr = (atl / (ctl28 + 1e-5)) if ctl28 > 0 else 1.05

    attendance_rate = 1.0
    if attendances:
        present = sum(1 for a in attendances if getattr(a, "status", None) in ("present", "late"))
        attendance_rate = present / len(attendances)

    injury_count = float(len(injuries))
    days_since_last_injury = -1.0
    injury_dates: list[date] = []
    for inj in injuries:
        d_val: Any = getattr(inj, "occurred_on", None)
        if d_val is not None:
            injury_dates.append(d_val)

    if injury_dates:
        latest_date = max(injury_dates)
        days_since_last_injury = float(_days_ago(latest_date))

    weekly_load_index = (avg_load * 7.0) / 1000.0
    monotony = 1.25
    strain = avg_load * monotony * 7.0

    fatigue_level = min(10.0, max(1.0, avg_rpe * 0.6))
    readiness_score = min(10.0, max(1.0, 10.0 - fatigue_level))

    return {
        # Dataset-aligned features
        "daily_training_load": avg_load,
        "weekly_load_index": weekly_load_index,
        "total_distance_km": avg_dist,
        "top_speed": avg_top_speed,
        "average_running_speed": avg_dist / 1.5,
        "high_intensity_running": avg_sprints * 0.2,
        "acwr": acwr,
        "atl": atl,
        "ctl28": ctl28,
        "monotony": monotony,
        "strain": strain,
        "previous_injury_count": injury_count,
        "fatigue": fatigue_level,
        "soreness": fatigue_level,
        "stress": 0.5,
        "readiness": readiness_score,
        "sleep_quality": 4.0,
        "sleep_duration_hours": 8.0,

        # Legacy convenience aliases
        "avg_training_load": avg_load,
        "avg_fitness_score": avg_fitness,
        "avg_max_heart_rate": avg_max_hr,
        "avg_rpe": avg_rpe,
        "attendance_rate": attendance_rate,
        "injury_count": injury_count,
        "days_since_last_injury": days_since_last_injury,
    }
