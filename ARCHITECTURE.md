# Architecture Documentation - Sports Club AI

This document provides a comprehensive overview of the Sports Club AI codebase, detailing the tech stack, project structure, database models, state management, and key data flows.

---

## 1. Tech Stack

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (v0.115.0+) for high-performance, asynchronous REST API endpoints.
- **ORM:** [SQLAlchemy](https://www.sqlalchemy.org/) (v2.0.35+) with declarative mapping.
- **Database Migrations:** [Alembic](https://alembic.mangolassi.org/) (v1.13.0+) for database schema management.
- **Validation & Serialization:** [Pydantic](https://docs.pydantic.dev/) (v2.9.0+) for type validation and JSON serialization schemas.
- **Security:**
  - `bcrypt` for secure password hashing.
  - `python-jose` for generating and verifying HMAC-SHA256 Signed JSON Web Tokens (JWT).
  - FastAPI OAuth2 Password Bearer flow for token-based API authentication.
- **Machine Learning & Data Processing:**
  - `scikit-learn` for classification (Logistic Regression) and regression (Linear Regression) models.
  - `pandas` & `numpy` for data manipulation and feature engineering.
  - `joblib` for persisting trained model pipelines (scaler + model bundles).

### Database
- **Engine:** [PostgreSQL](https://www.postgresql.org/) (version 16-alpine) running via Docker Compose.
- **Driver:** `psycopg` (v3.2.0+) binary driver for pythonic PostgreSQL interaction.

### Frontend
- **Framework:** [React](https://react.dev/) (v19.2.7) with [TypeScript](https://www.typescriptlang.org/) (v6.0.2).
- **Build Tool:** [Vite](https://vite.dev/) (v8.1.1) for fast development builds.
- **HTTP Client:** [Axios](https://axios-http.com/) (v1.7.0) with custom authorization interceptors.
- **Routing:** [React Router DOM](https://reactrouter.com/) (v6.27.0).
- **Styling:** Vanilla CSS (primarily located in `src/index.css` and `src/App.css`). *Note: Hardcoded Tailwind classes exist in TSX files but Tailwind CSS is not installed/configured.*

---

## 2. File and Folder Structure

```
sports-club-ai/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes/                # FastAPI endpoint handlers
│   │   │   │   ├── athletes.py
│   │   │   │   ├── attendance.py
│   │   │   │   ├── auth.py
│   │   │   │   ├── competitions.py
│   │   │   │   ├── equipment.py
│   │   │   │   ├── facilities.py
│   │   │   │   ├── injuries.py
│   │   │   │   ├── memberships.py
│   │   │   │   ├── ml.py
│   │   │   │   ├── performance.py
│   │   │   │   └── training.py
│   │   │   ├── crud_utils.py          # Dynamic GET/PUT/DELETE router utilities
│   │   │   └── deps.py                # Authentication and RBAC dependencies
│   │   ├── core/
│   │   │   ├── config.py              # Pydantic BaseSettings config loading
│   │   │   ├── roles.py               # Role & permission mapping definitions
│   │   │   └── security.py            # Password hashing & JWT helper utilities
│   │   ├── db/
│   │   │   └── base.py                # Database connection engine & session maker
│   │   ├── ml/
│   │   │   ├── artifacts/             # Trained .joblib pipelines
│   │   │   │   ├── injury_1.0.0.joblib
│   │   │   │   └── performance_1.0.0.joblib
│   │   │   ├── features.py            # Dataset & feature builders
│   │   │   └── service.py             # ML model training, prediction, & recommendations
│   │   ├── main.py                    # FastAPI app initialization & setup
│   │   ├── models.py                  # SQLAlchemy declarative database models
│   │   └── schemas.py                 # Pydantic request/response models
│   ├── migrations/                    # Alembic migration environment & scripts
│   │   └── versions/                  # Database migration files
│   ├── .env.example                   # Local config defaults
│   ├── alembic.ini                    # Alembic CLI configuration
│   ├── requirements.txt               # Backend dependencies list
│   └── seed.py                        # Mock data database seed script
├── db/
│   └── docker-compose.yml             # Postgres container orchestration setup
├── docs/                              # Project documentation (currently empty)
└── frontend/
    ├── public/                        # Static assets folder
    ├── src/
    │   ├── api/
    │   │   ├── auth.ts                # React AuthContext, Login, & Logout API integration
    │   │   └── client.ts              # Axios instance configuration & interceptors
    │   ├── assets/                    # React static assets
    │   ├── pages/                     # Frontend page components
    │   │   ├── Dashboard.tsx          # Basic list of athletes
    │   │   └── Login.tsx              # Simple login form
    │   ├── App.css                    # App global typography styling
    │   ├── App.tsx                    # Route definitions and session validation
    │   ├── index.css                  # Custom Vanilla CSS design tokens & CSS variables
    │   └── main.tsx                   # React app entrypoint
    ├── package.json                   # NPM dependencies & scripts
    ├── tsconfig.json                  # TypeScript compiler settings
    └── vite.config.ts                 # Vite bundler configuration
```

---

## 3. Database Models

The schema models are defined in [models.py](file:///c:/Users/USER/sports-club-ai/backend/app/models.py). The tables, keys, and relationships are structured as follows:

```mermaid
erDiagram
    User ||--o| Athlete : "1:0..1 relationship (user_id)"
    User ||--o{ TrainingSession : "coaches"
    Facility ||--o{ Equipment : "hosts"
    Facility ||--o{ TrainingSession : "hosts"
    Athlete ||--o{ Attendance : "records"
    TrainingSession ||--o{ Attendance : "tracks"
    Athlete ||--o{ PerformanceRecord : "owns"
    TrainingSession ||--o{ PerformanceRecord : "associated with"
    Competition ||--o{ PerformanceRecord : "associated with"
    Athlete ||--o{ InjuryRecord : "suffers"
    Athlete ||--o{ Membership : "subscribes"

    User {
        int id PK
        string email UK
        string full_name
        string hashed_password
        Enum role "admin, coach, athlete, physiotherapist, staff"
        bool is_active
        datetime created_at
    }

    Athlete {
        int id PK
        int user_id FK
        int jersey_number
        Enum playing_position "GK, DEF, MID, FWD"
        date date_of_birth
        float height_cm
        float weight_kg
        string nationality
        date joined_date
        text notes
    }

    Facility {
        int id PK
        string name
        string facility_type "pitch, gym, pool"
        string location
        int capacity
        bool is_available
    }

    Equipment {
        int id PK
        string name
        string category
        int facility_id FK
        int quantity
        string condition "good, fair, broken"
        date last_maintenance
    }

    TrainingSession {
        int id PK
        string title
        int coach_id FK
        int facility_id FK
        datetime scheduled_at
        int duration_min
        string intensity "low, medium, high"
        string focus "endurance, strength, tactics"
        text notes
    }

    Attendance {
        int id PK
        int athlete_id FK
        int session_id FK
        string status "present, absent, late"
        int minutes_late
        int rpe "1-10 rate of perceived exertion"
    }

    Competition {
        int id PK
        string name
        string opponent
        datetime match_date
        string venue
        string result "win, loss, draw"
        int our_score
        int opponent_score
    }

    PerformanceRecord {
        int id PK
        int athlete_id FK
        date recorded_at
        int session_id FK
        int competition_id FK
        float distance_km
        float top_speed_kmh
        int sprint_count
        float avg_heart_rate
        float max_heart_rate
        float training_load "duration_min * RPE"
        float vo2max_est
        float fitness_score "0-100"
        float match_rating "0-10"
    }

    InjuryRecord {
        int id PK
        int athlete_id FK
        string injury_type
        string body_part
        string severity "minor, moderate, severe"
        date occurred_on
        date returned_on
        string cause "training, match, other"
        text notes
    }

    Membership {
        int id PK
        int athlete_id FK
        string plan "standard, premium, junior"
        date start_date
        date end_date
        float amount_paid
        string status "active, expired, suspended"
    }

    MLModel {
        int id PK
        string name
        string model_type "performance, injury, recommendation"
        string version
        text metrics "JSON metadata string"
        datetime trained_at
        string artifact_path
    }
```

### Detailed Enums and Relations:
- **Role Permissions:** Defined in [roles.py](file:///c:/Users/USER/sports-club-ai/backend/app/core/roles.py):
  - `admin`: Full system permission (`*`).
  - `coach`: Can read/write `athlete`, `training`, `attendance`, `performance`, `competition`, `injury`, and read `ml`.
  - `athlete`: Can read self profiles/metrics (`athlete:read:self`, `performance:read:self`, `attendance:read:self`, `training:read:self`, `ml:read:self`).
  - `physiotherapist`: Can read `athlete`, `performance`, `ml`, and read/write `injury` records.
  - `staff`: Can read/write `membership`, `facility`, `equipment`, `attendance` records.

---

## 4. State Management

The frontend state management architecture is lightweight and utilizes React's built-in hooks and context system:

### 1. Authentication State
- Managed via `AuthProvider` in [auth.ts](file:///c:/Users/USER/sports-club-ai/frontend/src/api/auth.ts).
- Exposes a `user` object containing current session details (ID, full name, email, role, and active status) as well as `login()` and `logout()` handlers.
- **Persistence:**
  - The authentication JWT is saved to local storage (`token`).
  - The parsed user info object is serialized and saved to local storage (`user`).
  - On app load, `useEffect` synchronizes local storage user info back into the React context state.

### 2. HTTP Request Authentication
- Handled in [client.ts](file:///c:/Users/USER/sports-club-ai/frontend/src/api/client.ts).
- An Axios request interceptor intercepts all outgoing API calls, checks `localStorage` for a `token`, and appends it to headers as a Bearer token:
  ```typescript
  config.headers.Authorization = `Bearer ${token}`
  ```

### 3. Page and Component State
- Managed locally using the `useState` hook. For example, in `Dashboard.tsx`, standard `athletes` and `loading` states handle fetching data on mount via a standard `useEffect` call.
- Currently, there is no global store (e.g. Redux or Zustand) or query caching system (e.g. React Query).

---

## 5. Main Data Flows

### 1. User Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Athlete/Coach/Staff
    participant FE as React Client
    participant BE as FastAPI Server
    participant DB as Postgres Database

    User->>FE: Enters email and password on Login Page
    FE->>BE: POST /api/auth/login (form-data: username, password)
    BE->>DB: Query user by email
    DB-->>BE: Returns User model (with hashed_password)
    BE->>BE: Verify password using bcrypt
    BE-->>FE: Return JSON Web Token (JWT)
    Note over FE: Save JWT token to localStorage
    FE->>BE: GET /api/auth/me (Authorization: Bearer <token>)
    BE->>DB: Fetch user profile by decoded ID
    DB-->>BE: Returns User profile
    BE-->>FE: Returns User details (role, full_name)
    Note over FE: Save User object to localStorage & React state
    FE->>User: Redirects to Dashboard
```

### 2. Entity CRUD Flow (Example: Listing & Modifying Facilities)

```mermaid
sequenceDiagram
    autonumber
    actor Staff as Staff User
    participant FE as React Client
    participant BE as FastAPI Server
    participant DB as Postgres Database

    Staff->>FE: Clicks "Add Facility" and submits form
    FE->>BE: POST /api/facilities (Body: FacilityCreate, Auth Header)
    BE->>BE: get_current_user & require_permission("facility:write")
    BE->>DB: Insert Facility record
    DB-->>BE: Return new Facility model
    BE-->>FE: Return FacilityOut response
    FE->>Staff: Render updated list of facilities
```
*Note: The FastAPI routes dynamically generate details for items (GET by ID, PUT, DELETE) using a shared helper `register_crud` inside `crud_utils.py`.*

### 3. Machine Learning Training & Prediction Flow

```mermaid
sequenceDiagram
    autonumber
    actor Coach as Coach
    participant FE as React Client
    participant BE as FastAPI Server
    participant ML as ML Service
    participant DB as Postgres Database

    Coach->>FE: Triggers "Train Models" in UI
    FE->>BE: POST /api/ml/train (Auth Header)
    BE->>BE: require_role(Role.COACH)
    BE->>ML: train_injury_model(db) & train_performance_model(db)
    ML->>DB: Query all Athletes, PerformanceRecords, & Attendance
    DB-->>ML: Raw records
    ML->>ML: build_features() - engineering metrics (loads, fitness score, RPE, etc.)
    ML->>ML: Fit StandardScaler and Train sklearn models (Logistic & Linear Regressions)
    ML->>ML: Save StandardScaler + Model pipelines as .joblib in app/ml/artifacts/
    ML->>DB: Save MLModel record (metrics, path, version)
    ML-->>BE: Return training status & sample size
    BE-->>FE: Returns execution details
    FE->>Coach: Show models trained successfully
```
