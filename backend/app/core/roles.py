from enum import Enum


class Role(str, Enum):
    ADMIN = "admin"
    COACH = "coach"
    ATHLETE = "athlete"
    PHYSIOTHERAPIST = "physiotherapist"
    STAFF = "staff"


ROLE_PERMISSIONS: dict[Role, set[str]] = {
    Role.ADMIN: {"*"},
    Role.COACH: {
        "athlete:read", "athlete:write",
        "training:read", "training:write",
        "attendance:read", "attendance:write",
        "performance:read", "performance:write",
        "competition:read", "competition:write",
        "injury:read", "injury:write",
        "ml:read",
    },
    Role.ATHLETE: {
        "athlete:read:self", "performance:read:self",
        "attendance:read:self", "attendance:write:self", "attendance:write",
        "training:read:self", "ml:read:self",
    },
    Role.PHYSIOTHERAPIST: {
        "athlete:read", "injury:read", "injury:write",
        "performance:read", "ml:read",
        "facility:read", "equipment:read",
        "membership:read", "membership:write",
    },
    Role.STAFF: {
        "membership:read", "membership:write",
        "facility:read", "facility:write",
        "equipment:read", "equipment:write",
        "attendance:read", "attendance:write",
        "injury:read", "injury:write",
        "athlete:read",
    },
}


def has_permission(role: Role | str, permission: str) -> bool:
    print(f"DEBUG has_permission: role={role!r}, type={type(role)}, permission={permission!r}")
    role_val = role.value if hasattr(role, "value") else str(role)
    if role_val.startswith("Role."):
        role_val = role_val.replace("Role.", "").lower()
    
    for r, perms in ROLE_PERMISSIONS.items():
        r_val = r.value if hasattr(r, "value") else str(r)
        if r_val == role_val or str(r) == role_val:
            if "*" in perms or permission in perms:
                print("DEBUG has_permission: True")
                return True
    print("DEBUG has_permission: False")
    return False
