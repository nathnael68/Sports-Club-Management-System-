# 📖 Sports Club AI — Complete User Manual & Platform Guide (v1.0 SaaS)

Welcome to the official **Sports Club AI** user manual and comprehensive platform guide. This document provides an exhaustive overview of the platform's architecture, role-based workflows, step-by-step functional walkthroughs, machine learning predictive models, database administration, interactive visual charts, in-app notification center, and API specifications.

---

## 📋 Table of Contents

1. [Platform Overview & Core Capabilities](#1-platform-overview--core-capabilities)
2. [System Architecture & Tech Stack](#2-system-architecture--tech-stack)
3. [Role-Based Access Control (RBAC) Matrix](#3-role-based-access-control-rbac-matrix)
4. [Getting Started & Quick Setup](#4-getting-started--quick-setup)
5. [Step-by-Step Functionality Guides](#5-step-by-step-functionality-guides)
   - [🔑 5.1 Redesigned Interactive Login & Theme Engine](#-51-redesigned-interactive-login--theme-engine)
   - [🔔 5.2 Header Notification Center Drawer](#-52-header-notification-center-drawer)
   - [📊 5.3 Interactive Recharts Workload Analytics](#-53-interactive-recharts-workload-analytics)
   - [👑 5.4 Admin Console & Memberships Hub](#-54-admin-console--memberships-hub)
   - [🏆 5.5 Head Coach Squad Hub & Telemetry](#-55-head-coach-squad-hub--telemetry)
   - [🩺 5.6 Physiotherapist Medical Incident & Return-to-Play Center](#-56-physiotherapist-medical-incident--return-to-play-center)
   - [⚡ 5.7 Athlete Self-Service Portal](#-57-athlete-self-service-portal)
6. [Machine Learning & Predictive Analytics Engine](#6-machine-learning--predictive-analytics-engine)
7. [REST API Endpoint Reference](#7-rest-api-endpoint-reference)
8. [Troubleshooting & Frequently Asked Questions](#8-troubleshooting--frequently-asked-questions)

---

## 1. Platform Overview & Core Capabilities

**Sports Club AI** is an enterprise-grade sports management and predictive analytics platform engineered for modern athletic clubs, academies, and professional teams. It bridges physical athletic training with data science to optimize performance and minimize preventable soft-tissue injuries.

### Key Platform Highlights
- 🔮 **Predictive Injury Management**: Utilizes machine learning models (`scikit-learn` Logistic Regression & Gradient Boosting Regressor pipelines) to calculate real-time injury risk probabilities based on Acute-to-Chronic Workload Ratios (ACWR), session RPE (Rate of Perceived Exertion), and historical medical logs.
- 📊 **Interactive Recharts Telemetry**: Renders live visual workload progression graphs comparing 7-Day Acute Load (ATL) against 28-Day Chronic Baseline (CTL) with dynamic ACWR threshold zones ($0.8\text{--}1.3$ optimal, $>1.5$ danger line).
- 🔔 **Real-Time Notification Center Drawer**: Top-header bell popup `[🔔]` displaying instant unread alerts for high workload spikes, Return-to-Play clearances, session additions, and membership renewals.
- 🎨 **Redesigned Interactive Login Experience**: Modern glassmorphism login interface supporting dark and light modes, interactive quick demo role selector tiles (**Admin**, **Coach**, **Athlete**, **Physio**), and password visibility eye toggle (`Eye` / `EyeOff`).
- ⚡ **Collapsible Vertical Navigation Sidebar (`SidebarLayout.tsx`)**: Sleek left vertical navigation panel supporting expanded (280px) and compact mini-rail (72px) modes with panel collapse toggle `[◀ / ▶]` and `localStorage` preference caching.
- 👑 **Admin Memberships & Audit Center**: Complete membership subscription tier manager (`Basic`, `Pro Athlete`, `Elite First-Team`) and 1-Click CSV Reports Exporters (Users, Attendance, Facilities, Memberships).
- 🩺 **Medical & Rehabilitation Tracking**: Full injury logging timeline, severity grading, return-to-play dates, and 1-click clinical clearance workflow.

---

## 2. System Architecture & Tech Stack

```
                                 ┌─────────────────────────────────┐
                                 │     React 19 + TypeScript FE    │
                                 │   (Vite 8, Recharts, Tailwind)  │
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
| **Frontend Client** | Single Page Application | React 19.2, TypeScript 6.0, Vite 8.1, Tailwind CSS 4.3, Recharts 2.15, Lucide Icons |
| **Backend API** | Async REST Framework | FastAPI 0.115, Pydantic v2.9, Uvicorn, Python 3.11 |
| **Database** | Relational Engine | SQLite (`sportsclub.db` dev) / PostgreSQL 16 (Docker Compose) |
| **Machine Learning** | Data Pipeline & Analytics | `scikit-learn`, `pandas`, `numpy`, `joblib` artifacts |
| **Security** | Authentication & Hash | HMAC-SHA256 JWT, `bcrypt` password hashing, OAuth2 Bearer scheme |

---

## 3. Role-Based Access Control (RBAC) Matrix

The system enforces strict permission scoping across 5 distinct roles:

| Permission / Action | Admin | Coach | Athlete | Physiotherapist | Staff |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Manage Users & RBAC Roles** | ✅ Full | ❌ | ❌ | ❌ | ❌ |
| **Memberships & Billing CRUD** | ✅ Full | 🔒 Read | 🔒 Self Plan | 🔒 Read | 🔒 Read |
| **1-Click CSV Audit Exports** | ✅ Full | 🔒 Read | ❌ | 🔒 Read | 🔒 Read |
| **Read / Write Squad Telemetry** | ✅ Full | ✅ Write | 🔒 Self Only | ✅ Read | ✅ Read |
| **Create Training Sessions** | ✅ Full | ✅ Write | 🔒 Read Assigned | 🔒 Read | 🔒 Read |
| **Log Attendance & Session RPE** | ✅ Full | ✅ Write | 🔒 Submit Self | 🔒 Read | ✅ Write |
| **Manage Medical Records & RTP** | ✅ Full | 🔒 Read | 🔒 Self History | ✅ Full Write | 🔒 Read |
| **Train ML Models (`/api/ml/train`)**| ✅ Full | ✅ Execute | ❌ | ❌ | ❌ |
| **Facilities & Equipment CRUD** | ✅ Full | 🔒 Read | 🔒 Read | 🔒 Read | ✅ Full Write |

---

## 4. Getting Started & Quick Setup

### Step 1: Environment Setup & Local Server Launch
Open your terminal in the workspace directory and execute:

```powershell
# 1. Start FastAPI Backend Server (Port 8000)
cd backend
.venv\Scripts\uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# 2. Open a second terminal to start React Frontend (Port 5173 / 5175)
cd frontend
npm run dev
```

### Step 2: Pre-seeded Demo Accounts

| Role | Email | Password | Direct Dashboard Link |
| :--- | :--- | :--- | :--- |
| 👑 **Administrator** | `admin@example.com` | `admin123` | [http://localhost:5173/dashboard/admin](http://localhost:5173/dashboard/admin) |
| 🏆 **Head Coach** | `coach@example.com` | `coach123` | [http://localhost:5173/dashboard/coach](http://localhost:5173/dashboard/coach) |
| 🩺 **Physiotherapist** | `physio@example.com` | `physio123` | [http://localhost:5173/dashboard/staff](http://localhost:5173/dashboard/staff) |
| ⚡ **Athlete** | `athlete@example.com` | `athlete123` | [http://localhost:5173/dashboard/athlete](http://localhost:5173/dashboard/athlete) |

---

## 5. Step-by-Step Functionality Guides

### 🔑 5.1 Redesigned Interactive Login & Theme Engine
1. Navigate to `http://localhost:5173/login`.
2. **Theme Switcher**: Click the top-right `Sun` / `Moon` button to toggle seamlessly between **Dark Mode** and **Light Mode**.
3. **Password Eye Toggle**: Click the eye icon (`Eye` / `EyeOff`) to view or hide password characters.
4. **Quick Demo Tiles**: Click any of the 4 role cards (**Admin**, **Coach**, **Athlete**, **Physio**) to automatically autofill demo credentials and highlight the active role pill.
5. Click **Sign In to Dashboard** to authenticate.

### 🔔 5.2 Header Notification Center Drawer
1. Located in the top-right header bar of all dashboards (`SidebarLayout.tsx`).
2. **Unread Counter**: A red badge on the bell icon `[🔔]` displays total unread notifications.
3. **Interactive Popover**: Click the bell icon to open the glassmorphism drawer featuring:
   - High Workload ACWR Alerts (Red)
   - Return-to-Play Medical Clearances (Amber)
   - Training Schedule Additions (Cyan)
   - Membership Renewals (Green)
4. Click **Mark all read** or individual trash icons to clear notifications.

### 📊 5.3 Interactive Recharts Workload Analytics
1. Embedded on the **Athlete Portal**, **Coach AI Risk Tab**, and **Athlete Profile** pages.
2. Displays the **7-Day Acute Load (ATL)** glowing green curve alongside the **28-Day Chronic Baseline (CTL)** blue dashed line.
3. Hovering your mouse over any data point reveals a dynamic tooltip showing exact daily Arbitrary Units (AU) and ACWR fatigue status (`Optimal` vs `High Risk`).

### 👑 5.4 Admin Console & Memberships Hub
1. **Overview Tab**: Displays KPI summary cards (`Total Users`, `Registered Grounds`, `Memberships`, `System Security`) and recent user registrations.
2. **User Directory Tab**: Search, filter by role, toggle account active/suspended status, and delete accounts.
3. **Memberships & Billing Tab**: Assign subscription tiers (`Basic`, `Pro Athlete`, `Elite First-Team`), update billing amounts, and track subscription renewal dates.
4. **CSV Reports & Exports Tab**: 1-click downloadable `.csv` files for Users, Attendance, Facilities, and Memberships.

### 🏆 5.5 Head Coach Squad Hub & Telemetry
1. **Squad Roster View**: Search and filter squad players by position (`GK`, `DEF`, `MID`, `FWD`).
2. **Training Sessions View**: Schedule tactical drills with duration, facility, and intensity level.
3. **Attendance & RPE View**: Log athlete presence (`Present`, `Late`, `Absent`) and Rate of Perceived Exertion ($1\text{--}10$).
4. **AI Risk Analytics View**: Displays squad-wide ACWR workload metrics, fitness readiness scores, and plain-English AI recovery recommendations. Includes a **Retrain ML Model** button.

### 🩺 5.6 Physiotherapist Medical Incident & Return-to-Play Center
1. **Active Injury Logger**: Record athlete injuries with body part, type (e.g. `Hamstring strain`), severity (`minor`, `moderate`, `severe`), and expected return date.
2. **1-Click Return-to-Play Clearance**: Table listing active medical warnings. Clicking **Clear Return-to-Play** resolves the medical record and clears the player for match selection.
3. **Facilities Manager**: Toggle ground and gym availability status (`Available` vs `Maintenance`).
4. **Equipment Inventory**: Manage equipment counts and condition states (`Good`, `Fair`, `Damaged`).

### ⚡ 5.7 Athlete Self-Service Portal
1. **Readiness Hub Tab**: Visual ACWR Workload Gauge ($0.8\text{--}1.3$ optimal, $>1.5$ danger alert), Predicted Fitness Score ($0\text{--}100$), and AI Recovery Directive.
2. **Rate Session RPE Modal**: Click **Rate Session RPE Exertion** on any completed drill, slide the exertion rating ($1\text{--}10$), and click **Submit**. The system instantly recalculates session workload ($Load = Duration \times RPE$) and refreshes your readiness metrics live!
3. **Training Schedule Tab**: View upcoming drills, focus areas, and session times.
4. **Performance Telemetry Tab**: Access historical telemetry logs including top speeds, sprint counts, distances, and heart rates.

#### Visual Feature Gallery:
- **Full Readiness Hub & Workload Graph**:
  ![Athlete Dashboard Full View](./athlete_dashboard_full.png)
- **Interactive RPE Rating Slider Modal**:
  ![Athlete RPE Modal](./athlete_rpe_modal.png)
- **Training Schedule**:
  ![Athlete Training Schedule](./athlete_training_schedule.png)
- **Performance Telemetry History**:
  ![Athlete Telemetry History](./athlete_telemetry_history.png)

---

## 6. Machine Learning & Predictive Analytics Engine

The ML engine combines real-time Acute-to-Chronic Workload Ratio (ACWR) math with trained `scikit-learn` algorithms:

1. **Session Training Load Formula**:
   $$\text{Session Load (AU)} = \text{Duration (min)} \times \text{RPE Rating (1--10)}$$

2. **Acute-to-Chronic Workload Ratio (ACWR)**:
   $$\text{ATL}_7 = \frac{1}{7} \sum_{i=1}^{7} \text{Load}_i, \quad \text{CTL}_{28} = \frac{1}{28} \sum_{j=1}^{28} \text{Load}_j, \quad \text{ACWR} = \frac{\text{ATL}_7}{\text{CTL}_{28}}$$

3. **Machine Learning Pipeline Models**:
   - **Injury Classifier (`LogisticRegression`)**: Evaluates 18 workload attributes to predict injury risk probability ($89.63\%$ accuracy, $83.27\%$ ROC-AUC).
   - **Fitness Regressor (`GradientBoostingRegressor`)**: Estimates continuous match readiness score ($0\text{--}100$).
   - **Dynamic 1-Click Retraining Endpoint (`POST /ml/train`)**: Extracts live feature vectors directly from database squad records or CSV datasets to update `.joblib` model artifacts.

---

## 7. REST API Endpoint Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & return OAuth2 JWT token | Public |
| `GET` | `/api/auth/me` | Return current authenticated user profile | Bearer Token |
| `GET` | `/api/athletes` | List squad athletes | `athlete:read` |
| `GET` | `/api/athletes/me` | Return current athlete's profile | `athlete:read:self` |
| `POST` | `/api/training` | Create training session | `training:write` |
| `POST` | `/api/attendance` | Log session attendance & RPE rating | `attendance:write` |
| `POST` | `/api/injuries` | Record active medical injury | `injury:write` |
| `PATCH` | `/api/injuries/{id}/clear` | 1-Click Return-to-Play medical clearance | `injury:write` |
| `POST` | `/api/ml/train` | Retrain ML injury & performance models | `Role.COACH` / `Role.ADMIN` |
| `GET` | `/api/reports/export` | Download `.csv` report (users/attendance/facilities/memberships) | `reports:read` |

---

## 8. Troubleshooting & Frequently Asked Questions

### Q1: Why does login show "Invalid credentials"?
**Answer**: Run `python seed.py` in your `backend/` directory to seed the database with the standard demo accounts (`admin@example.com`, `coach@example.com`, `physio@example.com`, `athlete@example.com`).

### Q2: How does RPE update my workload gauge?
**Answer**: When you log RPE (e.g. 8/10 for 90 min), the system calculates $720\text{ AU}$ session load, updates your 7-day Acute Load, recalculates your ACWR, and refreshes the readiness gauge and AI recovery directive immediately on screen.

### Q3: Can I run the frontend and backend in production mode?
**Answer**: Yes! Run `npm run build` in `frontend/` to generate static dist assets, and deploy FastAPI using `uvicorn app.main:app --host 0.0.0.0 --port 8000` or Docker Compose (`docker compose up --build`).
