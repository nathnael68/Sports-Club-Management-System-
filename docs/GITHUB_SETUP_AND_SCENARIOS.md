# 🚀 GitHub Repository Setup & Project Scenarios Guide

This guide walks you through:
1. Creating and pushing your code to a new **GitHub Repository**.
2. Setting up a **GitHub Project Board (Agile Kanban)** for your 4-person team.
3. Adding ready-to-use **User Scenarios / Issue Templates (Given-When-Then format)** aligned with your team roles.
4. Team Git branching and collaboration workflow.

---

## 👥 4-Member Team Role Mapping

| Member | Assigned Project Role | Primary Feature Modules & Scenarios |
| :--- | :--- | :--- |
| **Member 1** | **Machine Learning & Data Analysis** | ML ACWR Calculation Engine, Injury Risk Classifier, Fitness Regressor, Dataset Feature Engineering (22 Attributes), Evaluation Metrics. |
| **Member 2** | **Frontend Development & UI** | React 18 SPA Client, Dark/Light Theme Engine, Coach Squad Hub, Athlete Telemetry Visualizer, Recharts Progression Charts. |
| **Member 3** | **Backend & Database Development** | FastAPI RESTful API, PostgreSQL / SQLite Schemas, SQLAlchemy 2.0 ORM, OAuth2 JWT Authentication, RBAC Engine, CSV Exporters. |
| **Member 4** | **Injury Management, Testing & Documentation** | Physiotherapy Medical Center, 1-Click Return-to-Play (RTP) Clearance, Pytest Automation Suite, SRS/SDD Specifications, User Manuals. |

---

## 📦 Part 1: How to Create & Push the Repository to GitHub

### Step 1: Create a New GitHub Repo
1. Go to [https://github.com/new](https://github.com/new).
2. Name your repository (e.g., `sports-club-ai` or `sports-management-ai`).
3. Choose **Public** or **Private**.
4. **Leave "Add a README" and "Add .gitignore" UNCHECKED** *(already created)*.
5. Click **Create repository**.
6. Copy the repository URL (e.g., `https://github.com/YOUR_USERNAME/sports-club-ai.git`).

---

### Step 2: Run Git Commands in Terminal
Open your terminal in the project root directory (`sports-club-ai`) and run:

```bash
# 1. Initialize Git repository
git init

# 2. Stage all files
git add .

# 3. Create initial commit
git commit -m "feat: initial commit - sports club AI centralized management platform"

# 4. Set main branch
git branch -M main

# 5. Link to your GitHub remote repository
git remote add origin https://github.com/YOUR_USERNAME/sports-club-ai.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 📋 Part 2: How to Set Up GitHub Projects (Kanban Board)

1. In your GitHub repository, click on the **Projects** tab at the top.
2. Click **New project** $\rightarrow$ Select the **Board** (Kanban) template.
3. Name your project: **`Sports Club AI — Development Roadmap`**.
4. Set up the following 5 columns:
   - 📥 **Backlog** *(All upcoming tasks and planned features)*
   - 🎯 **Sprint Ready / To Do** *(Tasks committed for the current 2-week sprint)*
   - ⚙️ **In Progress** *(Currently being coded by an assigned team member)*
   - 🔍 **Review / Testing** *(Code review, test pass, advisor demonstration)*
   - ✅ **Done** *(Merged to main and fully validated)*

---

## 🎭 Part 3: Ready-to-Copy Scenarios (User Stories & BDD Test Cases)

---

### 📌 Scenario 1: Machine Learning ACWR Injury-Risk Alert
- **Assigned To**: **Member 1 (ML & Data Analysis)**
- **Label**: `feature`, `machine-learning`, `predictive-analytics`
```markdown
### User Story
**As a** Team Physiotherapist / Coach,
**I want** the system to compute the 7-day Acute to 28-day Chronic Workload Ratio (ACWR) and evaluate injury risk probability,
**So that** I receive an advance warning before an over-fatigued player suffers a muscle strain.

### Acceptance Criteria (Given - When - Then)
- **Scenario 1.1: High ACWR Fatigue Spike**
  - **Given** an athlete has accumulated high training loads exceeding their 28-day chronic baseline (ACWR > 1.4 or risk > 75%),
  - **When** the coach or physio views the squad roster or athlete profile,
  - **Then** the UI displays a high-risk red alert badge (`🔴 HIGH RISK`), a probability score, and an AI recommendation to reduce high-intensity volume.

- **Scenario 1.2: Balanced Workload (Sweet Spot)**
  - **Given** an athlete's acute-to-chronic workload ratio is between 0.8 and 1.3,
  - **When** predictive inference runs,
  - **Then** the UI displays a green status badge (`🟢 LOW RISK`) with a recommendation to maintain the training plan.
```

---

### 📌 Scenario 2: Athlete Portal & Interactive Telemetry Dashboard
- **Assigned To**: **Member 2 (Frontend Development & UI)**
- **Label**: `feature`, `frontend-ui`, `athlete-portal`
```markdown
### User Story
**As a** Club Athlete,
**I want** to log into my responsive web portal to view my upcoming sessions, historical match ratings, and visual recovery gauge,
**So that** I can track my fitness progression and training calendar.

### Acceptance Criteria (Given - When - Then)
- **Scenario 2.1: Visualizing Performance Trends**
  - **Given** an athlete accesses their personal portal,
  - **When** the dashboard renders,
  - **Then** interactive Recharts graphs display historical distance, top speed, and ACWR fatigue progression.

- **Scenario 2.2: Theme Switching**
  - **Given** any user interacts with the UI,
  - **When** they toggle the theme icon in the header,
  - **Then** the entire application switches seamlessly between Dark Mode and Light Mode with persistent local storage.
```

---

### 📌 Scenario 3: Backend API, Authentication & CSV Exporters
- **Assigned To**: **Member 3 (Backend & Database Development)**
- **Label**: `feature`, `backend-api`, `security`
```markdown
### User Story
**As a** System Administrator / Coach,
**I want** a secure FastAPI backend with OAuth2 authentication and 1-click CSV report exports,
**So that** all system operations are backed by fast, transactional RESTful services.

### Acceptance Criteria (Given - When - Then)
- **Scenario 3.1: OAuth2 JWT Authentication**
  - **Given** a user submits valid email and password credentials,
  - **When** the `/auth/login` endpoint validates the hash with bcrypt,
  - **Then** an encrypted JWT token with role claims is returned with a 24-hour expiration.

- **Scenario 3.2: Multi-Entity CSV Export**
  - **Given** an administrator requests an audit export,
  - **When** they trigger the CSV export endpoint for Users, Attendance, Facilities, or Memberships,
  - **Then** a formatted, downloadable `.csv` file stream is returned with a 200 OK status.
```

---

### 📌 Scenario 4: Physiotherapy Injury Management & Return-to-Play (RTP)
- **Assigned To**: **Member 4 (Injury Management, Testing & Documentation)**
- **Label**: `feature`, `medical-center`, `quality-assurance`
```markdown
### User Story
**As a** Team Physiotherapist,
**I want** to record athlete injuries, set clinical severity grades, and execute a 1-click Return-to-Play clearance,
**So that** injured athletes are protected from premature match selection.

### Acceptance Criteria (Given - When - Then)
- **Scenario 4.1: Active Injury Logging**
  - **Given** an athlete suffers an injury during training or matchplay,
  - **When** the physio submits the injury type, body part, severity, and expected recovery date,
  - **Then** the athlete is automatically marked as `injured` on the squad roster.

- **Scenario 4.2: 1-Click Medical Clearance**
  - **Given** an injured athlete finishes their rehabilitation protocol,
  - **When** the physiotherapist clicks "Clear Return-to-Play",
  - **Then** the active injury record is marked resolved, and the athlete is cleared for coach selection.
```

---

## 🌿 Part 4: Git Branching & Collaboration Rules

```
main (Production / Advisor Demo Ready)
  └── dev (Active Integration Branch)
        ├── feature/ml-data-pipeline     (Member 1)
        ├── feature/frontend-ui-portal   (Member 2)
        ├── feature/backend-api-db       (Member 3)
        └── feature/injury-rtp-testing   (Member 4)
```
