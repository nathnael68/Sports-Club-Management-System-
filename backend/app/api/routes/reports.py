import csv
import io
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_permission
from app.models import User, Attendance, Facility, Membership, Athlete, TrainingSession

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/export")
def export_csv_report(
    report_type: str = Query(..., description="Report type: attendance, facilities, memberships, users"),
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("attendance:read")),
):
    output = io.StringIO()
    writer = csv.writer(output)

    if report_type == "attendance":
        writer.writerow(["Attendance ID", "Session Title", "Session Date", "Athlete Name", "Status", "Minutes Late", "RPE Score"])
        records = db.query(Attendance).all()
        for r in records:
            athlete = db.query(Athlete).filter(Athlete.id == r.athlete_id).first()
            session = db.query(TrainingSession).filter(TrainingSession.id == r.session_id).first()
            athlete_name = athlete.full_name if athlete else f"Athlete #{r.athlete_id}"
            session_title = session.title if session else f"Session #{r.session_id}"
            session_date = session.scheduled_at.strftime("%Y-%m-%d %H:%M") if session and session.scheduled_at else ""
            writer.writerow([r.id, session_title, session_date, athlete_name, r.status, r.minutes_late, r.rpe or ""])
        filename = "squad_attendance_report.csv"

    elif report_type == "facilities":
        writer.writerow(["Facility ID", "Name", "Facility Type", "Capacity", "Is Available"])
        facilities = db.query(Facility).all()
        for f in facilities:
            writer.writerow([f.id, f.name, f.facility_type, f.capacity, f.is_available])
        filename = "facility_utilization_report.csv"

    elif report_type == "memberships":
        writer.writerow(["Membership ID", "Member Name", "Plan Tier", "Amount Paid ($)", "Start Date", "Status"])
        memberships = db.query(Membership).all()
        for m in memberships:
            athlete = db.query(Athlete).filter(Athlete.id == m.athlete_id).first()
            member_name = athlete.full_name if athlete else f"Athlete #{m.athlete_id}"
            writer.writerow([m.id, member_name, m.plan, m.amount_paid, m.start_date or "", m.status])
        filename = "memberships_financial_report.csv"

    elif report_type == "users":
        writer.writerow(["User ID", "Full Name", "Email Address", "RBAC Role", "Is Active", "Account Created"])
        users = db.query(User).order_by(User.id.asc()).all()
        for u in users:
            writer.writerow([u.id, u.full_name, u.email, u.role, u.is_active, u.created_at or ""])
        filename = "system_users_directory.csv"

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid report type. Supported types: attendance, facilities, memberships, users",
        )

    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename={filename}"
    return response
