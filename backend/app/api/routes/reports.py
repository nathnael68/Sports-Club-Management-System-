import csv
import io
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_permission
from app.models import User, Attendance, Facility, Membership, Athlete, TrainingSession

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/export")
def export_csv_report(
    report_type: str | None = Query(None, description="Report type: attendance, facilities, memberships, users"),
    entity: str | None = Query(None, description="Alias for report_type: attendance, facilities, memberships, users"),
    db: Session = Depends(get_db),
    _: User = Depends(require_permission("attendance:read")),
):
    target = (report_type or entity or "").strip().lower()
    if not target:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing report type parameter. Please supply 'report_type' or 'entity'.",
        )

    output = io.StringIO()
    writer = csv.writer(output)

    if target == "attendance":
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

    elif target == "facilities":
        writer.writerow(["Facility ID", "Name", "Facility Type", "Capacity", "Is Available"])
        facilities = db.query(Facility).all()
        for f in facilities:
            fac_type = f.facility_type.value if hasattr(f.facility_type, "value") else str(f.facility_type)
            writer.writerow([f.id, f.name, fac_type, f.capacity, f.is_available])
        filename = "facility_utilization_report.csv"

    elif target == "memberships":
        writer.writerow(["Membership ID", "Member Name", "Plan Tier", "Amount Paid ($)", "Start Date", "Status"])
        memberships = db.query(Membership).all()
        for m in memberships:
            athlete = db.query(Athlete).filter(Athlete.id == m.athlete_id).first()
            member_name = athlete.full_name if athlete else f"Athlete #{m.athlete_id}"
            writer.writerow([m.id, member_name, m.plan, m.amount_paid, m.start_date or "", m.status])
        filename = "memberships_financial_report.csv"

    elif target == "users":
        writer.writerow(["User ID", "Full Name", "Email Address", "RBAC Role", "Is Active", "Account Created"])
        users = db.query(User).order_by(User.id.asc()).all()
        for u in users:
            role_val = u.role.value if hasattr(u.role, "value") else str(u.role)
            writer.writerow([u.id, u.full_name, u.email, role_val, u.is_active, u.created_at or ""])
        filename = "system_users_directory.csv"

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid report type '{target}'. Supported types: attendance, facilities, memberships, users",
        )

    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename={filename}"
    return response
