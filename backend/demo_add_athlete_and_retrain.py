"""Script demonstrating adding a new athlete, logging sessions & metrics, and retraining ML models."""
import datetime as dt
from app.db.base import SessionLocal, Base, engine
from app.core.roles import Role
from app.models import User, Athlete, TrainingSession, Attendance, PerformanceRecord, Facility, FacilityType
from app.core.security import get_password_hash
from app.ml import service

def add_athlete_and_retrain():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        email = f"new_star_{dt.datetime.now().strftime('%M%S')}@club.com"
        print(f"=== STEP 1: Creating New Athlete ({email}) ===")
        
        user = User(
            email=email,
            full_name="Marcus Vance (New Star)",
            hashed_password=get_password_hash("athlete123"),
            role=Role.ATHLETE,
        )
        db.add(user)
        db.flush()

        athlete = Athlete(
            user_id=user.id,
            jersey_number=99,
            playing_position="FWD",
            date_of_birth=dt.date(2002, 5, 12),
            height_cm=185.0,
            weight_kg=80.0,
            nationality="Spain",
        )
        db.add(athlete)
        db.flush()
        print(f"-> Created Athlete ID #{athlete.id} ({athlete.full_name}, Jersey #{athlete.jersey_number})")

        print("\n=== STEP 2: Adding Facility & Training Sessions ===")
        facility = db.query(Facility).first()
        if not facility:
            facility = Facility(name="Training Pitch A", facility_type=FacilityType.PITCH, capacity=30)
            db.add(facility)
            db.flush()

        coach = db.query(User).filter(User.role == Role.COACH).first()
        coach_id = coach.id if coach else user.id

        for w in range(4):
            session_date = dt.datetime.now() - dt.timedelta(days=7 * (3 - w))
            session = TrainingSession(
                title=f"High Intensity Session W{w+1}",
                coach_id=coach_id,
                facility_id=facility.id,
                scheduled_at=session_date,
                duration_min=90,
                intensity="high",
                focus="endurance",
            )
            db.add(session)
            db.flush()

            # Record attendance with high RPE
            db.add(Attendance(
                athlete_id=athlete.id,
                session_id=session.id,
                status="present",
                rpe=8 + (w % 2),
            ))

            # Record performance metrics
            db.add(PerformanceRecord(
                athlete_id=athlete.id,
                session_id=session.id,
                recorded_at=session_date.date(),
                distance_km=8.5 + (w * 0.5),
                top_speed_kmh=31.2,
                sprint_count=28 + w,
                avg_heart_rate=165.0,
                max_heart_rate=192.0,
                training_load=90 * (8 + (w % 2)),
                vo2max_est=58.5,
                fitness_score=78.0 + (w * 2),
                match_rating=8.0,
            ))
        db.commit()
        print(f"-> Successfully logged 4 training sessions and performance records for Athlete ID #{athlete.id}")

        print("\n=== STEP 3: Retraining Machine Learning Models ===")
        injury_res = service.train_injury_model(db)
        perf_res = service.train_performance_model(db)
        print("Injury Model Retraining Result:", injury_res)
        print("Performance Model Retraining Result:", perf_res)

        athlete_id: int = getattr(athlete, "id")
        print(f"\n=== STEP 4: Querying ML Inference for New Athlete ID #{athlete_id} ===")
        pred_injury = service.predict_injury_risk(db, athlete_id)
        pred_perf = service.predict_performance(db, athlete_id)
        recs = service.recommendations(db, athlete_id)

        print("Predicted Injury Risk:", pred_injury)
        print("Predicted Fitness Score:", pred_perf)
        print("Automated Recommendations:", recs["recommendations"])

        print(f"\n=== DEMO COMPLETE: New athlete ID #{athlete.id} integrated into ML models! ===")

    finally:
        db.close()

if __name__ == "__main__":
    add_athlete_and_retrain()
