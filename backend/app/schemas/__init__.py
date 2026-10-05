# backend/app/schemas/__init__.py
from .users import UserCreate, UserOut, UserRoleUpdate, UserStatusUpdate
from .auth import Token, GoogleLoginRequest
from .athletes import AthleteCreate, AthleteOut, AthleteUpdate
from .training import TrainingSessionCreate, TrainingSessionOut, TrainingSessionUpdate, AttendanceCreate, AttendanceOut, AttendanceUpdate
from .performance import PerformanceCreate, PerformanceOut, PerformanceUpdate
from .injuries import InjuryCreate, InjuryOut, InjuryUpdate
from .competitions import CompetitionCreate, CompetitionOut, CompetitionUpdate
from .facilities import FacilityCreate, FacilityOut, FacilityUpdate, EquipmentCreate, EquipmentOut, EquipmentUpdate
from .memberships import MembershipCreate, MembershipOut, MembershipUpdate
