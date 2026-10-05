"""Test script for verifying report export CSV data generation."""
import csv
import io
from app.db.base import SessionLocal
from app.models import User, Attendance, Facility, Membership, Athlete, TrainingSession

def test_reports():
    db = SessionLocal()
    try:
        print("=== TEST 1: USERS REPORT ===")
        out = io.StringIO()
        writer = csv.writer(out)
        writer.writerow(["User ID", "Full Name", "Email Address", "RBAC Role", "Is Active", "Account Created"])
        users = db.query(User).order_by(User.id.asc()).all()
        for u in users:
            writer.writerow([u.id, u.full_name, u.email, u.role, u.is_active, u.created_at or ""])
        print(f"Total user rows: {len(users)}")
        print(out.getvalue()[:300])

        print("\n=== TEST 2: ATTENDANCE REPORT ===")
        out = io.StringIO()
        writer = csv.writer(out)
        writer.writerow(["Attendance ID", "Session Title", "Session Date", "Athlete Name", "Status", "Minutes Late", "RPE Score"])
        records = db.query(Attendance).all()
        for r in records:
            athlete = db.query(Athlete).filter(Athlete.id == r.athlete_id).first()
            session = db.query(TrainingSession).filter(TrainingSession.id == r.session_id).first()
            athlete_name = athlete.full_name if athlete else f"Athlete #{r.athlete_id}"
            session_title = session.title if session else f"Session #{r.session_id}"
            session_date = session.scheduled_at.strftime("%Y-%m-%d %H:%M") if session and session.scheduled_at else ""
            writer.writerow([r.id, session_title, session_date, athlete_name, r.status, r.minutes_late, r.rpe or ""])
        print(f"Total attendance rows: {len(records)}")
        print(out.getvalue()[:300])

        print("\n=== TEST 3: FACILITIES REPORT ===")
        out = io.StringIO()
        writer = csv.writer(out)
        writer.writerow(["Facility ID", "Name", "Facility Type", "Capacity", "Is Available"])
        facilities = db.query(Facility).all()
        for f in facilities:
            writer.writerow([f.id, f.name, f.facility_type, f.capacity, f.is_available])
        print(f"Total facility rows: {len(facilities)}")
        print(out.getvalue()[:300])

        print("\n=== TEST 4: MEMBERSHIPS REPORT ===")
        out = io.StringIO()
        writer = csv.writer(out)
        writer.writerow(["Membership ID", "Member Name", "Plan Tier", "Amount Paid ($)", "Start Date", "Status"])
        memberships = db.query(Membership).all()
        for m in memberships:
            athlete = db.query(Athlete).filter(Athlete.id == m.athlete_id).first()
            member_name = athlete.full_name if athlete else f"Athlete #{m.athlete_id}"
            writer.writerow([m.id, member_name, m.plan, m.amount_paid, m.start_date or "", m.status])
        print(f"Total membership rows: {len(memberships)}")
        print(out.getvalue()[:300])

    finally:
        db.close()

if __name__ == "__main__":
    test_reports()
