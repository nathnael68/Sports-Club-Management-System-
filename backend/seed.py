"""Seed the database with demo data and train initial ML models.

Usage (from backend/ with the venv activated):
    python seed.py
"""
import datetime as dt

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.base import SessionLocal, engine, Base
import app.models  # noqa: F401 - register models
from app.models import (
    User, Athlete, Facility, TrainingSession, Attendance,
    PerformanceRecord, InjuryRecord, Competition, Membership, Equipment,
)
from app.core.roles import Role
from app.ml import service


def make_user(db, email, name, password, role):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email, full_name=name,
                    hashed_password=get_password_hash(password), role=role)
        db.add(user)
        db.flush()
    else:
        user.role = role
        user.hashed_password = get_password_hash(password)
        db.flush()
    return user


def seed():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Staff & Coach Core Accounts
        admin = make_user(db, "admin@example.com", "System Administrator", "admin123", Role.ADMIN)
        coach = make_user(db, "coach@example.com", "Head Coach", "coach123", Role.COACH)
        physio = make_user(db, "physio@example.com", "Team Physiotherapist", "physio123", Role.PHYSIOTHERAPIST)
        
        # 2. Facility & Equipment Setup
        facility = Facility(
            name="Main Training Complex",
            facility_type="pitch",
            location="North Field Complex",
            capacity=50,
            is_available=True,
        )
        db.add(facility)
        db.flush()

        db.add(Equipment(name="GPS Performance Vests", category="tracking",
                         facility_id=facility.id, quantity=30, condition="good"))
        db.add(Equipment(name="Tactical Agility Cones", category="training",
                         facility_id=facility.id, quantity=60, condition="good"))
        db.add(Equipment(name="Weighted Medicine Balls", category="strength",
                         facility_id=facility.id, quantity=15, condition="fair"))

        # 3. Define 10 Distinct Custom Players
        custom_players_data = [
            {
                "email": "athlete@example.com",  # Primary login
                "name": "Marcus Vance",
                "jersey": 10,
                "pos": "FWD",
                "dob": dt.date(2001, 5, 14),
                "height": 183.0,
                "weight": 77.5,
                "nat": "England",
                "profile_type": "optimal_striker",
            },
            {
                "email": "athlete2@club.com",
                "name": "Liam Davies",
                "jersey": 4,
                "pos": "DEF",
                "dob": dt.date(1999, 11, 23),
                "height": 188.0,
                "weight": 82.0,
                "nat": "Wales",
                "profile_type": "solid_defender",
            },
            {
                "email": "athlete3@club.com",
                "name": "Mateo Silva",
                "jersey": 8,
                "pos": "MID",
                "dob": dt.date(2002, 3, 8),
                "height": 178.0,
                "weight": 73.0,
                "nat": "Brazil",
                "profile_type": "overtrained_midfielder",  # High ACWR spike + Past Injury
            },
            {
                "email": "athlete4@club.com",
                "name": "Noah Becker",
                "jersey": 1,
                "pos": "GK",
                "dob": dt.date(1998, 7, 19),
                "height": 192.0,
                "weight": 88.0,
                "nat": "Germany",
                "profile_type": "goalkeeper",
            },
            {
                "email": "athlete5@club.com",
                "name": "Ethan Walker",
                "jersey": 7,
                "pos": "FWD",
                "dob": dt.date(2003, 1, 30),
                "height": 180.0,
                "weight": 75.0,
                "nat": "England",
                "profile_type": "sprint_fatigue_winger",  # High sprint spike
            },
            {
                "email": "athlete6@club.com",
                "name": "Lucas Hernandez",
                "jersey": 3,
                "pos": "DEF",
                "dob": dt.date(2000, 9, 12),
                "height": 184.0,
                "weight": 79.0,
                "nat": "France",
                "profile_type": "steady_fullback",
            },
            {
                "email": "athlete7@club.com",
                "name": "Gabriel Rossi",
                "jersey": 6,
                "pos": "MID",
                "dob": dt.date(2001, 8, 5),
                "height": 176.0,
                "weight": 71.0,
                "nat": "Italy",
                "profile_type": "recovering_midfielder",  # Minor strain
            },
            {
                "email": "athlete8@club.com",
                "name": "Oliver Jensen",
                "jersey": 9,
                "pos": "FWD",
                "dob": dt.date(2002, 12, 17),
                "height": 186.0,
                "weight": 81.0,
                "nat": "Denmark",
                "profile_type": "high_intensity_forward",  # Heavy ACWR
            },
            {
                "email": "athlete9@club.com",
                "name": "Kai Tanaka",
                "jersey": 11,
                "pos": "MID",
                "dob": dt.date(2000, 4, 25),
                "height": 174.0,
                "weight": 68.0,
                "nat": "Japan",
                "profile_type": "high_endurance_playmaker",
            },
            {
                "email": "athlete10@club.com",
                "name": "Dominic Scott",
                "jersey": 5,
                "pos": "DEF",
                "dob": dt.date(1999, 6, 2),
                "height": 187.0,
                "weight": 83.0,
                "nat": "Scotland",
                "profile_type": "irregular_load_defender",
            },
        ]

        athletes_list = []
        for p in custom_players_data:
            user = make_user(db, p["email"], p["name"], "athlete123", Role.ATHLETE)
            ath = Athlete(
                user_id=user.id,
                jersey_number=p["jersey"],
                playing_position=p["pos"],
                date_of_birth=p["dob"],
                height_cm=p["height"],
                weight_kg=p["weight"],
                nationality=p["nat"],
            )
            db.add(ath)
            db.flush()
            athletes_list.append((ath, p))

            db.add(Membership(
                athlete_id=ath.id,
                plan="premium" if p["jersey"] in (10, 7, 8) else "standard",
                start_date=dt.date.today() - dt.timedelta(days=60),
                amount_paid=450.0,
                status="active",
            ))

        # 4. Generate 6 Weeks of Realistic Training Sessions & Telemetry
        start_date = dt.date.today() - dt.timedelta(days=35)
        for s_idx in range(12):  # 12 sessions across 5 weeks
            sess_date = start_date + dt.timedelta(days=s_idx * 3)
            session = TrainingSession(
                title=f"Squad Tactical & Conditioning Session {s_idx+1}",
                coach_id=coach.id,
                facility_id=facility.id,
                scheduled_at=dt.datetime(sess_date.year, sess_date.month, sess_date.day, 16, 30),
                duration_min=90,
                intensity="high" if s_idx % 2 == 0 else "medium",
                focus="Tactical Strategy & Match Fitness",
            )
            db.add(session)
            db.flush()

            for ath, p_info in athletes_list:
                ptype = p_info["profile_type"]
                # Tailor telemetry based on player workload profile
                if ptype == "overtrained_midfielder":
                    # Sudden spike in acute load
                    s_rpe = 9 if s_idx >= 8 else 6
                    s_load = 750 if s_idx >= 8 else 450
                    dist = 7.8 if s_idx >= 8 else 6.0
                    speed = 31.5
                    fit = 72.0
                elif ptype == "sprint_fatigue_winger":
                    s_rpe = 8 if s_idx >= 9 else 6
                    s_load = 680 if s_idx >= 9 else 480
                    dist = 6.9
                    speed = 33.2
                    fit = 79.0
                elif ptype == "high_intensity_forward":
                    s_rpe = 9 if s_idx >= 8 else 7
                    s_load = 720 if s_idx >= 8 else 500
                    dist = 6.5
                    speed = 30.5
                    fit = 77.0
                elif ptype == "goalkeeper":
                    s_rpe = 5
                    s_load = 320
                    dist = 3.2
                    speed = 24.0
                    fit = 74.0
                elif ptype == "high_endurance_playmaker":
                    s_rpe = 6
                    s_load = 510
                    dist = 8.2
                    speed = 29.8
                    fit = 85.0
                else:
                    s_rpe = 6 + (ath.id % 2)
                    s_load = 480 + (ath.id % 3) * 40
                    dist = 5.6 + (ath.id % 3) * 0.4
                    speed = 28.5 + (ath.id % 4) * 0.8
                    fit = 78.0 + (ath.id % 5) * 1.5

                db.add(Attendance(
                    athlete_id=ath.id,
                    session_id=session.id,
                    status="present",
                    minutes_late=0,
                    rpe=s_rpe,
                ))

                db.add(PerformanceRecord(
                    athlete_id=ath.id,
                    session_id=session.id,
                    recorded_at=sess_date,
                    distance_km=round(dist, 2),
                    top_speed_kmh=round(speed, 1),
                    sprint_count=20 + (ath.id * 2),
                    avg_heart_rate=152.0 + (ath.id % 5),
                    max_heart_rate=182.0 + (ath.id % 6),
                    training_load=s_load,
                    vo2max_est=56.0 + (ath.id % 4),
                    fitness_score=round(fit + (s_idx * 0.5), 1),
                    match_rating=7.2 + (ath.id % 3) * 0.3,
                ))

        # 5. Add Historical Injury Logs for Selected High-Risk Players
        # Mateo Silva (ID 3) - Previous hamstring strain
        db.add(InjuryRecord(
            athlete_id=athletes_list[2][0].id,
            injury_type="Hamstring strain (Grade 2)",
            body_part="Thigh",
            severity="moderate",
            occurred_on=dt.date.today() - dt.timedelta(days=40),
            cause="match",
            notes="Recovered but showing fatigue spike",
        ))
        # Gabriel Rossi (ID 7) - Minor calf tightness
        db.add(InjuryRecord(
            athlete_id=athletes_list[6][0].id,
            injury_type="Calf muscle tightness",
            body_part="Lower Leg",
            severity="minor",
            occurred_on=dt.date.today() - dt.timedelta(days=20),
            cause="training",
            notes="Under observation",
        ))

        db.commit()
        print(f"Successfully seeded {len(athletes_list)} custom players with 120 performance records.")

        # 6. Train ML models exclusively from football_ml_model_ready.csv
        print("\n--- Training Machine Learning Models from football_ml_model_ready.csv ---")
        injury_model_info = service.train_injury_model(db)
        perf_model_info = service.train_performance_model(db)
        print("Injury Risk Model:", injury_model_info)
        print("Performance Score Model:", perf_model_info)

        # 7. Audit & Predict for all 10 Players
        print("\n=================== 10 CUSTOM PLAYERS ML AUDIT REPORT ===================")
        for ath, p_info in athletes_list:
            risk = service.predict_injury_risk(db, ath.id)
            perf = service.predict_performance(db, ath.id)
            recs = service.recommendations(db, ath.id)
            feats = risk.get("features", {})
            print(f"Player: #{p_info['jersey']} {p_info['name']} ({p_info['pos']}) - {p_info['nat']}")
            print(f"  ACWR: {feats.get('acwr', 0.0):.2f} | Acute Load: {feats.get('atl', 0.0):.1f} | Chronic Load: {feats.get('ctl28', 0.0):.1f}")
            print(f"  Injury Risk: {risk['injury_risk_probability']*100:.1f}% [{risk['risk_level'].upper()}] | Pred Fitness: {perf['predicted_fitness_score']:.1f}/100")
            print(f"  AI Recs: {recs['recommendations'][0] if recs['recommendations'] else 'Normal'}")
            print("-------------------------------------------------------------------------")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
