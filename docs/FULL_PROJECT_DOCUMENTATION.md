# 📖 Sports Club AI — Master System & Technical Documentation
**A Complete Step-by-Step Architectural, Functional, and Operational Guide**

---

## 📑 Table of Contents

1. [Executive Summary & Platform Purpose](#1-executive-summary--platform-purpose)
2. [Complete System Architecture & Tech Stack](#2-complete-system-architecture--tech-stack)
3. [Database Architecture & Entity-Relationship Model (ERD)](#3-database-architecture--entity-relationship-model-erd)
4. [Authentication, Sign-Up & Login Engine (Step-by-Step)](#4-authentication-sign-up--login-engine-step-by-step)
   - [4.1 The Sign-Up (Registration) Workflow](#41-the-sign-up-registration-workflow)
   - [4.2 The Login Workflow (OAuth2 Password Bearer)](#42-the-login-workflow-oauth2-password-bearer)
   - [4.3 Google OAuth 2.0 Single Sign-On (SSO) Flow](#43-google-oauth-20-single-sign-on-sso-flow)
   - [4.4 Quick Demo Access & 1-Click Role Switcher](#44-quick-demo-access--1-click-role-switcher)
   - [4.5 Frontend Auth State Management & Auto-Logout](#45-frontend-auth-state-management--auto-logout)
5. [User Provisioning & Role Management: Adding Stakeholders](#5-user-provisioning--role-management-adding-stakeholders)
   - [5.1 Adding Administrators](#51-adding-administrators)
   - [5.2 Adding Head Coaches & Assistant Coaches](#52-adding-head-coaches--assistant-coaches)
   - [5.3 Adding Athletes (4 Distinct Methods)](#53-adding-athletes-4-distinct-methods)
   - [5.4 Adding Physiotherapists & Operational Staff](#54-adding-physiotherapists--operational-staff)
   - [5.5 Account Status Toggling, Role Switching & Deletion Safeguards](#55-account-status-toggling-role-switching--deletion-safeguards)
6. [Role-Based Access Control (RBAC) & Security Enforcement](#6-role-based-access-control-rbac--security-enforcement)
7. [Machine Learning & Predictive Workload Analytics Engine](#7-machine-learning--predictive-workload-analytics-engine)
   - [7.1 The Science of ACWR (Acute:Chronic Workload Ratio)](#71-the-science-of-acwr-acutechronic-workload-ratio)
   - [7.2 Injury Risk Classification Model (Logistic Regression)](#72-injury-risk-classification-model-logistic-regression)
   - [7.3 Fitness & Performance Regressor (Gradient Boosting)](#73-fitness--performance-regressor-gradient-boosting)
   - [7.4 Algorithmic Heuristic Fallback Engine](#74-algorithmic-heuristic-fallback-engine)
   - [7.5 Automated Plain-English AI Recommendations](#75-automated-plain-english-ai-recommendations)
   - [7.6 1-Click Model Retraining Pipeline](#76-1-click-model-retraining-pipeline)
8. [Comprehensive Dashboard Guides & Operational Workflows](#8-comprehensive-dashboard-guides--operational-workflows)
   - [8.1 Club Administrator Console (`/dashboard/admin`)](#81-club-administrator-console-dashboardadmin)
   - [8.2 Head Coach Squad Hub (`/dashboard/coach`)](#82-head-coach-squad-hub-dashboardcoach)
   - [8.3 Physiotherapist & Staff Operations Hub (`/dashboard/staff`)](#83-physiotherapist--staff-operations-hub-dashboardstaff)
   - [8.4 Athlete Self-Service Portal (`/dashboard/athlete`)](#84-athlete-self-service-portal-dashboardathlete)
   - [8.5 Athlete Deep-Dive Profile View (`/athlete/:id`)](#85-athlete-deep-dive-profile-view-athleteid)
9. [UI/UX Architecture & Interactive Component System](#9-uiux-architecture--interactive-component-system)
   - [9.1 Collapsible Vertical Navigation Sidebar (`SidebarLayout.tsx`)](#91-collapsible-vertical-navigation-sidebar-sidebarlayouttsx)
   - [9.2 In-App Real-Time Notification Center Drawer](#92-in-app-real-time-notification-center-drawer)
   - [9.3 Modern Dark & Light Mode Theme Engine](#93-modern-dark--light-mode-theme-engine)
   - [9.4 Recharts Workload & Fatigue Visualizations](#94-recharts-workload--fatigue-visualizations)
10. [Exhaustive REST API Reference](#10-exhaustive-rest-api-reference)
11. [Installation, Database Seeding & Production Deployment](#11-installation-database-seeding--production-deployment)
12. [Troubleshooting & Frequently Asked Questions (FAQ)](#12-troubleshooting--frequently-asked-questions-faq)

---

## 1. Executive Summary & Platform Purpose

**Sports Club AI** is an enterprise-grade sports management and predictive analytics SaaS platform engineered for athletic clubs, academies, and professional teams. 

### The Core Problem It Solves
Traditionally, athletic clubs manage their day-to-day operations using fragmented tools:
- Paper notebooks and spreadsheets for training attendance and athlete rosters.
- WhatsApp groups or verbal updates between coaching staff and medical personnel.
- Disconnected physiotherapy files stored locally, leaving coaches blind to medical restrictions.
- Physical whiteboards for gym and training pitch bookings, resulting in double-bookings and scheduling conflicts.

This fragmentation leads to catastrophic failures in athlete health. When daily training load (intensity $\times$ duration) is unmonitored, athletes enter severe acute fatigue spikes. According to sports science research by Dr. Tim Gabbett, sudden workload spikes where 7-day Acute Load significantly exceeds 28-day Chronic Baseline drastically increase non-contact soft-tissue injuries (e.g., hamstring strains, groin pulls, calf tears).

### The Solution: Sports Club AI
Sports Club AI bridges sports science theory with daily club operations by providing:
1. **Unified Operational Hub**: Centralized management of athlete profiles, training sessions, attendance records, match fixtures, facilities, equipment, and subscription memberships.
2. **Real-Time ACWR Tracking**: Automatic calculation of Acute-to-Chronic Workload Ratios based on athlete-reported Rate of Perceived Exertion (RPE 1–10).
3. **Predictive Machine Learning**: Pre-trained and retrainable `scikit-learn` models that calculate injury risk probabilities ($0\text{--}100\%$) and forecast match readiness scores.
4. **Physiotherapy & Return-to-Play**: Instant medical logging and 1-click Return-to-Play clinical clearance.
5. **Role-Tailored Portals**: Custom interfaces built specifically for Club Administrators, Head Coaches, Physiotherapists, Operational Staff, and Athletes.

---

## 2. Complete System Architecture & Tech Stack

The application is architected as a modern decoupled Single Page Application (SPA) communicating over a secure RESTful API with an asynchronous Python backend and a relational database.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CLIENT TIER: React 19 + TypeScript                     │
│  - Vite 8 Bundler       - React Router DOM v6        - Recharts Visuals     │
│  - Tailwind CSS Tokens  - Lucide React Icons         - Google OAuth 2.0     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTPS / JSON REST (Bearer JWT)
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    APPLICATION TIER: FastAPI (Python 3.11)                  │
│  - OAuth2 Password Bearer & JWT Security      - Pydantic v2 Schema Validation│
│  - SQLAlchemy 2.0 ORM Engine                  - Dynamic CRUD Utility Routers │
│  - RBAC Permission Decorator Guards           - 1-Click CSV Streaming Engine │
└──────────────────────────┬───────────────────────────────┬──────────────────┘
                           │                               │
┌──────────────────────────▼───────────┐       ┌───────────▼──────────────────┐
│      PERSISTENCE TIER: Database      │       │     PREDICTIVE ML SUBSYSTEM   │
│  - SQLite (Local Dev: sportsclub.db) │       │  - scikit-learn Pipelines    │
│  - PostgreSQL 16 (Docker Production) │       │  - StandardScaler + Models   │
│  - Alembic Database Schema Versioning│       │  - .joblib Artifact Storage  │
└──────────────────────────────────────┘       └──────────────────────────────┘
```

### Technology Breakdown

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React + TypeScript | 19.2.7 / 6.0.2 | Reactive UI components with strict static typing. |
| **Frontend Bundler** | Vite | 8.1.1 | High-speed Hot Module Replacement (HMR) & production minification. |
| **Routing** | React Router DOM | 6.27.0 | Client-side routing, protected routes, and role redirection. |
| **HTTP Client** | Axios | 1.7.0 | Centralized API client with auth interceptors for token injection and 401 handling. |
| **Data Visualization**| Recharts | 2.15.0 | Interactive SVG charts for acute/chronic training load trends. |
| **Icons & Design** | Lucide Icons + Custom CSS | Latest | Modern glassmorphism design tokens supporting Dark and Light modes. |
| **Backend Framework** | FastAPI | 0.115.0+ | Asynchronous high-performance REST API with automated OpenAPI docs. |
| **Data Validation** | Pydantic v2 | 2.9.0+ | Strict request validation, error formatting, and response serialization. |
| **Database ORM** | SQLAlchemy 2.0 | 2.0.35+ | Pythonic relational mapping, connection pooling, and cascade management. |
| **Schema Migrations** | Alembic | 1.13.0+ | Track and apply database schema revisions safely. |
| **Security & Auth** | `bcrypt` + `python-jose` | Latest | Salted password hashing and HMAC-SHA256 JWT access tokens. |
| **Machine Learning** | `scikit-learn`, `pandas` | Latest | Logistic Regression (injury risk) and Gradient Boosting Regressor (fitness). |
| **Artifact Storage** | `joblib` | Latest | Serialized ML models and preprocessors saved to disk. |

---

## 3. Database Architecture & Entity-Relationship Model (ERD)

The relational schema consists of 10 primary tables designed with relational integrity, foreign key cascading, and strict unique constraints.

### 3.1 Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o| Athlete : "user_id (1:1)"
    User ||--o{ TrainingSession : "coach_id (1:N)"
    Athlete ||--o{ Attendance : "athlete_id (1:N)"
    Athlete ||--o{ PerformanceRecord : "athlete_id (1:N)"
    Athlete ||--o{ InjuryRecord : "athlete_id (1:N)"
    Athlete ||--o{ Membership : "athlete_id (1:N)"
    TrainingSession ||--o{ Attendance : "session_id (1:N)"
    TrainingSession ||--o{ PerformanceRecord : "session_id (1:N)"
    Facility ||--o{ TrainingSession : "facility_id (1:N)"
    Facility ||--o{ Equipment : "facility_id (1:N)"
    Competition ||--o{ PerformanceRecord : "competition_id (1:N)"

    User {
        int id PK
        string email UK
        string full_name
        string hashed_password
        enum role
        bool is_active
        datetime created_at
    }

    Athlete {
        int id PK
        int user_id FK, UK
        int jersey_number
        enum playing_position
        date date_of_birth
        float height_cm
        float weight_kg
        string nationality
        date joined_date
        text notes
    }

    TrainingSession {
        int id PK
        string title
        int coach_id FK
        int facility_id FK
        datetime scheduled_at
        int duration_min
        enum intensity
        string focus
        text notes
    }

    Attendance {
        int id PK
        int athlete_id FK
        int session_id FK
        enum status
        int minutes_late
        int rpe
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
        float training_load
        float vo2max_est
        float fitness_score
        float match_rating
    }

    InjuryRecord {
        int id PK
        int athlete_id FK
        string injury_type
        string body_part
        enum severity
        date occurred_on
        date returned_on
        string cause
        text notes
    }

    Facility {
        int id PK
        string name
        enum facility_type
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
        enum condition
        date last_maintenance
    }

    Membership {
        int id PK
        int athlete_id FK
        enum plan
        date start_date
        date end_date
        float amount_paid
        enum status
    }

    MLModel {
        int id PK
        string name
        enum model_type
        string version
        text metrics
        datetime trained_at
        string artifact_path
    }
```

### 3.2 Data Dictionary & Table Specifications

1. **`users`**:
   - `id` (Integer, Primary Key)
   - `email` (String 255, Unique, Indexed, Non-null): Login identifier.
   - `full_name` (String 255, Non-null): Real name of user.
   - `hashed_password` (String 255, Non-null): Passlib bcrypt-hashed password string.
   - `role` (Enum: `admin`, `coach`, `athlete`, `physiotherapist`, `staff`): Defines authorization level.
   - `is_active` (Boolean, Default True): Allows deactivating users without deleting historical records.
   - `created_at` (DateTime, UTC): Timestamp of account creation.

2. **`athletes`**:
   - `id` (Integer, Primary Key)
   - `user_id` (Integer, Foreign Key `users.id`, Unique): 1-to-1 link to user account. Cascade deleted on user removal.
   - `jersey_number` (Integer, Nullable): Squad shirt number.
   - `playing_position` (Enum: `GK`, `DEF`, `MID`, `FWD`): Tactical position on the pitch.
   - `date_of_birth` (Date, Nullable): Used for age-group filtering and metabolic calculations.
   - `height_cm`, `weight_kg` (Float, Nullable): Biometric metrics used for physical modeling.
   - `nationality` (String 100, Nullable): Country representation.
   - `joined_date` (Date, Default today): Club enrollment date.
   - `notes` (Text, Nullable): Scouting and coach feedback notes.

3. **`training_sessions`**:
   - `id` (Integer, Primary Key)
   - `title` (String 255, Non-null): Drill or session name (e.g., "High-Intensity Interval Drill").
   - `coach_id` (Integer, Foreign Key `users.id`): Coach who designed and scheduled the session.
   - `facility_id` (Integer, Foreign Key `facilities.id`, Nullable): Pitch or gym where session takes place.
   - `scheduled_at` (DateTime, Non-null): Date and time of the training event.
   - `duration_min` (Integer, Default 90): Duration of training in minutes.
   - `intensity` (Enum: `low`, `medium`, `high`): Planned physiological intensity.
   - `focus` (String 100, Nullable): Training focus (e.g., "Tactics", "Endurance", "Recovery").
   - `notes` (Text, Nullable): Specific instructions or drill plans.

4. **`attendances`**:
   - `id` (Integer, Primary Key)
   - `athlete_id` (Integer, Foreign Key `athletes.id`): Athlete recording attendance.
   - `session_id` (Integer, Foreign Key `training_sessions.id`): Session reference.
   - **Unique Constraint (`uq_attendance`)**: An athlete can have at most one attendance record per session.
   - `status` (Enum: `present`, `absent`, `late`): Attendance outcome.
   - `minutes_late` (Integer, Default 0): Tardiness duration.
   - `rpe` (Integer 1–10, Nullable): **Rate of Perceived Exertion** reported by athlete. Crucial input for ACWR calculations.

5. **`performance_records`**:
   - `id` (Integer, Primary Key)
   - `athlete_id` (Integer, Foreign Key `athletes.id`): Player tracked.
   - `recorded_at` (Date, Default today): Date telemetry was logged.
   - `session_id` / `competition_id` (Foreign Keys, Nullable): Context of activity.
   - `distance_km` (Float): Total distance covered during the session.
   - `top_speed_kmh` (Float): Peak sprint velocity recorded.
   - `sprint_count` (Integer): Total high-speed sprints (>24 km/h).
   - `avg_heart_rate`, `max_heart_rate` (Float): Cardiovascular load.
   - `training_load` (Float): Session load ($\text{Duration} \times \text{RPE}$).
   - `fitness_score` (Float 0–100): Calculated fitness rating.
   - `match_rating` (Float 0–10): Coach assessment rating.

6. **`injury_records`**:
   - `id` (Integer, Primary Key)
   - `athlete_id` (Integer, Foreign Key `athletes.id`): Injured player.
   - `injury_type` (String 100): Clinical diagnosis (e.g., "Hamstring strain", "Ankle sprain").
   - `body_part` (String 100): Anatomical location (e.g., "Left Leg", "Right Knee").
   - `severity` (Enum: `minor`, `moderate`, `severe`): Clinical grade.
   - `occurred_on` (Date): Injury inception date.
   - `returned_on` (Date, Nullable): Date cleared by physiotherapist for full training. `None` indicates an **active injury**.
   - `cause` (String 100): Context ("training", "match", "other").
   - `notes` (Text, Nullable): Clinical treatment notes and rehab protocol.

7. **`facilities`**:
   - `id` (Integer, Primary Key)
   - `name` (String 255): Facility name (e.g., "Main Stadium Pitch A", "Performance Gym").
   - `facility_type` (Enum: `pitch`, `gym`, `pool`).
   - `location` (String 255): Physical campus sector.
   - `capacity` (Integer): Maximum athlete occupancy.
   - `is_available` (Boolean, Default True): Availability toggle.

8. **`equipment`**:
   - `id` (Integer, Primary Key)
   - `name` (String 255): Gear title (e.g., "GPS Tracking Vests", "Speed Ladders").
   - `category` (String 100): Equipment classification.
   - `facility_id` (Integer, Foreign Key `facilities.id`, Nullable): Stored location.
   - `quantity` (Integer): Item count in inventory.
   - `condition` (Enum: `good`, `fair`, `broken`).
   - `last_maintenance` (Date, Nullable): Last inspection date.

9. **`memberships`**:
   - `id` (Integer, Primary Key)
   - `athlete_id` (Integer, Foreign Key `athletes.id`): Subscribed player.
   - `plan` (Enum: `standard`, `premium`, `junior`): Membership tier.
   - `start_date`, `end_date` (Date): Active billing cycle.
   - `amount_paid` (Float): Financial transaction total in USD.
   - `status` (Enum: `active`, `expired`, `suspended`).

10. **`ml_models`**:
    - `id` (Integer, Primary Key)
    - `name` (String 100): Model identifier (e.g., "injury-risk", "performance").
    - `model_type` (Enum: `performance`, `injury`, `recommendation`).
    - `version` (String 20): Version tag (e.g., "1.0.0").
    - `metrics` (Text): Serialized JSON storing ROC-AUC, accuracy, R2 score, MAE, and sample counts.
    - `trained_at` (DateTime): UTC timestamp when training completed.
    - `artifact_path` (String 255): Filesystem path to serialized `.joblib` pipeline bundle.

---

## 4. Authentication, Sign-Up & Login Engine (Step-by-Step)

The authentication system employs JSON Web Tokens (JWT) signed with HMAC-SHA256, alongside bcrypt password salting, following the OAuth2 Password Bearer specification.

```
       ┌───────────┐                 ┌─────────────┐                 ┌──────────┐
       │   User    │                 │   FastAPI   │                 │ Database │
       │ (Browser) │                 │   Backend   │                 │ (SQLite) │
       └─────┬─────┘                 └──────┬──────┘                 └────┬─────┘
             │                              │                             │
    [ 1. User Enters Email & Password ]     │                             │
             │                              │                             │
             │ POST /api/auth/login         │                             │
             │ (username=email, password)   │                             │
             ├─────────────────────────────>│                             │
             │                              │ Query User by Email         │
             │                              ├────────────────────────────>│
             │                              │<────────────────────────────┤
             │                              │                             │
             │                              │ verify_password(pw, hash)   │
             │                              │ check user.is_active        │
             │                              │                             │
             │                              │ create_access_token(sub=id) │
             │                              │ (HMAC-SHA256 with Secret)   │
             │                              │                             │
             │ HTTP 200 OK                  │                             │
             │ {"access_token": "...",      │                             │
             │  "token_type": "bearer"}     │                             │
             │<─────────────────────────────┤                             │
             │                              │                             │
    [ 2. Store Token in localStorage ]      │                             │
             │                              │                             │
             │ GET /api/auth/me             │                             │
             │ Authorization: Bearer <JWT>  │                             │
             ├─────────────────────────────>│                             │
             │                              │ Decode & verify JWT         │
             │                              │ Fetch User record           │
             │                              ├────────────────────────────>│
             │                              │<────────────────────────────┤
             │ HTTP 200 OK {User Object}    │                             │
             │<─────────────────────────────┤                             │
             │                              │                             │
    [ 3. Store User in localStorage ]       │                             │
    [ 4. Redirect based on user.role ]      │                             │
             │                              │                             │
```

### 4.1 The Sign-Up (Registration) Workflow

Sign-up allows public or administrative creation of user accounts via `POST /api/auth/register`.

#### Step-by-Step Execution:
1. **Payload Submission**:
   The client submits a JSON payload adhering to `UserCreate`:
   ```json
   {
     "email": "newplayer@club.com",
     "full_name": "Marcus Rashford",
     "password": "SecurePassword123",
     "role": "athlete"
   }
   ```
2. **Email Uniqueness Verification**:
   The backend queries the `users` table:
   ```python
   if db.query(User).filter(User.email == payload.email).first():
       raise HTTPException(status_code=400, detail="Email already registered")
   ```
3. **Role Validation**:
   The submitted `role` string is validated against the `Role` enum (`admin`, `coach`, `athlete`, `physiotherapist`, `staff`).
4. **Password Hashing**:
   The raw password is encrypted using `passlib.context.CryptContext` with the `bcrypt` hashing algorithm (cost factor 12). The raw password is never stored or logged.
5. **Database User Record Creation**:
   A `User` record is created with `is_active=True` and committed.
6. **Automatic Athlete Profile Provisioning**:
   **Crucial Architectural Feature:** If the user registered with the role `athlete`, the system automatically provisions an associated `Athlete` profile record:
   ```python
   if role == Role.ATHLETE:
       existing_athlete = db.query(Athlete).filter(Athlete.user_id == user.id).first()
       if not existing_athlete:
           db.add(Athlete(user_id=user.id))
           db.commit()
   ```
   This guarantees that every athlete user account always has a valid relational profile ready for training, attendance, and biometric tracking.
7. **Response**:
   The backend responds with `UserOut` (excluding the password hash) with `HTTP 201 Created`.

---

### 4.2 The Login Workflow (OAuth2 Password Bearer)

The standard login is executed via `POST /api/auth/login`.

#### Step-by-Step Execution:
1. **Form Data Submission**:
   The React login interface transmits the user credentials using standard `application/x-www-form-urlencoded` format (FastAPI `OAuth2PasswordRequestForm`):
   - `username`: Email address (e.g., `coach@example.com`)
   - `password`: Plaintext password (e.g., `coach123`)
2. **Account Retrieval**:
   The backend retrieves the user record matching `User.email == form_data.username`. If no matching record is found, an `HTTP 401 Unauthorized` exception is thrown immediately.
3. **Cryptographic Hash Verification**:
   The backend verifies the password against the stored bcrypt hash using `verify_password()`:
   ```python
   if not user or not verify_password(form_data.password, str(user.hashed_password)):
       raise HTTPException(status_code=401, detail="Invalid credentials")
   ```
4. **Active Account Check**:
   The backend checks `user.is_active`. If an administrator has suspended the account, login is blocked with `HTTP 400 Bad Request: "Inactive user"`.
5. **JWT Token Generation**:
   A signed JWT token is minted using `create_access_token()`:
   - Payload `sub`: User ID as a string (e.g., `"2"`).
   - Payload `exp`: Expiration timestamp (current UTC time + 8 days / 11,520 minutes).
   - Algorithmic Signature: HMAC-SHA256 (`HS256`) using `settings.SECRET_KEY`.
6. **Token Delivery**:
   The backend returns:
   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
     "token_type": "bearer"
   }
   ```
7. **Frontend Storage & Session Hydration**:
   In `frontend/src/api/auth.tsx`:
   - `localStorage.setItem('token', access_token)`
   - The client immediately issues `GET /api/auth/me` with header `Authorization: Bearer <access_token>`.
   - The user profile JSON is saved to `localStorage.setItem('user', JSON.stringify(me.data))`.
   - The `user` state inside React's `AuthContext` is updated.
8. **Role-Based Redirection**:
   The `Login.tsx` component inspects `user.role` and executes automatic client-side routing:
   - `role === 'admin'` $\rightarrow$ navigates to `/dashboard/admin`
   - `role === 'coach'` $\rightarrow$ navigates to `/dashboard/coach`
   - `role === 'athlete'` $\rightarrow$ navigates to `/dashboard/athlete`
   - `role === 'physiotherapist' || role === 'staff'` $\rightarrow$ navigates to `/dashboard/staff`

---

### 4.3 Google OAuth 2.0 Single Sign-On (SSO) Flow

Sports Club AI includes built-in Google Identity Services SSO.

#### Step-by-Step Execution:
1. **Client Trigger**: The user clicks the **Continue with Google** button rendered via `@react-oauth/google` on the login screen.
2. **Google Authentication**: Google displays an OAuth consent pop-up. Upon approval, Google issues a signed JWT `id_token`.
3. **API Transmission**: The React frontend sends the token via `POST /api/auth/google`:
   ```json
   { "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI..." }
   ```
4. **Backend Cryptographic Verification**:
   FastAPI verifies the token directly against Google's public keys using `google.oauth2.id_token.verify_oauth2_token()` and matches the audience against `settings.GOOGLE_CLIENT_ID`.
5. **Identity & Email Verification**:
   The payload must contain a verified email (`email_verified == True`).
6. **Pending Administrator Approval Workflow**:
   If the email does not exist in the database:
   - An athlete account is automatically provisioned with `is_active=False` (Pending Approval).
   - An unguessable 32-byte cryptographically secure random password is generated using `secrets.token_urlsafe(32)` to fulfill database non-null constraints.
   - A matching `Athlete` profile is automatically created in the same transaction.
   - The user is notified with an `HTTP 403 Forbidden` response:
     *"Your account has been registered via Google and is pending administrator approval. Please contact your club administrator to activate your access."*
7. **Admin Review & Acceptance**:
   - The Administrator sees the new user flagged with a glowing **Pending Approval** alert banner and sidebar badge on the **Admin Console (`/dashboard/admin`)**.
   - The Admin can click **Accept** to activate their access or **Decline** to delete and reject the registration.
   - Once accepted, subsequent Google sign-ins succeed immediately and issue a valid JWT access token.

---

### 4.4 Quick Demo Access & 1-Click Role Switcher

To allow seamless evaluation and presentation without typing credentials, the login screen provides 4 interactive quick-demo tiles:

| Tile | Role | Email | Password | Target Dashboard |
| :--- | :--- | :--- | :--- | :--- |
| 👑 **Admin** | Administrator | `admin@example.com` | `admin123` | `/dashboard/admin` |
| 🏆 **Coach** | Head Coach | `coach@example.com` | `coach123` | `/dashboard/coach` |
| ⚡ **Athlete** | First-Team Forward | `athlete@example.com` | `athlete123` | `/dashboard/athlete` |
| 🩺 **Physio** | Physiotherapist | `physio@example.com` | `physio123` | `/dashboard/staff` |

Clicking any demo button automatically fills the email and password input fields, sets the active role highlight ring, and displays an autofill confirmation badge. The user only needs to click **Sign In to Dashboard**.

---

### 4.5 Frontend Auth State Management & Auto-Logout

The Axios HTTP client (`frontend/src/api/client.ts`) handles session persistence and automated error interception:
1. **Request Interceptor**:
   Reads `localStorage.getItem('token')`. If present, it attaches the header:
   `Authorization: Bearer <token>`
2. **Response Interceptor (401 Auto-Logout)**:
   If any API endpoint returns `HTTP 401 Unauthorized` (e.g., token expired or revoked):
   - `localStorage.removeItem('token')`
   - `localStorage.removeItem('user')`
   - The user is immediately redirected to `/login`.
3. **Route Protection (`ProtectedRoute` in `App.tsx`)**:
   Ensures unauthenticated users cannot access dashboard routes and blocks unauthorized roles from accessing restricted panels (e.g., an Athlete cannot open `/dashboard/admin`).

---

## 5. User Provisioning & Role Management: Adding Stakeholders

Adding athletes, coaches, administrators, and medical staff can be performed through multiple pathways tailored for different operational scenarios.

### 5.1 Adding Administrators
Administrators possess global system privileges (`*`).

#### Method: Admin Dashboard UI
1. Log in as an Administrator (`admin@example.com`).
2. Navigate to **User Directory** tab on `/dashboard/admin`.
3. Click the **+ Add New User** button in the top-right corner.
4. Complete the modal form:
   - **Full Name**: e.g., "Director John Smith"
   - **Email Address**: e.g., "director@club.com"
   - **Password**: Secure temporary password
   - **Role**: Select **Admin**
5. Click **Create User Account**.
6. Behind the scenes:
   - FastAPI receives `POST /api/users`.
   - The password is encrypted with `bcrypt`.
   - The new admin user is stored with `role = Role.ADMIN` and `is_active = True`.

---

### 5.2 Adding Head Coaches & Assistant Coaches
Coaches manage tactical training sessions, squad rosters, attendance, match fixtures, and ML analytics.

#### Method: Admin Dashboard UI
1. In the **Admin Console** (`/dashboard/admin`), open the **User Directory** tab.
2. Click **+ Add New User**.
3. Enter the Coach's name, club email, and password.
4. Select **Coach** from the Role dropdown.
5. Click **Create User Account**.
6. The coach can now log in at `/login` and will be automatically routed to `/dashboard/coach`.

---

### 5.3 Adding Athletes (4 Distinct Methods)

Sports Club AI provides four ways to add athletes to the system:

#### Method A: Administrator Console (Standard Operational Path)
1. On `/dashboard/admin` $\rightarrow$ **User Directory** $\rightarrow$ click **+ Add New User**.
2. Enter the athlete's name, email, and password.
3. Select **Athlete** in the Role dropdown.
4. Click **Create User Account**.
5. **Automated Dual-Record Provisioning**:
   FastAPI creates the `User` record AND immediately creates a linked `Athlete` record in the database:
   ```python
   if payload.role == Role.ATHLETE:
       existing_athlete = db.query(Athlete).filter(Athlete.user_id == user.id).first()
       if not existing_athlete:
           db.add(Athlete(user_id=user.id))
           db.commit()
   ```

#### Method B: Coach/Admin Athlete Registration API (With Biometrics)
To register an athlete and populate their physical biometrics simultaneously, use `POST /api/athletes`:
- **Required Permission**: `athlete:write` (Coaches and Admins).
- **Request Payload**:
  ```json
  {
    "full_name": "Erling Haaland",
    "email": "haaland@club.com",
    "password": "StrikerPassword9",
    "jersey_number": 9,
    "playing_position": "FWD",
    "date_of_birth": "2000-07-21",
    "height_cm": 194.0,
    "weight_kg": 88.0,
    "nationality": "Norway"
  }
  ```
- **Backend Execution**:
  Creates the `User` record, flushes the transaction to retrieve the auto-generated `user.id`, creates the `Athlete` record linked to that `user.id` with all biometric specifications, and commits both atomically.

#### Method C: Public Self-Registration
1. An athlete visits the registration endpoint `POST /api/auth/register`.
2. Provides name, email, password, and sets `role = "athlete"`.
3. The backend creates their user account and provisions their `Athlete` profile automatically.

#### Method D: Google Single Sign-On Self-Provisioning
1. The athlete clicks **Continue with Google** on `/login`.
2. The backend verifies the Google token and provisions both `User` and `Athlete` records instantly.

---

### 5.4 Adding Physiotherapists & Operational Staff

#### Method: Admin Dashboard UI
1. Navigate to `/dashboard/admin` $\rightarrow$ **User Directory**.
2. Click **+ Add New User**.
3. Fill in the user details:
   - For medical staff: Select **Physiotherapist**.
   - For groundskeepers and inventory managers: Select **Staff**.
4. Click **Create User Account**.
5. Upon logging in, Physiotherapists and Staff are automatically routed to `/dashboard/staff`, where they can manage medical incidents, facilities, and equipment inventory.

---

### 5.5 Account Status Toggling, Role Switching & Deletion Safeguards

The platform incorporates strict security guardrails in `backend/app/api/routes/users.py`:

1. **Active/Suspended Account Toggle**:
   - Admins can instantly suspend or reactivate an account with 1 click.
   - Suspended users cannot log in (returns `HTTP 400 Inactive user`).
   - **Self-Lockout Prevention**: An administrator **cannot** deactivate their own account:
     ```python
     if user.id == current_admin.id and not payload.is_active:
         raise HTTPException(status_code=400, detail="You cannot deactivate your own administrator account.")
     ```
2. **Role Escalation & Demotion**:
   - Admins can change user roles dynamically via `PUT /api/users/{user_id}/role`.
   - If an existing user's role is updated to `Athlete`, the system automatically ensures an `Athlete` profile record is generated.
   - **Self-Demotion Prevention**: An administrator **cannot** revoke their own admin privileges.
3. **Account Deletion & Foreign Key Cascades**:
   - Admins can delete users via `DELETE /api/users/{user_id}`.
   - SQLAlchemy's `cascade="all, delete-orphan"` ensures that when an athlete's user account is deleted, their linked attendances, performances, injuries, and memberships are cleanly cleaned up, preventing orphaned foreign key errors.
   - **Self-Deletion Prevention**: An admin **cannot** delete their own account.

---

## 6. Role-Based Access Control (RBAC) & Security Enforcement

Every API endpoint is protected by role-based or permission-based dependency guards located in `backend/app/api/deps.py` and `backend/app/core/roles.py`.

### 6.1 Role Permissions Matrix

| Granular Permission | Description | Admin | Coach | Athlete | Physio | Staff |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| `*` | Superuser full access | ✅ | ❌ | ❌ | ❌ | ❌ |
| `athlete:read` | Read squad athlete profiles | ✅ | ✅ | ❌ | ✅ | ✅ |
| `athlete:write` | Create / edit squad athletes | ✅ | ✅ | ❌ | ❌ | ❌ |
| `athlete:read:self`| Read own athlete profile | ✅ | ❌ | ✅ | ❌ | ❌ |
| `training:read` | View all training sessions | ✅ | ✅ | ❌ | ❌ | ❌ |
| `training:write`| Schedule / edit training | ✅ | ✅ | ❌ | ❌ | ❌ |
| `training:read:self`| View assigned sessions | ✅ | ❌ | ✅ | ❌ | ❌ |
| `attendance:read`| View squad attendance records| ✅ | ✅ | ❌ | ❌ | ✅ |
| `attendance:write`| Log presence and RPE scores | ✅ | ✅ | ❌ | ❌ | ✅ |
| `attendance:write:self`| Submit self session RPE | ✅ | ❌ | ✅ | ❌ | ❌ |
| `injury:read` | Read squad injury logs | ✅ | ✅ | ❌ | ✅ | ✅ |
| `injury:write`| Log injury & 1-click RTP | ✅ | ✅ | ❌ | ✅ | ✅ |
| `facility:read` | View pitches and gyms | ✅ | ❌ | ❌ | ✅ | ✅ |
| `facility:write`| Manage grounds & availability| ✅ | ❌ | ❌ | ❌ | ✅ |
| `equipment:read`| View equipment inventory | ✅ | ❌ | ❌ | ✅ | ✅ |
| `equipment:write`| Update gear quantities/states| ✅ | ❌ | ❌ | ❌ | ✅ |
| `membership:read`| View membership plans | ✅ | ❌ | ❌ | ✅ | ✅ |
| `membership:write`| Provision membership tiers | ✅ | ❌ | ❌ | ✅ | ✅ |
| `ml:read` | View squad ML risk & forecast | ✅ | ✅ | ❌ | ✅ | ❌ |
| `ml:read:self` | View own ML risk score | ✅ | ❌ | ✅ | ❌ | ❌ |
| `ml:train` | Retrain ML model pipelines | ✅ | ✅ | ❌ | ❌ | ❌ |

### 6.2 Permission Guard Enforcement in FastAPI

FastAPI endpoints enforce security using the `require_permission` and `require_role` dependency injection functions:

```python
# Example: Only users with 'training:write' permission can create training sessions
@router.post("", response_model=TrainingSessionOut)
def create_session(
    payload: TrainingSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("training:write")),
):
    ...
```

If an Athlete attempts to call `POST /api/training`, the dependency evaluates `has_permission(user.role, "training:write")`, finds it missing, and immediately returns `HTTP 403 Forbidden: "Permission 'training:write' required"`.

---

## 7. Machine Learning & Predictive Workload Analytics Engine

The machine learning subsystem lives in `backend/app/ml/` and provides predictive intelligence to protect athletes from overtraining and soft-tissue muscular injuries.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TRAINING INGESTION & DATASET                          │
│     Docs / Data: football_ml_model_ready.csv (Professional Squad Data)      │
│  - 18 Workload Attributes (ACWR, ATL, CTL28, Top Speed, Distance, Strain)  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    MODEL 1: INJURY RISK CLASSIFIER                          │
│  - Algorithm: LogisticRegression(class_weight="balanced", max_iter=1000)    │
│  - Preprocessor: StandardScaler()                                           │
│  - Metrics: 89.63% Accuracy, 83.27% ROC-AUC                                 │
│  - Output: Risk Probability (0.00 to 1.00) -> Low / Moderate / High Risk    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                  MODEL 2: MATCH READINESS REGRESSOR                         │
│  - Algorithm: GradientBoostingRegressor(n_estimators=100)                   │
│  - Preprocessor: StandardScaler()                                           │
│  - Output: Continuous Match Fitness Score (20.0 to 100.0)                   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    PLAIN-ENGLISH RECOMMENDATIONS ENGINE                     │
│  - Synthesizes ACWR, Injury Risk, Attendance Rate, and Training Load       │
│  - Generates Actionable Coaching Directives (e.g., "Reduce load by 25%")   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.1 The Science of ACWR (Acute:Chronic Workload Ratio)

The platform implements the scientific workload monitoring framework established by Dr. Tim Gabbett:

1. **Daily Session Training Load (Arbitrary Units - AU)**:
   $$\text{Session Load (AU)} = \text{Session Duration (min)} \times \text{RPE Rating (1--10)}$$
   *Example*: A 90-minute tactical training drill with an RPE exertion rating of 8 produces:
   $$90 \times 8 = 720\text{ AU}$$

2. **Acute Training Load (ATL — 7-Day Rolling Average)**:
   Measures acute fatigue over the past 7 days:
   $$\text{ATL} = \frac{1}{7} \sum_{i=1}^{7} \text{Load}_i$$

3. **Chronic Training Load (CTL — 28-Day Rolling Average)**:
   Measures historical fitness baseline over the past 28 days:
   $$\text{CTL}_{28} = \frac{1}{28} \sum_{j=1}^{28} \text{Load}_j$$

4. **Acute-to-Chronic Workload Ratio (ACWR)**:
   $$\text{ACWR} = \frac{\text{ATL}}{\text{CTL}_{28} + 10^{-5}}$$

#### The Workload Zones:
- **$\text{ACWR} < 0.8$ (Under-training Zone)**: Athlete is under-conditioned; fitness is declining; higher risk when returning to match intensity.
- **$0.8 \le \text{ACWR} \le 1.3$ (The Sweet Spot)**: Optimal conditioning zone where athletic performance increases and injury risk is minimized.
- **$1.3 < \text{ACWR} \le 1.5$ (Elevated Alert Zone)**: Workload is increasing faster than physical adaptations allow.
- **$\text{ACWR} > 1.5$ (The Danger Zone)**: High acute fatigue spike. Research indicates relative injury risk increases by $2\times\text{--}4\times$.

---

### 7.2 Injury Risk Classification Model (Logistic Regression)

- **Script**: `backend/app/ml/service.py` (`train_injury_model`)
- **Features Used (18 features)**:
  `daily_training_load`, `weekly_load_index`, `total_distance_km`, `top_speed`, `average_running_speed`, `high_intensity_running`, `acwr`, `atl`, `ctl28`, `monotony`, `strain`, `previous_injury_count`, `fatigue`, `soreness`, `stress`, `readiness`, `sleep_quality`, `sleep_duration_hours`.
- **Target**: `injury_label` (Binary: 0 = Healthy, 1 = Sustained Injury).
- **Pipeline Architecture**:
  - `StandardScaler()` normalizes features to zero mean and unit variance.
  - `LogisticRegression(class_weight="balanced", max_iter=1000, random_state=42)` handles class imbalance.
- **Model Performance**:
  - **ROC-AUC**: **$83.27\%$**
  - **Classification Accuracy**: **$89.63\%$**
- **Risk Level Thresholds**:
  - $\text{Probability} < 0.33 \rightarrow$ **Low Risk** (Green)
  - $0.33 \le \text{Probability} < 0.66 \rightarrow$ **Moderate Risk** (Amber)
  - $\text{Probability} \ge 0.66 \rightarrow$ **High Risk** (Red)

---

### 7.3 Fitness & Performance Regressor (Gradient Boosting)

- **Script**: `backend/app/ml/service.py` (`train_performance_model`)
- **Algorithm**: `sklearn.ensemble.GradientBoostingRegressor(n_estimators=100, random_state=42)`
- **Target**: Continuous fitness score normalized to a $0\text{--}100$ scale.
- **Output**: Predicts future match performance capability based on recent sprinting volume, heart rate efficiency, and recovery metrics.

---

### 7.4 Algorithmic Heuristic Fallback Engine

If machine learning `.joblib` model artifacts are missing from disk or uninitialized, the platform **never crashes**. Instead, it seamlessly switches to an automated mathematical heuristic fallback (`_heuristic_injury_risk`):
- Examines historical injury counts ($+0.4$ risk weight).
- Flags high average training loads $>600\text{ AU}$ ($+0.3$ risk weight).
- Penalizes attendance rates $<80\%$ ($+0.15$ risk weight).
- Flags low composite fitness scores $<50$ ($+0.15$ risk weight).

---

### 7.5 Automated Plain-English AI Recommendations

Via `GET /api/ml/recommendations/{athlete_id}`, the system analyzes the combined outputs of both models and delivers actionable natural-language advice to coaches and athletes:
- *"Elevated injury risk detected. Reduce high-intensity sessions and increase recovery time."*
- *"Average training load is high (>600 AU); consider periodization to avoid overtraining."*
- *"Attendance is below 80%; consistent presence improves fitness outcomes."*
- *"Metrics look healthy. Maintain current training plan."*

---

### 7.6 1-Click Model Retraining Pipeline

Coaches and Administrators can retrain the machine learning models at any time directly from the Coach Dashboard or via `POST /api/ml/train`:
1. The backend loads the latest dataset.
2. Performs stratified train/test splitting ($80/20$).
3. Fits the scalers and estimators.
4. Serializes the updated pipeline bundles to `backend/app/ml/artifacts/injury_1.0.0.joblib` and `performance_1.0.0.joblib`.
5. Logs training metrics into the `ml_models` database table.
6. The updated models take effect immediately for all subsequent prediction queries.

---

## 8. Comprehensive Dashboard Guides & Operational Workflows

### 8.1 Club Administrator Console (`/dashboard/admin`)

Designed for club executive directors, IT administrators, and general managers.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 👑 ADMIN CONSOLE: OVERVIEW TAB                                              │
├─────────────────────┬─────────────────────┬─────────────────────┬───────────┤
│ TOTAL SYSTEM USERS  │ ACTIVE MEMBERSHIPS  │ REGISTERED GROUNDS  │ AUDIT CSV │
│        12           │         15          │          3          │  Ready    │
├─────────────────────┴─────────────────────┴─────────────────────┴───────────┤
│ NAVIGATION TABS: [ Overview ]  [ User Directory ]  [ Memberships ]  [ Reports]│
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Core Functional Tabs:
1. **Overview Tab**:
   - Executive KPI cards: Total registered users, active membership subscriptions, stadium grounds registered, and security status.
   - Recent User Registrations table displaying newest club signups with quick status indicators.
2. **User Directory Tab**:
   - Complete searchable directory of all club accounts.
   - Filter by role (`All`, `Admin`, `Coach`, `Athlete`, `Physio`, `Staff`).
   - Real-time search by full name or email address.
   - **+ Add New User Modal**: Provision new administrators, coaches, physios, or athletes.
   - **Status Toggle**: 1-click active/suspended switch (`PUT /api/users/{id}/status`).
   - **Delete User**: Secure deletion with confirmation dialog (`DELETE /api/users/{id}`).
3. **Memberships & Billing Tab**:
   - Track athlete subscriptions and club financial revenue.
   - Displays subscription tiers (`Basic`, `Pro Athlete`, `Elite First-Team`), amount paid ($), start date, and status.
   - **+ Provision Membership Modal**: Assign plans to registered athletes with custom fee amounts.
4. **CSV Reports & Exports Tab**:
   - One-click instant CSV streaming export buttons:
     - 📥 **Export Users Directory CSV** (`system_users_directory.csv`)
     - 📥 **Export Attendance Records CSV** (`squad_attendance_report.csv`)
     - 📥 **Export Facility Utilization CSV** (`facility_utilization_report.csv`)
     - 📥 **Export Memberships Financial CSV** (`memberships_financial_report.csv`)

---

### 8.2 Head Coach Squad Hub (`/dashboard/coach`)

Designed for head coaches, tactical analysts, and fitness trainers.

#### Core Functional Tabs:
1. **Overview Tab**:
   - High-level squad statistics: Total active squad players, scheduled drills, active injury alerts, and upcoming fixtures.
   - **High-Risk Injury Warning Banner**: Alerts coaches immediately if any player has crossed the $1.5\text{ ACWR}$ threshold.
   - Quick Action buttons: Schedule Training, Log Attendance, Record Telemetry.
2. **Squad Roster Tab**:
   - Positional filter pills: `All`, `GK`, `DEF`, `MID`, `FWD`.
   - Player cards featuring jersey number badges, height, weight, nationality, and primary position.
   - **View Profile Link**: Direct navigation to `/athlete/:id` for full performance history.
3. **Training & Attendance Center**:
   - **Schedule Training Session Modal**: Create drills with title, date/time, duration (min), facility, intensity (`low`, `medium`, `high`), and tactical focus.
   - **Log Attendance & RPE Modal**: Select a session and mark each player as `Present`, `Late`, or `Absent`, with minutes late and subjective RPE exertion rating ($1\text{--}10$).
4. **Performance Telemetry Tab**:
   - Log GPS telemetry for any athlete: Distance covered (km), top sprint speed (km/h), high-speed sprint count, and heart rate metrics.
5. **AI Risk Analytics Tab**:
   - Displays squad-wide ACWR workload metrics, fitness readiness scores, and AI recommendations.
   - **Retrain ML Engine Button**: Triggers `POST /api/ml/train` to update model artifacts live.
   - Interactive **WorkloadChart**: Displays 7-day Acute Load vs 28-day Chronic Baseline with dynamic ACWR sweet-spot guidelines.
6. **Competitions & Match Fixtures Tab**:
   - Schedule upcoming fixtures with opponent name, match date, and venue.
   - Log match results (`Win`, `Loss`, `Draw`) and scorelines.

---

### 8.3 Physiotherapist & Staff Operations Hub (`/dashboard/staff`)

Designed for team doctors, physiotherapists, groundskeepers, and equipment managers.

#### Core Functional Tabs:
1. **Overview Tab**:
   - Operational summary: Active rehabilitation cases, total club pitches/gyms, and gear inventory count.
2. **Physiotherapy & Injury Center**:
   - **Log Medical Injury Modal**: Record athlete diagnosis, anatomical body part, clinical severity (`minor`, `moderate`, `severe`), injury date, and rehabilitation notes.
   - **Active Medical Incidents Table**: Lists all players currently sidelined.
   - **1-Click Return-to-Play Clearance Button**: Clicking **Clear Return-to-Play** automatically updates the injury record with `returned_on = today`, resolving the active medical warning and clearing the athlete for team selection.
3. **Facilities Manager Tab**:
   - Review all club facilities: Stadium pitches, training grounds, swimming pools, and recovery gyms.
   - **+ Add Facility Modal**: Register new facilities with name, type, and capacity.
   - **Availability Toggle**: Switch grounds between `Available` and `Maintenance` mode.
4. **Equipment Inventory Tab**:
   - Track balls, GPS tracking vests, cones, resistance bands, and medical kits.
   - Record item condition (`Good`, `Fair`, `Broken`) and maintenance inspection dates.
   - **+ Add Gear Modal**: Add new equipment items with category and quantity.

---

### 8.4 Athlete Self-Service Portal (`/dashboard/athlete`)

Designed for mobile and desktop access by club players.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⚡ ATHLETE PORTAL: MY READINESS HUB                                          │
├─────────────────────┬─────────────────────┬─────────────────────────────────┤
│    WORKLOAD GAUGE   │  FITNESS READINESS  │     AI RECOVERY DIRECTIVE       │
│      1.14 ACWR      │     84.5 / 100      │ "Metrics healthy. Maintain plan"│
│     (Sweet Spot)    │  (Match Ready)      │                                 │
├─────────────────────┴─────────────────────┴─────────────────────────────────┤
│ RECHARTS TELEMETRY: 7-Day Acute Load (ATL) vs 28-Day Chronic Baseline (CTL) │
│                                                                             │
│ [ ⚡ Rate Session RPE Exertion ] -> Interactive Slider (1 to 10) -> Submit   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Core Functional Tabs:
1. **My Readiness Hub Tab**:
   - **Workload Gauge**: Real-time ACWR indicator badge ($0.8\text{--}1.3$ Green Sweet Spot, $>1.5$ Red Alert).
   - **Predicted Fitness Score**: AI-estimated match fitness rating ($0\text{--}100$).
   - **Personalized AI Recovery Advice**: Plain-English training prescription.
   - **Interactive Recharts Workload Graph**: Visual plot comparing 7-Day Acute Load against 28-Day Chronic Baseline.
2. **Training Schedule & RPE Rating Tab**:
   - View assigned drills, training times, focus areas, and session locations.
   - **Interactive Rate Session RPE Modal**:
     - Players click **Rate Session RPE Exertion** on completed drills.
     - Adjust the slider from $1$ (Very Light Activity) to $10$ (Maximal Exhaustion).
     - Click **Submit**.
     - **Instant Live Update**: The system immediately calculates session load ($\text{Duration} \times \text{RPE}$), recalculates their 7-day ATL and ACWR ratio, and refreshes their Readiness Hub live on screen!
3. **Performance Telemetry Tab**:
   - Historical log of personal performance metrics: Total distance covered, maximum sprint speed, sprint repetitions, and heart rates.

---

### 8.5 Athlete Deep-Dive Profile View (`/athlete/:id`)

Accessible to Coaches, Administrators, and Physiotherapists by clicking on any player across the application:
- **Biometric Summary**: Jersey number, position, age, height, weight, and nationality.
- **Career Performance Stats**: Average match rating, top recorded sprint speed, total distance covered, and attendance percentage.
- **Acute vs. Chronic Workload Visualizer**: Dedicated Recharts graph plotting the athlete's multi-week workload trajectory.
- **Medical History & Injury Timeline**: Full historical record of past injuries, severity ratings, days lost to injury, and return-to-play clearance dates.
- **Live ML Prognosis**: Current injury risk probability ($0\text{--}100\%$) and customized recovery suggestions.

---

## 9. UI/UX Architecture & Interactive Component System

### 9.1 Collapsible Vertical Navigation Sidebar (`SidebarLayout.tsx`)
The platform features an enterprise vertical sidebar:
- **Two Display States**:
  - **Expanded Mode (280px)**: Displays full logo, navigation labels, role pills, and badge counters.
  - **Compact Mini-Rail Mode (72px)**: Collapses into an icon-only strip with centered tooltips.
- **Panel Collapse Button `[◀ / ▶]`**: Users toggle the sidebar state with one click.
- **Persistence**: User preference is automatically saved in `localStorage.setItem('sidebar_collapsed', 'true')` and preserved across page refreshes.
- **Mobile Responsive Drawer**: On screens $<1024\text{px}$, the sidebar transforms into an off-canvas mobile drawer with smooth slide-over animation.

### 9.2 In-App Real-Time Notification Center Drawer
Located in the top header bar across all dashboard layouts:
- **Bell Icon `[🔔]`**: Displays a glowing red pill badge with the total unread alert count.
- **Interactive Flyout Drawer**: Clicking the bell opens a glassmorphism notification tray:
  - 🔴 **Workload Spikes**: Alerts when an athlete exceeds $1.5\text{ ACWR}$.
  - 🟡 **Medical Clearances**: Alerts when a player receives Return-to-Play clearance.
  - 🔵 **Training Updates**: Alerts for newly scheduled squad drills.
  - 🟢 **Membership Renewals**: Billing and renewal notifications.
- **Actions**: Mark individual notifications as read or click **Mark all read** to clear the tray.

### 9.3 Modern Dark & Light Mode Theme Engine
Controlled by `ThemeContext.tsx` and custom CSS variables in `index.css`:
- **Theme Switcher**: Located in the top header of all pages (`Sun` / `Moon` icon).
- **Zero-Flicker Persistence**: The active theme (`dark` or `light`) is saved to `localStorage.getItem('theme')` and applied to the root `<html>` element on initial DOM render.
- **Design Tokens**: Standardized CSS variables (`--color-bg-base`, `--color-surface-elevated`, `--color-brand-500`, `--color-text-primary`) provide accessible contrast ratios across both themes.

### 9.4 Recharts Workload & Fatigue Visualizations
Implemented in `WorkloadChart.tsx` using `recharts`:
- Renders an interactive multi-line SVG chart.
- **7-Day Acute Load (ATL)**: Glowing neon curve showing short-term fatigue.
- **28-Day Chronic Baseline (CTL)**: Smooth blue dashed curve showing historical fitness.
- **Dynamic Tooltips**: Hovering over any date displays exact daily Arbitrary Units (AU), ACWR ratio, and workload safety classification.

---

## 10. Exhaustive REST API Reference

All protected endpoints require the HTTP header:  
`Authorization: Bearer <your_jwt_token>`

### 10.1 Authentication & User Management

| Method | Endpoint | Required Permission / Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account (auto-provisions Athlete profile if role is athlete). |
| `POST` | `/api/auth/login` | Public | Authenticate via email & password form data; returns JWT token. |
| `POST` | `/api/auth/google` | Public | Authenticate via Google ID token; auto-provisions athlete account. |
| `GET` | `/api/auth/me` | Authenticated User | Retrieve current user profile and role. |
| `GET` | `/api/users` | `Role.ADMIN` | List all users with optional `search` and `role` query filters. |
| `POST` | `/api/users` | `Role.ADMIN` | Provision a new user (admin, coach, athlete, physio, staff). |
| `PUT` | `/api/users/{id}/role` | `Role.ADMIN` | Update a user's RBAC role (with self-demotion prevention). |
| `PUT` | `/api/users/{id}/status`| `Role.ADMIN` | Toggle user active/suspended state (with self-lockout prevention). |
| `DELETE`| `/api/users/{id}` | `Role.ADMIN` | Permanently delete user and cascade associated records. |

### 10.2 Squad & Athlete Profiles

| Method | Endpoint | Required Permission / Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/athletes` | `athlete:read` | List all squad athletes. |
| `POST` | `/api/athletes` | `athlete:write` | Create user and athlete profile with biometrics. |
| `GET` | `/api/athletes/me` | `athlete:read:self` | Retrieve profile of currently authenticated athlete. |
| `GET` | `/api/athletes/me/performance` | `performance:read:self`| Retrieve personal performance history. |
| `GET` | `/api/athletes/me/attendance` | `attendance:read:self` | Retrieve personal attendance records. |
| `GET` | `/api/athletes/me/training` | `training:read:self` | Retrieve assigned training sessions. |
| `GET` | `/api/athletes/{id}` | `athlete:read` | Retrieve specific athlete profile by ID. |
| `PUT` | `/api/athletes/{id}` | `athlete:write` | Update athlete biometrics or user account details. |
| `DELETE`| `/api/athletes/{id}` | `athlete:write` | Remove athlete from squad. |

### 10.3 Training Sessions & Attendance

| Method | Endpoint | Required Permission / Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/training` | `training:read` | List upcoming and past training sessions. |
| `POST` | `/api/training` | `training:write` | Schedule a new training drill. |
| `GET` | `/api/training/{id}` | `training:read` | Retrieve details of a specific training session. |
| `PUT` | `/api/training/{id}` | `training:write` | Update training session details. |
| `DELETE`| `/api/training/{id}` | `training:write` | Delete training session. |
| `GET` | `/api/attendance` | `attendance:read` | List attendance records (filterable by `session_id`). |
| `POST` | `/api/attendance` | `attendance:write` | Mark athlete attendance, minutes late, and RPE rating. |
| `PUT` | `/api/attendance/{id}`| `attendance:write` | Update an existing attendance record. |

### 10.4 Medical & Injury Management

| Method | Endpoint | Required Permission / Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/injuries` | `injury:read` | List injuries (filterable by `athlete_id`). |
| `POST` | `/api/injuries` | `injury:write` | Log new clinical injury record. |
| `GET` | `/api/injuries/{id}` | `injury:read` | Retrieve injury record details. |
| `PUT` | `/api/injuries/{id}` | `injury:write` | Update injury record or set `returned_on` date (1-click RTP). |
| `DELETE`| `/api/injuries/{id}` | `injury:write` | Delete injury record. |

### 10.5 Facilities & Equipment

| Method | Endpoint | Required Permission / Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/facilities` | `facility:read` | List club pitches, gyms, and pools. |
| `POST` | `/api/facilities` | `facility:write` | Add new facility ground. |
| `PUT` | `/api/facilities/{id}`| `facility:write` | Update facility or toggle availability. |
| `DELETE`| `/api/facilities/{id}`| `facility:write` | Remove facility. |
| `GET` | `/api/equipment` | `equipment:read` | List club equipment inventory. |
| `POST` | `/api/equipment` | `equipment:write` | Register new equipment gear. |
| `PUT` | `/api/equipment/{id}` | `equipment:write` | Update gear condition (`good`, `fair`, `broken`). |
| `DELETE`| `/api/equipment/{id}` | `equipment:write` | Delete equipment item. |

### 10.6 Memberships & Billing

| Method | Endpoint | Required Permission / Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/memberships` | `membership:read` | List all athlete memberships. |
| `POST` | `/api/memberships` | `membership:write` | Provision a membership plan for an athlete. |
| `PUT` | `/api/memberships/{id}`| `membership:write`| Update membership status or billing amount. |
| `DELETE`| `/api/memberships/{id}`| `membership:write`| Cancel membership. |

### 10.7 Machine Learning & Telemetry

| Method | Endpoint | Required Permission / Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ml/train` | `Role.COACH` / `Role.ADMIN` | Retrain injury & performance ML model pipelines. |
| `GET` | `/api/ml/predict/injury/{athlete_id}` | `ml:read` or Self | Predict injury probability and risk tier. |
| `GET` | `/api/ml/predict/performance/{athlete_id}`| `ml:read` or Self | Predict match readiness score ($0\text{--}100$). |
| `GET` | `/api/ml/recommendations/{athlete_id}` | `ml:read` or Self | Retrieve plain-English AI recovery directives. |
| `GET` | `/api/ml/models` | `ml:read` | List trained model versions and validation metrics. |

### 10.8 CSV Reports & Exports

| Method | Endpoint | Required Permission / Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reports/export?report_type=attendance` | `attendance:read` | Stream CSV of squad attendance and RPE logs. |
| `GET` | `/api/reports/export?report_type=facilities` | `facility:read` | Stream CSV of facility utilization and availability. |
| `GET` | `/api/reports/export?report_type=memberships` | `membership:read` | Stream CSV of membership billing and tiers. |
| `GET` | `/api/reports/export?report_type=users` | `Role.ADMIN` | Stream CSV of all system users and roles. |

---

## 11. Installation, Database Seeding & Production Deployment

### 11.1 Prerequisites
- **Python**: Version 3.11 or higher
- **Node.js**: Version 18.x or 20.x
- **Package Managers**: `pip` (Python) and `npm` (Node)
- **Optional**: Docker & Docker Compose (for PostgreSQL containerization)

---

### 11.2 Step 1: Backend Setup & Database Seeding

Open a terminal in the project root:

```powershell
# 1. Navigate to backend directory
cd backend

# 2. Create Python virtual environment
python -m venv .venv

# 3. Activate virtual environment
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# Linux / macOS:
# source .venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Populate database with demo accounts, squad players, and pre-train ML models
python seed.py

# 6. Start the FastAPI development server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API is now running at `http://localhost:8000`. Interactive Swagger API documentation is available at `http://localhost:8000/docs`.

---

### 11.3 Step 2: Frontend Setup & Development Server Launch

Open a second terminal in the project root:

```powershell
# 1. Navigate to frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Launch Vite development server
npm run dev
```
The React frontend application will launch at `http://localhost:5173` (or `http://localhost:5175`).

---

### 11.4 Step 3: Production Build & Deployment

#### Frontend Production Build:
```powershell
cd frontend
npm run build
```
This runs TypeScript validation (`tsc -b`) and Vite production chunking, outputting minified static assets to `frontend/dist/`. These files can be hosted directly via Nginx, AWS S3 / CloudFront, Vercel, or Netlify.

#### Backend Production Execution:
Run FastAPI using Uvicorn with multiple asynchronous worker processes:
```powershell
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Docker Deployment (PostgreSQL + API):
The project includes container orchestration files in `db/docker-compose.yml` to spin up a PostgreSQL 16 database container:
```powershell
cd db
docker compose up -d
```
Update `DATABASE_URL` in `backend/.env` to point to the PostgreSQL connection string:
```env
DATABASE_URL=postgresql+psycopg://sportsclub:secretpassword@localhost:5432/sportsclub
```

---

## 12. Troubleshooting & Frequently Asked Questions (FAQ)

### Q1: Why does login say "Invalid credentials" upon clean installation?
**Cause**: The database has not yet been seeded with initial user accounts.  
**Solution**: Run `python seed.py` in the `backend/` directory. This creates the default demo accounts (`admin@example.com`, `coach@example.com`, `athlete@example.com`, `physio@example.com`) and pre-trains the ML pipelines.

### Q2: How does submitting RPE instantly update an athlete's workload gauge?
**Mechanics**:
1. When an athlete opens the **Rate Session RPE** modal on `/dashboard/athlete` and rates a 90-minute session as $8/10$, `POST /api/attendance` records the RPE score.
2. The session workload is calculated as $90 \times 8 = 720\text{ AU}$.
3. When the dashboard re-fetches `/api/ml/predict/injury/{athlete_id}`, the feature pipeline (`backend/app/ml/features.py`) calculates the new 7-Day rolling Acute Load ($ATL$) and divides it by the 28-Day Chronic Baseline ($CTL_{28}$).
4. The resulting ACWR ratio and AI recommendation update live on screen without requiring a page reload.

### Q3: Why does deleting a user remove their attendances and injuries?
**Design**: SQLAlchemy models implement cascading deletes (`cascade="all, delete-orphan"`). This prevents orphan foreign key constraints in the database and complies with data privacy regulations (e.g., GDPR right-to-be-forgotten).

### Q4: Can an Administrator accidentally delete or demote their own account?
**Protection**: No. Handlers in `backend/app/api/routes/users.py` check `if user.id == current_admin.id` and reject self-deletion, self-deactivation, and self-demotion with `HTTP 400 Bad Request`.

### Q5: How do I export club audit data into Excel?
**Workflow**: Log in as an Administrator $\rightarrow$ navigate to `/dashboard/admin` $\rightarrow$ click the **CSV Reports & Exports** tab $\rightarrow$ click any of the 4 export buttons to download `.csv` spreadsheets compatible with Microsoft Excel, Apple Numbers, and Google Sheets.

---

*Sports Club AI Platform · Complete Technical Documentation v1.0 SaaS*

