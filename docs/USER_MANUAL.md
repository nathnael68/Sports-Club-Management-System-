# 📖 Sports Club AI — Complete User Manual & Platform Guide

Welcome to the official **Sports Club AI** user manual and comprehensive platform guide. This document provides an exhaustive overview of the platform's architecture, role-based workflows, step-by-step functional walkthroughs, machine learning predictive models, database administration, and API specifications.

---

## 📋 Table of Contents

1. [Platform Overview & Core Capabilities](#1-platform-overview--core-capabilities)
2. [System Architecture & Tech Stack](#2-system-architecture--tech-stack)
3. [Role-Based Access Control (RBAC) Matrix](#3-role-based-access-control-rbac-matrix)
4. [Getting Started & Quick Setup](#4-getting-started--quick-setup)
5. [Step-by-Step Functionality Guides](#5-step-by-step-functionality-guides)
   - [🔑 5.1 Authentication & Role Switching](#-51-authentication--role-switching)
   - [🏆 5.2 Coach & Admin Operations](#-52-coach--admin-operations)
   - [⚡ 5.3 Athlete Self-Service Portal](#-53-athlete-self-service-portal)
   - [🩺 5.4 Physiotherapist & Staff Operations](#-54-physiotherapist--staff-operations)
   - [👤 5.5 Athlete Profile Deep-Dive](#-55-athlete-profile-deep-dive)
6. [Machine Learning & Predictive Analytics Engine](#6-machine-learning--predictive-analytics-engine)
7. [REST API Endpoint Reference](#7-rest-api-endpoint-reference)
8. [Troubleshooting & Frequently Asked Questions](#8-troubleshooting--frequently-asked-questions)

---

## 1. Platform Overview & Core Capabilities

**Sports Club AI** is an enterprise-grade sports management and predictive analytics platform engineered for modern athletic clubs, academies, and professional teams. It bridges physical athletic training with data science to optimize performance and minimize preventable soft-tissue injuries.

### Key Platform Highlights
- 🔮 **Predictive Injury Management**: Utilizes machine learning models (`scikit-learn` Logistic Regression & Linear Regression pipelines) to calculate real-time injury risk probabilities based on Acute-to-Chronic Workload Ratios (ACWR), session RPE (Rate of Perceived Exertion), and historical medical logs.
- ⚡ **Role-Tailored Dashboards**: Custom interfaces designed specifically for Coaches, Athletes, Physiotherapists, and Operations Staff.
- 📅 **Training & Attendance Analytics**: Tracks session schedules, focus areas (Tactics, Endurance, Strength), intensity levels, minutes late, and athlete-reported exertion scores.
- 🩺 **Medical & Rehabilitation Tracking**: Full injury logging timeline (Hamstring, ACL, Groin, etc.), severity tracking, return-to-play dates, and recovery notes.
- 🏛️ **Resource & Asset Management**: Monitors facility availability (Pitches, Gyms, Pools) and equipment inventory conditions (`Good`, `Fair`, `Broken`).
- 💳 **Membership Billing**: Subscriptions and plan management (`Standard`, `Premium`, `Junior`) for modern athletic club operations.

---

## 2. System Architecture & Tech Stack

```
                                 ┌─────────────────────────────────┐
                                 │     React 19 + TypeScript FE    │
                                 │    (Vite 8, Tailwind v4, Axios) │
                                 └────────────────┬────────────────┘
                                                  │ HTTP / REST (JWT)
                                 ┌────────────────▼────────────────┐
                                 │       FastAPI Backend API       │
                                 │     (Python 3.11, Pydantic v2)  │
                                 └────────┬──────────────┬─────────┘
                                          │              │
                    ┌─────────────────────▼──┐        ┌──▼──────────────────────┐
                    │  SQLAlchemy 2.0 ORM    │        │  scikit-learn ML Engine │
                    │  SQLite / PostgreSQL   │        │  (.joblib Pipelines)    │
                    └────────────────────────┘        └─────────────────────────┘
```

| Layer | Component | Version / Technologies |
| :--- | :--- | :--- |
| **Frontend Client** | Single Page Application | React 19.2, TypeScript 6.0, Vite 8.1, Tailwind CSS 4.3, Lucide Icons |
| **Backend API** | Async REST Framework | FastAPI 0.115, Pydantic v2.9, Uvicorn, Python 3.11 |
| **Database** | Relational Engine | SQLite (`sportsclub.db` dev) / PostgreSQL 16 (Docker Compose) |
| **Machine Learning** | Data Pipeline & Analytics | `scikit-learn`, `pandas`, `numpy`, `joblib` artifacts |
| **Security** | Authentication & Hash | HMAC-SHA256 JWT, `bcrypt` password hashing, OAuth2 Bearer scheme |

---

## 3. Role-Based Access Control (RBAC) Matrix

The system enforces strict permission scoping across 5 distinct roles:

| Permission / Action | Admin | Coach | Athlete | Physiotherapist | Staff |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Manage Users & Admins** | ✅ Full | ❌ | ❌ | ❌ | ❌ |
| **Read / Write Athlete Profiles** | ✅ Full | ✅ Write | 🔒 Self Only | ✅ Read | ✅ Read |
| **Create Training Sessions** | ✅ Full | ✅ Write | 🔒 Read Assigned | 🔒 Read | 🔒 Read |
| **Log Attendance & Session RPE** | ✅ Full | ✅ Write | 🔒 Submit Self | 🔒 Read | ✅ Write |
| **Record Performance Metrics** | ✅ Full | ✅ Write | 🔒 Self Metrics | ✅ Read | 🔒 Read |
| **Manage Medical & Injury Records**| ✅ Full | 🔒 Read | 🔒 Self History | ✅ Full Write | 🔒 Read |
| **Train ML Models (`/api/ml/train`)**| ✅ Full | ✅ Execute | ❌ | ❌ | ❌ |
| **Facilities & Equipment CRUD** | ✅ Full | 🔒 Read | 🔒 Read | 🔒 Read | ✅ Full Write |
| **Membership & Billing Operations** | ✅ Full | 🔒 Read | 🔒 Self Plan | 🔒 Read | ✅ Full Write |

---

## 4. Getting Started & Quick Setup

### Step 1: Environment Setup & Local Server Launch
Open your terminal in the workspace directory and execute:

```powershell
# 1. Start FastAPI Backend Server (Port 8000)
cd backend
.venv\Scripts\uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# 2. Open a second terminal to start React Frontend (Port 5173)
cd frontend
npm run dev
```

### Step 2: Seed Mock Data & Initialize ML Models
To populate the database with realistic demo athletes, sessions, performance metrics, and train initial ML pipelines:

```powershell
cd backend
.venv\Scripts\python seed.py
```

---

## 5. Step-by-Step Functionality Guides

### 🔑 5.1 Authentication & Role Switching

1. Open your browser and navigate to **`http://localhost:5173`**.
2. If unauthenticated, you will be automatically directed to the **Sign In** screen.
3. You can log in manually using email and password, or click any of the **Quick Demo Access** role cards:
   - 🛡️ **Admin**: Click **Admin** (loads `admin@example.com` / `admin123`).
   - 🏆 **Coach**: Click **Coach** (loads `coach@example.com` / `coach123`).
   - ⚡ **Athlete**: Click **Athlete** (loads `athlete@example.com` / `athlete123`).
   - 🩺 **Physio / Staff**: Click **Physio** (loads `physio@example.com` / `physio123`).
4. Click **Sign In**. The platform will decode the user's JWT token and route to the corresponding dashboard.

---

### 🏆 5.2 Coach & Admin Operations

#### 1. Viewing Team Roster & Injury Risk Overview
- **Path**: `/dashboard/coach`
- **Action**: 
  - Review the **High Injury Risk Alert** banner at the top of the dashboard. This displays athletes flagged with high acute-to-chronic workload ratios (ACWR > 1.5) or elevated injury probabilities calculated by the ML model.
  - Use the search bar to search athletes by full name, playing position (`GK`, `DEF`, `MID`, `FWD`), or jersey number.

#### 2. Managing Training Sessions
- **Path**: `/dashboard/coach` -> **Training Sessions Tab**
- **Step-by-Step**:
  1. Click **New Training Session** button.
  2. Enter **Title** (e.g., `Pre-Match Tactical Drill`), select **Facility** (e.g., `Main Pitch`), set **Date/Time**, **Duration** (minutes), and **Intensity** (`Low`, `Medium`, `High`).
  3. Click **Create Session**. The new session will appear in the schedule calendar and notify assigned athletes.

#### 3. Recording Athlete Performance Records
- **Path**: `/dashboard/coach` -> **Log Performance Tab**
- **Step-by-Step**:
  1. Select an athlete from the dropdown list.
  2. Input recorded data: **Distance Covered (km)**, **Top Speed (km/h)**, **Sprint Count**, **Average Heart Rate (BPM)**, and **Coach Match Rating (0-10)**.
  3. Click **Submit Performance Record**. The system calculates training load (`Duration × RPE`) and updates the athlete's fitness trajectory.

#### 4. Training Machine Learning Models
- **Path**: `/dashboard/coach` -> **AI & Analytics Section**
- **Step-by-Step**:
  1. Click **Train Models Now**.
  2. The backend queries recent training session logs, attendance RPE, and injury history, fits `StandardScaler` transformations, and trains `scikit-learn` models.
  3. A success notification displays updated sample sizes and artifact paths (e.g., `injury_1.0.0.joblib`).

---

### ⚡ 5.3 Athlete Self-Service Portal

#### 1. Monitoring Fitness & Workload Indicators
- **Path**: `/dashboard/athlete`
- **Action**:
  - Review your **Fitness Score (0-100)** progress card.
  - Monitor your **Acute-to-Chronic Workload Ratio (ACWR)** gauge. Staying within the **0.8 – 1.3 "Sweet Spot"** indicates optimal conditioning; exceeding **1.5** triggers a high workload alert warning to prevent burnout.

#### 2. Submitting Session RPE & Attendance
- **Path**: `/dashboard/athlete` -> **My Training Schedule**
- **Step-by-Step**:
  1. Locate completed training sessions.
  2. Click **Submit RPE**.
  3. Select your Rate of Perceived Exertion on a scale of **1 (Very Easy)** to **10 (Maximal Effort)** and specify any minutes late.
  4. Click **Confirm Submission**. This updates your personal workload calculations instantly.

---

### 🩺 5.4 Physiotherapist & Staff Operations

#### 1. Logging Athlete Medical & Injury Records
- **Path**: `/dashboard/staff` -> **Injury Management Tab**
- **Step-by-Step**:
  1. Click **Log New Injury**.
  2. Select **Athlete Name**, **Injury Type** (e.g., `Hamstring Strain`), **Body Part** (e.g., `Thigh`), **Severity** (`Minor`, `Moderate`, `Severe`), and **Occurred Date**.
  3. Add rehabilitation notes and estimated return-to-play date.
  4. Click **Save Injury Record**. The medical flag automatically updates on the Coach dashboard and athlete profile.

#### 2. Facilities & Equipment Maintenance
- **Path**: `/dashboard/staff` -> **Facilities & Equipment Tab**
- **Step-by-Step**:
  1. View facility status (`Main Pitch`, `Gym`, `Pool`) and toggle availability (`Available` / `Under Maintenance`).
  2. Inspect equipment inventory table: update quantities and toggle equipment condition (`Good`, `Fair`, `Broken`).

#### 3. Managing Membership Subscriptions
- **Path**: `/dashboard/staff` -> **Memberships Tab**
- **Step-by-Step**:
  1. View active athlete memberships, billing plans (`Standard`, `Premium`, `Junior`), and start/end dates.
  2. Click **Renew Plan** or **Update Status** (`Active`, `Expired`, `Suspended`).

---

### 👤 5.5 Athlete Profile Deep-Dive

- **Path**: Click any athlete name from Coach/Staff tables, or navigate to `/athlete/:id`.
- **Functionality**:
  - **Overview Banner**: Displays jersey number, playing position badge, age, height (cm), weight (kg), and nationality.
  - **Performance Charts**: Interactive distance and top speed trends over recent matches and training sessions.
  - **Medical History Timeline**: Chronological log of past injuries, severity ratings, and recovery notes.
  - **Attendance Record**: Complete summary of session presence, tardiness, and average exertion.

---

### 🛡️ 5.6 Admin Management Console Operations

#### 1. Managing System User Accounts & Roles (UC-13)
- **Path**: `/dashboard/admin`
- **Step-by-Step**:
  1. View executive stat cards for Total System Users, Active Athletes, Coaching Staff, and Facilities/Plans.
  2. Use the search bar to find users by full name or email address, or filter by role (`Admin`, `Coach`, `Athlete`, `Physiotherapist`, `Staff`).
  3. **Change User Role**: Click the role dropdown on any user row to instantly update their RBAC role.
  4. **Toggle Account Status**: Click the **Active** / **Disabled** status badge to enable or disable account login access.
  5. **Create New User**: Click **Add System User**, fill in Full Name, Email, Password, and Role, then click **Create User**.

#### 2. System Reports & CSV Export Center (UC-12)
- **Path**: `/dashboard/admin` -> **CSV Export Center**
- **Step-by-Step**:
  1. Click **Export CSV** under any of the report cards:
     - **Squad Attendance Log**: Downloads `squad_attendance_report.csv` containing attendance statuses, late minutes, and RPE scores.
     - **Facility Utilization**: Downloads `facility_utilization_report.csv` containing pitch/gym capacities and availability.
     - **Financial Memberships**: Downloads `memberships_financial_report.csv` containing plan subscriptions, amounts, and statuses.
     - **User Directory**: Downloads `system_users_directory.csv` containing all user accounts and roles.

---

## 6. Machine Learning & Predictive Analytics Engine

### 1. Acute-to-Chronic Workload Ratio (ACWR)
$$\text{Acute Load} = \text{Average Daily Training Load over past 7 Days}$$
$$\text{Chronic Load} = \text{Average Daily Training Load over past 28 Days}$$
$$\text{ACWR} = \frac{\text{Acute Load}}{\text{Chronic Load}}$$

- **ACWR < 0.8**: Under-training risk (potential deconditioning).
- **0.8 ≤ ACWR ≤ 1.3**: Optimal training workload zone ("Sweet Spot").
- **ACWR > 1.5**: High injury risk danger zone.

### 2. Machine Learning Pipelines
- **Injury Risk Classifier**: `StandardScaler` + `LogisticRegression`. Predicts probability ($0.0 - 1.0$) of soft-tissue injury based on ACWR spikes, cumulative 28-day load, average RPE, and previous injury occurrences.
- **Fitness Score Regressor**: `StandardScaler` + `LinearRegression`. Predicts athlete composite fitness score ($0 - 100$) based on vo2max estimates, sprint counts, top speeds, and session consistency.
- **Joblib Artifact Storage**: Persisted in `backend/app/ml/artifacts/`.

---

## 7. REST API Endpoint Reference

All endpoints require standard `Authorization: Bearer <JWT_TOKEN>` headers except `/api/auth/login`.

| Method | Endpoint | Description | Permission Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Form login returning access token & user profile | Public |
| `GET` | `/api/auth/me` | Fetch currently authenticated user session details | Authenticated |
| `GET` | `/api/athletes` | List all athlete profiles | `athlete:read` |
| `POST` | `/api/athletes` | Create new athlete profile | `athlete:write` |
| `GET` | `/api/athletes/me` | Fetch athlete profile for logged-in user | `athlete:read:self` |
| `GET` | `/api/athletes/{id}` | Fetch individual athlete details | `athlete:read` |
| `GET` | `/api/training` | List training sessions | `training:read` |
| `POST` | `/api/training` | Create training session | `training:write` |
| `POST` | `/api/attendance` | Log session attendance & RPE | `attendance:write` |
| `GET` | `/api/performance` | Query athletic performance records | `performance:read` |
| `POST` | `/api/injuries` | Record new athlete injury log | `injury:write` |
| `POST` | `/api/ml/train` | Execute training pipeline for ML models | `Role.COACH` / `Role.ADMIN` |
| `GET` | `/api/ml/predict/{athlete_id}`| Get injury risk & fitness prediction | `ml:read` |
| `GET` | `/api/users` | List system users with optional search/role filters | `Role.ADMIN` |
| `POST` | `/api/users` | Create new system user account | `Role.ADMIN` |
| `PUT` | `/api/users/{id}/role` | Update user RBAC role | `Role.ADMIN` |
| `PUT` | `/api/users/{id}/status` | Enable/disable user account status | `Role.ADMIN` |
| `DELETE` | `/api/users/{id}` | Delete user account | `Role.ADMIN` |
| `GET` | `/api/reports/export` | Export CSV report (attendance, facilities, memberships, users) | `attendance:read` / `Role.ADMIN` |
| `GET` | `/api/facilities` | List facilities and availability | `facility:read` |
| `GET` | `/api/memberships` | List athlete membership plans | `membership:read` |

*Interactive OpenAPI Swagger documentation is accessible at **`http://localhost:8000/docs`**.*

---

## 8. Troubleshooting & Frequently Asked Questions

### ❓ Q: Why am I getting a 401 Unauthorized error on dashboard load?
**Answer**: Your JWT session token has expired (tokens expire after 24 hours by default). Click **Sign Out** or navigate to `http://localhost:5173/login` to re-authenticate.

### ❓ Q: How do I reset or re-seed demo data?
**Answer**: Delete the SQLite database file (`backend/sportsclub.db`) and run the seed script:
```powershell
cd backend
Remove-Item -Force sportsclub.db
.venv\Scripts\python seed.py
```

### ❓ Q: How do I run automated test suites?
**Answer**:
- Backend tests: `cd backend; .venv\Scripts\pytest`
- Frontend unit tests: `cd frontend; npm run test -- --run`
- Frontend production build check: `cd frontend; npm run build`

---
*Sports Club AI Platform · User Manual & Technical Reference Guide*
