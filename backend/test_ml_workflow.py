"""Test script for ML retraining and prediction workflow."""
import os
import sys

from app.db.base import SessionLocal
from app.ml import service
from app.models import MLModel

def run_test():
    db = SessionLocal()
    try:
        print("=== STEP 1: Retraining Models ===")
        injury_res = service.train_injury_model(db)
        print("Injury Model Training Result:", injury_res)
        
        perf_res = service.train_performance_model(db)
        print("Performance Model Training Result:", perf_res)

        print("\n=== STEP 2: Checking Artifacts on Disk ===")
        artifact_dir = os.path.join(os.path.dirname(__file__), "app", "ml", "artifacts")
        files = os.listdir(artifact_dir) if os.path.exists(artifact_dir) else []
        print(f"Artifacts in {artifact_dir}:", files)

        print("\n=== STEP 3: Checking MLModel DB Records ===")
        models = db.query(MLModel).order_by(MLModel.trained_at.desc()).all()
        for m in models:
            print(f"- ID: {m.id} | Name: {m.name} | Type: {m.model_type} | Version: {m.version} | Trained: {m.trained_at}")

        print("\n=== STEP 4: Running Inference for Athlete ID 1 ===")
        pred = service.predict_injury_risk(db, 1)
        print("Inference Output for Athlete ID 1:")
        print(pred)

        print("\n=== STEP 5: Running Performance Inference for Athlete ID 1 ===")
        perf_pred = service.predict_performance(db, 1)
        print("Performance Inference Output for Athlete ID 1:")
        print(perf_pred)

        print("\n=== STEP 6: Generating Recommendations for Athlete ID 1 ===")
        recs = service.recommendations(db, 1)
        print("Recommendations Output:")
        print(recs)

        print("\n=== ML WORKFLOW TEST COMPLETED SUCCESSFULLY ===")
    finally:
        db.close()

if __name__ == "__main__":
    run_test()
