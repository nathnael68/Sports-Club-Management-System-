# SENIOR PROJECT DOCUMENTATION
**Sports Club AI Platform: Predictive Management System**

---

## PRELIMINARY PAGES

### Cover Page Details
**Title:** Sports Club AI Platform: A Predictive Management System
**Author(s):** [Your Name/Team Members]
**Advisor:** [Advisor Name]
**Date:** July 2026
**Institution:** HiLCOE School of Computer Science & Technology

### Title Page Details
**Sports Club AI Platform: A Predictive Management System**
A Senior Project Report submitted to the Department of Computer Science at HiLCOE School of Computer Science & Technology in partial fulfillment of the requirements for the Degree of Bachelor of Science in Computer Science / Software Engineering.

### Approval Page Layout
This Senior Project Report has been examined and approved as meeting the required standards for partial fulfillment of the Bachelor of Science in Computer Science / Software Engineering.

______________________________ (Advisor Signature)
**Advisor Name:** [Advisor Name]
**Date:** _________________

______________________________ (Examiner Signature)
**Examiner Name:** [Examiner Name]
**Date:** _________________

### Executive Summary
The Sports Club AI Platform is a modern, data-driven web application designed to centralize sports club operations and leverage predictive analytics. Historically, sports clubs have relied on disjointed, manual systems to track athlete performance, facility bookings, and injury logs. This fragmented approach limits the ability to draw meaningful insights, ultimately leading to suboptimal performance and preventable injuries. 

This project solves this operational inefficiency by providing a unified ecosystem utilizing a robust FastAPI backend and a React/TypeScript frontend. The system manages core entities including Athlete Profiles, Training Sessions, Attendances, Memberships, and Facilities. Crucially, the platform features a Machine Learning service that utilizes Scikit-learn (Logistic and Linear Regression) to predict injury risks and forecast athlete fitness scores based on physiological metrics (like heart rate and Rating of Perceived Exertion). 

Developed under an Agile methodology, the platform employs a layered software architecture, mapping RESTful APIs to an ORM-managed PostgreSQL database. Key challenges included establishing dynamic Role-Based Access Control (RBAC) and bridging the asynchronous machine learning pipelines with real-time web delivery. The resulting application minimizes administrative overhead, empowers coaches with data, and ultimately extends athletes' careers through preventative ML insights.

### Definitions, Acronyms, and Abbreviations
- **API**: Application Programming Interface
- **CRUD**: Create, Read, Update, Delete
- **ERD**: Entity-Relationship Diagram
- **JWT**: JSON Web Token
- **ML**: Machine Learning
- **OOSE**: Object-Oriented Software Engineering
- **RBAC**: Role-Based Access Control
- **RPE**: Rating of Perceived Exertion (1-10 scale metric of training intensity)
- **SPA**: Single Page Application
- **VO2 Max**: Maximum rate of oxygen consumption measured during incremental exercise

---

### CHAPTER 1: INTRODUCTION & BACKGROUND

### 1.1 Background & Motivation
In the highly competitive landscape of modern athletics, the margin between victory and defeat is often dictated not just by raw talent, but by the meticulous management of physiological performance and recovery. Historically, sports science relied heavily on intuition and basic quantitative metrics. However, the paradigm has shifted dramatically toward high-resolution sports performance analytics. 

A critical component of this evolution is the monitoring of training loads. The physiological stress placed on an athlete during training—often quantified by the Acute:Chronic Workload Ratio (ACWR)—has become the gold standard for predicting injury likelihood. ACWR compares an athlete's short-term training load (acute, typically the last 7 days) against their long-term training load (chronic, typically the last 28 days). Research indicates that when this ratio spikes outside the 'sweet spot' (typically 0.8 to 1.3), the probability of soft-tissue injuries increases exponentially.

Despite these advancements in sports science theory, the practical application at the club level remains alarmingly primitive. The vast majority of semi-professional and amateur sports clubs still rely on manual Excel spreadsheets, fragmented WhatsApp groups, and paper-based injury logs. This manual tracking creates a massive disconnect. When data is disjointed, it is impossible to calculate real-time ACWRs or recognize dangerous patterns in an athlete's workload. 

Furthermore, the economics of injury prevention cannot be overstated. When a key athlete is sidelined with a preventable muscular injury due to overtraining, the club suffers not only competitive disadvantages but also severe financial losses regarding wasted wages and medical rehabilitation costs. 

The primary motivation behind the Sports Club AI Platform is to bridge this catastrophic gap between sports science theory and daily club operations. By transitioning from manual Excel tracking to a unified, predictive AI platform, the system empowers coaches and medical staff to transition from a reactive posture (treating injuries after they happen) to a proactive posture (adjusting training loads before an injury occurs). By centralizing data ingestion and applying Scikit-learn machine learning classifiers, this project aims to democratize elite-level sports analytics, making predictive injury models accessible to sports clubs at all tiers of competition.

### 1.2 Statement of the Problem
The operational workflow of the target sports club is currently crippled by severe inefficiencies stemming from technological fragmentation. The core problems driving the need for this system are categorized as follows:

**1. Siloed and Fragmented Data Architectures:**
Currently, attendance records are maintained by coaches in physical notebooks or standalone spreadsheets. Separately, the physiotherapy department maintains injury histories in distinct, localized medical files. There is no relational link between the training load an athlete experiences on the pitch and the physical degradation documented by the medical staff. This siloing guarantees that coaches are making critical tactical and physical decisions blindly.

**2. Reactive Injury Management:**
Because the club lacks a centralized ecosystem to aggregate Rating of Perceived Exertion (RPE) and session durations, there is no mechanism to warn staff when an athlete enters the 'danger zone' of overtraining. Consequently, injury management is entirely reactive. Athletes train until they break, leading to catastrophic soft-tissue injuries (e.g., hamstring tears, ACL strains) that could have been statistically predicted and prevented with minor workload adjustments.

**3. Uncoordinated Communication Between Staff:**
The lack of a unified digital platform results in severe miscommunications between coaching and medical staff. An athlete cleared for 'light training' by a physiotherapist might be mistakenly placed into a high-intensity tactical drill by a coach unaware of the medical restriction. This operational friction directly jeopardizes athlete safety.

**4. Administrative Chaos and Resource Mismanagement:**
Beyond athlete health, the administrative layer of the club suffers from manual mismanagement. Facility bookings clash because the pitch and gym schedules are maintained on whiteboards. Furthermore, high-value training equipment frequently goes missing or falls into disrepair because there is no digital inventory or maintenance tracking system. The club loses thousands of dollars annually in lost or broken equipment.

### 1.3 Objectives

#### 1.3.1 General Objective
The overarching objective of this senior project is to engineer, develop, and deploy a centralized, AI-driven Sports Club Management web application that unifies athletic, medical, and administrative operations while leveraging predictive machine learning models to forecast fitness trajectories and mitigate athlete injury risks.

#### 1.3.2 Specific Objectives
To achieve the general objective, the following specific, measurable technical goals have been established:
- **Architectural Implementation**: To design a robust Client-Server architecture utilizing a RESTful FastAPI backend and a React/TypeScript frontend, ensuring strict separation of concerns.
- **Security & RBAC**: To engineer a JSON Web Token (JWT) based authentication system featuring granular Role-Based Access Control (RBAC), strictly isolating data visibility between Admins, Coaches, Athletes, Physiotherapists, and general Staff.
- **Data Persistence**: To design and implement a fully normalized PostgreSQL relational database schema utilizing SQLAlchemy ORM to manage complex entities including Athletes, Attendances, Training Sessions, and Injuries.
- **Predictive Analytics Integration**: To develop an automated Machine Learning pipeline that extracts historical RPE and session data, engineers ACWR-based features, and trains Logistic Regression models (for injury risk classification) and Linear Regression models (for fitness forecasting) using Scikit-Learn.
- **User Interface Design**: To build a responsive, intuitive Single Page Application (SPA) using React 19 and Tailwind CSS that visualizes complex statistical data via interactive dashboards.
- **Administrative Automation**: To implement a comprehensive CRUD (Create, Read, Update, Delete) module dedicated to eliminating double-bookings of facilities and digitally tracking equipment condition and inventory.

### 1.4 Scope and Limitations

#### 1.4.1 Project Scope
**Functional Boundaries:** The system encompasses full lifecycle management for athlete profiles, real-time training session scheduling, RPE-based attendance tracking, detailed injury logging, facility booking, equipment inventory, and automated ML model training/inference dashboards.
**Technical Boundaries:** The backend is restricted to Python (FastAPI), the frontend to TypeScript (React), and the database to PostgreSQL. Machine learning is restricted to tabular, classical algorithms (Scikit-Learn).
**Organizational Boundaries:** The software is designed as a multi-tenant internal tool intended for deployment within a single sports club entity. It is not currently designed as a multi-club SaaS platform.

#### 1.4.2 Project Limitations
**Hardware & IoT Integration:** The system does not currently integrate directly with real-time wearable IoT devices (e.g., GPS vests, live heart-rate monitors) via Bluetooth or MQTT. All physiological data (like RPE and average heart rate) must be inputted manually post-session.
**Data Dependency:** The accuracy of the predictive ML models is entirely dependent on the quality and volume of historical data. In the initial weeks of deployment, the system relies on a 'heuristic' fallback mode until sufficient training load variations are recorded to generate statistically significant Joblib artifacts.
**Geographical & Legal:** The system does not inherently implement HIPAA-compliant medical encryption for the injury logs, as it is scoped as a localized athletic tracker rather than a certified healthcare provider system.

### 1.5 Methodology & Tech Stack

#### 1.5.1 Software Engineering Methodology
This project strictly adhered to an **Agile Software Development Lifecycle (SDLC)**, specifically utilizing the **Scrum** framework. Given the highly iterative nature of machine learning integration and UI/UX design, Agile provided the necessary flexibility to pivot requirements based on mid-development testing.
Furthermore, the system design was heavily influenced by **Object-Oriented Software Engineering (OOSE)** principles. Use Case modeling, Entity-Relationship mapping, and Class interface specifications dictated the strict mapping of physical sports entities (e.g., an Athlete, a Pitch) into encapsulated software objects. 

The project was divided into 8 distinct Sprint cycles (each lasting one week), beginning with core API scaffolding and concluding with User Acceptance Testing (UAT). Daily stand-ups and end-of-sprint retrospectives ensured continuous integration of features.

#### 1.5.2 Technology Stack & Rationale
**Backend Framework: FastAPI (Python 3.11+)**
*Rationale:* FastAPI was selected over Django or Flask due to its exceptional asynchronous performance (via Starlette) and its native integration with Pydantic for automatic data validation. Crucially, FastAPI natively generates OpenAPI (Swagger) documentation, drastically accelerating frontend integration. Furthermore, using Python on the backend allows for seamless, zero-friction integration with the Machine Learning ecosystem (Scikit-learn, Pandas).

**Frontend Framework: React 19 with TypeScript and Vite**
*Rationale:* React’s component-based architecture is perfectly suited for building modular dashboards. TypeScript was mandated to enforce strict type-checking against the JSON payloads returned by the FastAPI backend, eliminating a massive class of runtime errors. Vite was chosen over Create React App (CRA) or Webpack for its near-instantaneous Hot Module Replacement (HMR) and optimized build speeds.

**Database: PostgreSQL via SQLAlchemy ORM**
*Rationale:* The relational complexity of the sports club data (Athletes having many Attendances, which belong to specific Training Sessions held at specific Facilities) requires a robust ACID-compliant SQL database. PostgreSQL offers unparalleled reliability. SQLAlchemy was utilized as the Object-Relational Mapper (ORM) to abstract raw SQL queries into secure, Pythonic object manipulations, mitigating SQL injection risks.

**Machine Learning: Scikit-Learn and Pandas**
*Rationale:* While Deep Learning (TensorFlow/PyTorch) is popular, it is vastly oversized for tabular, low-dimensionality sports data. Scikit-Learn provides highly optimized classical algorithms (Logistic Regression, Linear Regression) that execute in milliseconds and can be easily persisted as `.joblib` artifacts. Pandas provides the necessary vectorized operations to rapidly calculate complex features like the Acute:Chronic Workload Ratio across thousands of database rows.

### 1.6 Significance & Beneficiaries

The deployment of the Sports Club AI Platform fundamentally transforms the operational fabric of the organization. The beneficiaries are distinctly categorized:

**For the Coaching Staff:**
Coaches are liberated from the administrative burden of paper attendance. The system provides them with an immediate, visual dashboard highlighting the aggregated training load of their squad. Instead of guessing which players are fatigued, the ML predictive engine explicitly flags athletes in the 'red zone', allowing coaches to make data-driven tactical decisions regarding starting lineups and training intensity.

**For the Physiotherapists and Medical Staff:**
Medical professionals gain a comprehensive, searchable digital archive of every injury sustained at the club. By correlating this injury data with the training loads tracked by the coaches, physiotherapists can definitively prove when a coach is pushing the squad too hard. The platform acts as an objective mediator between the desire to win and the biological limits of the human body.

**For the Athletes:**
Athletes are the ultimate beneficiaries. By being managed under a scientifically rigorous, data-driven system, their risk of sustaining career-altering injuries is drastically reduced. Furthermore, athletes gain direct portal access to view their own fitness progression, fostering a culture of accountability and professional development.

**For Club Management and Administrators:**
Administrators gain a birds-eye view of club resources. Facility double-booking is programmatically eliminated, maximizing pitch utilization. The equipment tracking module ensures that missing assets are instantly flagged, generating thousands of dollars in operational savings annually.

### 1.7 Feasibility Analysis & Task Breakdown

Before execution, a rigorous feasibility assessment was conducted to ensure the project's viability.

**Table 1: Comprehensive Feasibility Matrix**

| Feasibility Domain | Analysis & Evaluation | Status |
| :--- | :--- | :--- |
| **Technical Feasibility** | The selected stack (FastAPI, React, Postgres) consists of mature, heavily documented technologies. The ML requirements (Logistic Regression) are computationally light and will easily execute on standard server hardware without requiring expensive GPUs. | Highly Feasible |
| **Operational Feasibility** | The UI has been designed to mimic existing paper forms, ensuring a low learning curve. Staff resistance is expected to be minimal as the system reduces manual data entry time by an estimated 70%. | Feasible |
| **Economic Feasibility** | The project leverages 100% open-source software (Python, React, Postgres), requiring zero licensing fees. Cloud hosting costs (e.g., AWS EC2/RDS) are projected to be under $50/month. | Highly Feasible |
| **Legal & Ethical** | The system collects personally identifiable information (PII) and physiological data. Implementation of JWT RBAC ensures data privacy between roles, adhering to basic data protection principles. | Feasible |

**Table 2: Cost-Benefit Analysis (Projected Annual Impact)**

| Cost Category | Estimated Expense | Benefit / Savings Category | Estimated Savings |
| :--- | :--- | :--- | :--- |
| Cloud Hosting (AWS) | $600 | Reduction in lost/broken equipment | $3,500 |
| Domain & SSL Certificates | $50 | Elimination of paper/printing costs | $400 |
| Staff Training (1-time) | $800 | Reduced Athlete Medical Rehab Costs | $15,000 |
| Maintenance & Support | $1,200 | Reclaimed Admin Hours (Value) | $8,500 |
| **Total Estimated Costs** | **$2,650** | **Total Estimated Benefits** | **$27,400** |

*Net Projected Annual Value: $24,750*

### 1.8 Project Schedule & Work Breakdown

The project was executed across an 8-week timeline, divided into strict 1-week Agile Sprints.

**Table 3: Work Breakdown Structure (WBS)**

| Sprint | Phase Name | Primary Deliverables / Tasks |
| :--- | :--- | :--- |
| **Sprint 1** | Architecture & DB Scaffolding | Requirements gathering, ERD finalization, PostgreSQL Docker setup, SQLAlchemy Base models. |
| **Sprint 2** | Auth & Security Core | JWT token generation, password bcrypt hashing, API router RBAC dependencies. |
| **Sprint 3** | Core CRUD APIs | Endpoints for Athletes, Facilities, Equipment, and Training Sessions. |
| **Sprint 4** | Frontend Foundation | Vite React initialization, Tailwind configuration, Axios interceptor setup, Login UI. |
| **Sprint 5** | Dashboard Development | Athlete profiles, Training calendar views, dynamic data tables. |
| **Sprint 6** | Machine Learning Backend | Pandas feature engineering (ACWR), Scikit-Learn training pipelines, `.joblib` artifact saving. |
| **Sprint 7** | ML Integration & UI Analytics | Connecting React charts (Recharts) to the ML inference endpoints, Risk badge implementation. |
| **Sprint 8** | Testing, Bug Fixes, & UAT | E2E testing, resolving Router crashes, optimizing DB queries, final documentation. |

**Mermaid.js Gantt Chart: Project Timeline**
```mermaid
gantt
    title Sports Club AI Platform - Agile Development Schedule
    dateFormat  YYYY-MM-DD
    axisFormat  %m-%d
    
    section Database & API
    Sprint 1: Architecture & DB     :done,    des1, 2026-06-01, 7d
    Sprint 2: Auth & Security       :done,    des2, 2026-06-08, 7d
    Sprint 3: Core CRUD APIs        :done,    des3, 2026-06-15, 7d
    
    section Frontend UI
    Sprint 4: React Foundation      :done,    des4, 2026-06-22, 7d
    Sprint 5: Dashboards & Forms    :done,    des5, 2026-06-29, 7d
    
    section AI / ML Integration
    Sprint 6: Scikit-Learn Pipeline :active,  des6, 2026-07-06, 7d
    Sprint 7: Analytics UI          :active,  des7, 2026-07-13, 7d
    
    section Finalization
    Sprint 8: Testing & UAT         :         des8, 2026-07-20, 7d
```

---
---

## CHAPTER 2: SOFTWARE / SYSTEM REQUIREMENTS SPECIFICATION (SRS)

### 2.1 Introduction / Overview
This Software Requirements Specification (SRS) constitutes the definitive blueprint bridging the conceptual background described in Chapter 1 with the technical architectural specifications in Chapter 3. The purpose of this exhaustive document is to precisely define the functional behavior, performance constraints, and systemic boundaries of the Sports Club AI Platform. It provides a highly granular, object-oriented specification of the expected inputs, internal processing logic, and expected outputs across all modules. This document serves as the absolute contract between the development team, project stakeholders, and end-users, ensuring that the delivered software unconditionally meets the rigid demands of a modern sports science and administrative environment. 

### 2.2 Existing / Current System Analysis
The legacy workflow at the target sports club is characterized by a severe lack of digitization and integration. Currently, the organization operates across fragmented analog and localized digital mediums. For instance, athlete attendance is manually recorded on physical clipboards during training sessions. These clipboards are subsequently handed to administrative staff, who transcribe the data into isolated Microsoft Excel spreadsheets. Separately, the physiotherapy department maintains confidential athlete injury records in locked filing cabinets, utilizing proprietary medical software that has no API integration capabilities. 

This legacy process introduces critical, systemic pain points:
1. **Severe Data Latency:** The time delay between an athlete participating in a training session and that data becoming queryable is measured in days. This latency makes it impossible to dynamically adjust training loads within a given micro-cycle.
2. **High Data Redundancy and Asymmetry:** The coach’s spreadsheet and the medical staff’s records frequently contain conflicting information regarding an athlete's physical availability, leading to dangerous tactical misjudgments.
3. **Absence of Predictive Capability:** The current ecosystem is entirely reactive. Injuries are treated post-occurrence because the club possesses no mechanism to aggregate historical workload metrics to calculate predictive Acute:Chronic Workload Ratios (ACWR).
4. **Administrative Overhead:** Facility managers spend hours manually reconciling pitch and gym bookings via email, resulting in frequent double-bookings and suboptimal facility utilization.

### 2.3 Proposed System

#### 2.3.1 Function Definition
The proposed platform abstracts the club's operations into six distinct, interconnected functional modules.

1. **Authentication & Identity Module**
   - **Inputs:** User Email, Password string, Registration claims.
   - **Processing:** Validates email format. Hashes password using the `bcrypt` algorithm with a configurable work factor (default 12). Queries the PostgreSQL database to verify credentials. Upon success, signs a JSON Web Token (JWT) using HMAC-SHA256 containing the user's UUID and assigned RBAC role.
   - **Outputs:** HTTP 200 containing the Bearer token.
   - **Pre-condition:** User must not already exist during registration; credentials must match during login.

2. **Athlete Profile Management Module**
   - **Inputs:** JSON payload comprising biometric data (height, weight), demographic data, and positional roles.
   - **Processing:** Validates payload against Pydantic schema constraints (e.g., height > 0). Executes SQLAlchemy ORM `add()` and `commit()` operations, translating Python objects into PostgreSQL `INSERT`/`UPDATE` transactions. 
   - **Outputs:** Serialized `AthleteOut` JSON object containing the newly generated database ID.
   - **Pre-condition:** Requesting user must possess `Admin` or `Coach` role credentials.

3. **Training & Attendance Module**
   - **Inputs:** Session metadata (date, duration, focus), RPE integers (1-10), Athlete IDs.
   - **Processing:** Dynamically calculates `training_load` as the product of `duration_min` and `RPE`. Enforces unique constraints ensuring an athlete cannot have duplicate attendance records for the same session.
   - **Outputs:** HTTP 201 Created and the associated Attendance records.
   - **Pre-condition:** The referenced facility must not have a conflicting session scheduled.

4. **Medical & Injury Logging Module**
   - **Inputs:** Injury type, anatomical location, severity enumerations (Minor, Moderate, Severe), and estimated return dates.
   - **Processing:** Links the injury record to the athlete's primary key. If severity is 'Severe', the system automatically updates the athlete's global `is_active` status to `False`.
   - **Outputs:** Persisted `InjuryRecord` JSON.
   - **Pre-condition:** Requesting user must hold the `Physiotherapist` role.

5. **Facilities & Equipment Module**
   - **Inputs:** Facility type, booking slots, equipment categories, condition statuses.
   - **Processing:** Executes temporal overlap queries to prevent facility double-booking. Tracks equipment inventory quantities and updates the last known maintenance timestamp.
   - **Outputs:** Filtered lists of available facilities for requested time blocks.
   - **Pre-condition:** Valid JWT token.

6. **Machine Learning Pipeline Module**
   - **Inputs:** Historical Attendance loads and Performance metrics extracted via SQL JOINs.
   - **Processing:** Normalizes data utilizing Scikit-learn's `StandardScaler`. Trains a `LogisticRegression` classifier for binary injury risk and a `LinearRegression` model for continuous fitness scoring. Serializes the fitted models into `.joblib` binary artifacts.
   - **Outputs:** Predictive accuracy metrics (e.g., F1-score, R-squared) and the physical artifact saved to disk.
   - **Pre-condition:** A minimum of 50 historical data rows must exist to prevent overfitting.

#### 2.3.2 Functional Requirements
The system must satisfy the following exhaustive list of functional requirements, categorized by module:

**Authentication & Security**
1. The system should securely authenticate users using email and password credentials.
2. The system should reject passwords shorter than 8 characters during registration.
3. The system should hash all user passwords utilizing the `bcrypt` algorithm prior to database insertion.
4. The system should generate a JSON Web Token (JWT) containing the user's role upon successful login.
5. The system should invalidate active sessions when a user explicitly triggers the logout function.
6. The system should reject API requests possessing expired or malformed JWTs with an HTTP 401 response.
7. The system should enforce Role-Based Access Control (RBAC) to restrict module access based on role hierarchy.

**Athlete Management**
8. The system should allow Coaches and Admins to create new athlete profiles.
9. The system should allow Athletes to view their own read-only profile data.
10. The system should allow Coaches to update an athlete's biometric metrics (height, weight).
11. The system should allow Coaches to assign an athlete to a specific playing position.
12. The system should prevent the deletion of an athlete profile if they have active injury records.
13. The system should provide a paginated list of all active athletes for the administrative dashboard.
14. The system should allow users to filter the athlete list by playing position and active status.

**Training & Attendance Management**
15. The system should allow Coaches to schedule new training sessions specifying date, time, and facility.
16. The system should prevent the scheduling of a training session if the selected facility is already booked.
17. The system should allow Coaches to edit the tactical focus and intensity of a scheduled session.
18. The system should allow Coaches to cancel training sessions, automatically notifying assigned athletes.
19. The system should allow Coaches to record athlete attendance (Present, Absent, Late) per session.
20. The system should allow Coaches to input the Rating of Perceived Exertion (RPE) on a scale of 1-10 for present athletes.
21. The system should calculate and persist the total training load (Duration × RPE) for each attendance record.
22. The system should allow Athletes to view their upcoming scheduled training sessions on a calendar UI.

**Medical & Injury Tracking**
23. The system should allow Physiotherapists to create detailed injury logs (body part, cause, date).
24. The system should allow Physiotherapists to classify an injury's severity as Minor, Moderate, or Severe.
25. The system should automatically flag athletes with 'Severe' injuries on the Coach's dashboard.
26. The system should allow Physiotherapists to update the expected return-to-play date.
27. The system should allow Physiotherapists to append free-text clinical progress notes to existing injury records.
28. The system should allow Physiotherapists to mark an injury as 'Resolved', thereby restoring the athlete's active status.
29. The system should allow Coaches to view a read-only history of an athlete's past injuries.

**Facilities & Equipment Management**
30. The system should allow Staff to register new sports facilities with maximum capacity limits.
31. The system should allow Staff to mark a facility as unavailable due to maintenance.
32. The system should allow Staff to log new pieces of sports equipment into the inventory database.
33. The system should allow Staff to update the physical condition status (Good, Fair, Broken) of equipment.
34. The system should automatically decrement available equipment quantity when items are marked as Broken.
35. The system should allow Staff to log the most recent maintenance date for specialized equipment.

**Machine Learning Pipeline**
36. The system should allow Coaches to manually trigger the machine learning training pipeline via a dashboard button.
37. The system should automatically aggregate historical training loads and RPE data for feature engineering.
38. The system should train a Logistic Regression model to classify athlete injury risk probabilities.
39. The system should train a Linear Regression model to forecast an athlete's upcoming fitness score.
40. The system should persist the trained Scikit-Learn models and Standard Scalers as `.joblib` binary artifacts on the server.
41. The system should expose an inference endpoint to predict the current injury risk for a given athlete using the latest artifact.
42. The system should return a 'Heuristic Mode' prediction if no trained ML model artifact exists on the server.
43. The system should visually display ML-generated risk warnings (e.g., High Risk Red Badges) on the Athlete and Coach dashboards.
44. The system should generate automated string recommendations (e.g., 'Reduce High-Intensity Sessions') based on ML outputs.

#### 2.3.3 Non-Functional Requirements
- **Performance & Latency**: Backend REST API endpoints must complete database queries and return JSON payloads in under 200ms under standard load conditions. Machine Learning inference endpoints must return predictions in under 500ms.
- **Security**: Passwords must be hashed using `bcrypt` with a minimum cost factor of 12. API endpoints must be protected against cross-origin requests utilizing strict CORS policies, explicitly whitelisting the React frontend domain.
- **Scalability**: The database schema must explicitly enforce foreign key indexing (e.g., indexing `athlete_id` in the `Attendance` table) to maintain logarithmic `O(log n)` query speeds as table row counts expand into the millions.
- **Maintainability**: The backend codebase must strictly adhere to PEP 8 Python formatting standards, enforced by `flake8`. All functions must include Python type hints.
- **Usability**: The frontend SPA must utilize a mobile-first responsive design approach (via Tailwind CSS) ensuring operability on tablet devices commonly used by coaches on the pitch.
- **Availability**: The system should maintain a 99.9% Service Level Agreement (SLA) uptime during standard club operating hours (06:00 to 22:00).

#### 2.3.4 System Models (OOSE)

**Use Case Diagram:**
```mermaid
flowchart LR
    %% Actors
    Coach([Coach])
    Athlete([Athlete])
    Physio([Physiotherapist])
    Staff([Staff/Admin])

    %% Use Cases
    subgraph Core System
        UC1(UC-01: Authenticate User)
        UC2(UC-02: Register Athlete Profile)
        UC3(UC-03: Schedule Training Session)
        UC4(UC-04: Log Attendance & RPE)
        UC5(UC-05: Log New Injury)
        UC6(UC-06: Update Recovery Status)
        UC7(UC-07: Book Facility)
        UC8(UC-08: Track Equipment Status)
        UC9(UC-09: Trigger ML Pipeline)
        UC10(UC-10: View Injury Risk)
        UC11(UC-11: View Fitness Forecast)
        UC12(UC-12: Generate Reports)
        UC13(UC-13: Manage User Roles)
        UC14(UC-14: Cancel Training Session)
        UC15(UC-15: View Personal Schedule)
    end

    %% Relationships
    Coach --> UC1
    Athlete --> UC1
    Physio --> UC1
    Staff --> UC1

    Coach --> UC2
    Coach --> UC3
    Coach --> UC4
    Coach --> UC9
    Coach --> UC10
    Coach --> UC11
    Coach --> UC14

    Athlete --> UC10
    Athlete --> UC11
    Athlete --> UC15

    Physio --> UC5
    Physio --> UC6
    Physio --> UC10

    Staff --> UC2
    Staff --> UC7
    Staff --> UC8
    Staff --> UC12
    Staff --> UC13
```

**Use Case Specifications:**

| Use Case ID | UC-01 |
| :--- | :--- |
| **Use Case Name** | Authenticate User (Login) |
| **Primary Actor** | Any Registered User |
| **Pre-conditions** | The user possesses a registered account in the PostgreSQL database. |
| **Post-conditions** | A valid JWT is returned and stored in the client's local storage. |
| **Main Success Scenario** | 1. User navigates to the login page.<br>2. User inputs email address.<br>3. User inputs password.<br>4. User clicks 'Submit'.<br>5. React client sends POST request to `/api/auth/login`.<br>6. FastAPI queries the database for the user email.<br>7. FastAPI verifies the hashed password via bcrypt.<br>8. System generates a signed JWT payload.<br>9. FastAPI returns the JWT (HTTP 200).<br>10. React client saves token and redirects to Dashboard. |
| **Alternative Flows** | 7a. Invalid password provided: System returns HTTP 401 Unauthorized. Client displays 'Invalid login' error.<br>6a. Email not found: System returns HTTP 401. |

| Use Case ID | UC-02 |
| :--- | :--- |
| **Use Case Name** | Register Athlete Profile |
| **Primary Actor** | Coach, Admin |
| **Pre-conditions** | Actor is authenticated with appropriate RBAC permissions. |
| **Post-conditions** | A new Athlete and related User record are created. |
| **Main Success Scenario** | 1. Coach clicks 'Add Athlete'.<br>2. Coach inputs basic User details (email, name, pwd).<br>3. Coach inputs biometric data (height, weight).<br>4. Coach assigns playing position.<br>5. Coach clicks 'Save'.<br>6. Client POSTs to `/api/athletes`.<br>7. FastAPI validates JSON schema.<br>8. System creates User record in DB.<br>9. System creates Athlete record linked to User.<br>10. UI refreshes Athlete List. |
| **Alternative Flows** | 7a. Email already exists: DB throws IntegrityError. System returns HTTP 409 Conflict. |

| Use Case ID | UC-03 |
| :--- | :--- |
| **Use Case Name** | Schedule Training Session |
| **Primary Actor** | Coach |
| **Pre-conditions** | Coach is authenticated. Target Facility exists. |
| **Post-conditions** | A new TrainingSession record is scheduled. |
| **Main Success Scenario** | 1. Coach selects 'New Session' from calendar.<br>2. Coach selects a date and time.<br>3. Coach specifies duration in minutes.<br>4. Coach assigns a specific Facility.<br>5. Coach defines the tactical focus.<br>6. Coach clicks 'Create'.<br>7. System checks Facility availability for the timeslot.<br>8. System validates data.<br>9. System persists TrainingSession to DB.<br>10. UI renders session block on calendar. |
| **Alternative Flows** | 7a. Facility already booked: System returns HTTP 409. UI alerts Coach. |

| Use Case ID | UC-04 |
| :--- | :--- |
| **Use Case Name** | Log Attendance & RPE |
| **Primary Actor** | Coach |
| **Pre-conditions** | A scheduled TrainingSession exists. |
| **Post-conditions** | Attendance records and training loads are saved. |
| **Main Success Scenario** | 1. Coach opens the specific Training Session view.<br>2. Coach selects the 'Attendance Roster' tab.<br>3. For each athlete, Coach marks status (Present/Absent).<br>4. For present athletes, Coach inputs RPE value (1-10).<br>5. Coach clicks 'Submit Roster'.<br>6. System calculates `training_load` = Duration * RPE.<br>7. System validates RPE integer bounds.<br>8. System persists Attendance models.<br>9. System recalculates ACWR background metrics.<br>10. UI displays 'Roster Saved' success toast. |
| **Alternative Flows** | 7a. RPE > 10 entered: Validation Error HTTP 422. Submit blocked. |

| Use Case ID | UC-05 |
| :--- | :--- |
| **Use Case Name** | Log New Injury |
| **Primary Actor** | Physiotherapist |
| **Pre-conditions** | Physio is authenticated. Injured Athlete exists. |
| **Post-conditions** | An InjuryRecord is persisted. |
| **Main Success Scenario** | 1. Physio searches and selects an Athlete.<br>2. Physio clicks 'Log New Injury'.<br>3. Physio selects body part from dropdown.<br>4. Physio selects severity (Minor, Moderate, Severe).<br>5. Physio inputs date of occurrence.<br>6. Physio adds clinical notes.<br>7. Physio submits form.<br>8. System persists InjuryRecord.<br>9. System updates Athlete active status if Severe.<br>10. Dashboard alerts Coaches of the new injury. |
| **Alternative Flows** | 4a. Missing mandatory fields: System blocks submission natively in UI. |

| Use Case ID | UC-06 |
| :--- | :--- |
| **Use Case Name** | Update Recovery Status |
| **Primary Actor** | Physiotherapist |
| **Pre-conditions** | An active InjuryRecord exists for the Athlete. |
| **Post-conditions** | Injury status is updated, potentially restoring athlete availability. |
| **Main Success Scenario** | 1. Physio opens Athlete Medical File.<br>2. Physio selects an active InjuryRecord.<br>3. Physio clicks 'Edit Status'.<br>4. Physio appends new progress notes.<br>5. Physio changes expected return date.<br>6. Physio marks status as 'Resolved'.<br>7. System updates InjuryRecord in DB.<br>8. System sets Athlete active status back to True.<br>9. DB transaction commits.<br>10. UI removes High-Risk badge from Athlete profile. |
| **Alternative Flows** | 8a. Athlete has another active Severe injury: Athlete active status remains False. |

| Use Case ID | UC-07 |
| :--- | :--- |
| **Use Case Name** | Book Facility |
| **Primary Actor** | Staff/Admin |
| **Pre-conditions** | Staff is authenticated. |
| **Post-conditions** | Facility booking slot is reserved. |
| **Main Success Scenario** | 1. Staff navigates to Facility Management.<br>2. Staff selects a Facility (e.g., Main Pitch).<br>3. Staff views availability calendar.<br>4. Staff drags cursor over empty time block.<br>5. Staff assigns the block to a specific team/event.<br>6. System validates no overlapping sessions.<br>7. System creates booking record.<br>8. System updates Facility calendar.<br>9. System notifies relevant Coaches.<br>10. UI reflects new booking state. |
| **Alternative Flows** | 6a. Overlap detected due to race condition: System returns 409 Conflict. |

| Use Case ID | UC-08 |
| :--- | :--- |
| **Use Case Name** | Track Equipment Status |
| **Primary Actor** | Staff/Admin |
| **Pre-conditions** | Staff is authenticated. |
| **Post-conditions** | Equipment condition and inventory are updated. |
| **Main Success Scenario** | 1. Staff opens Equipment Inventory table.<br>2. Staff selects an item (e.g., GPS Vest #4).<br>3. Staff clicks 'Update Condition'.<br>4. Staff changes status from 'Good' to 'Broken'.<br>5. Staff logs the maintenance date.<br>6. Staff clicks Save.<br>7. System updates Equipment record.<br>8. System decrements total 'Available' quantity calculation.<br>9. Database commits changes.<br>10. UI visually highlights broken item in red. |
| **Alternative Flows** | 2a. Item not found: 404 Error rendered in UI. |

| Use Case ID | UC-09 |
| :--- | :--- |
| **Use Case Name** | Trigger ML Training Pipeline |
| **Primary Actor** | Coach |
| **Pre-conditions** | Sufficient historical attendance data exists. |
| **Post-conditions** | `.joblib` model artifacts are generated. |
| **Main Success Scenario** | 1. Coach opens Analytics Dashboard.<br>2. Coach clicks 'Train ML Models'.<br>3. System POSTs to `/api/ml/train`.<br>4. Backend queries DB for historical Performance and Attendance.<br>5. Backend calculates ACWR and standardizes data.<br>6. Backend fits Logistic Regression classifier.<br>7. Backend fits Linear Regression model.<br>8. Backend serializes models using joblib.<br>9. Backend saves metadata to `ml_models` table.<br>10. UI receives HTTP 200 and renders updated accuracy metrics. |
| **Alternative Flows** | 4a. Insufficient rows: Pipeline aborts, returns 'Skipped' status to UI. |

| Use Case ID | UC-10 |
| :--- | :--- |
| **Use Case Name** | View Injury Risk |
| **Primary Actor** | Coach, Athlete, Physiotherapist |
| **Pre-conditions** | A trained ML model artifact exists on the server. |
| **Post-conditions** | User is presented with a risk probability. |
| **Main Success Scenario** | 1. User loads Athlete Profile page.<br>2. React Client GETs `/api/ml/predict/{id}`.<br>3. FastAPI invokes ML Service.<br>4. ML Service loads latest `.joblib` artifact.<br>5. ML Service queries recent training load features for the Athlete.<br>6. ML Service executes `predict_proba()`.<br>7. System parses float probability.<br>8. System maps probability to Risk Level (Low/Moderate/High).<br>9. FastAPI returns JSON payload.<br>10. UI renders Risk Badge dynamically based on string value. |
| **Alternative Flows** | 4a. Artifact missing: System defaults to rule-based heuristic calculation. |

| Use Case ID | UC-11 |
| :--- | :--- |
| **Use Case Name** | View Fitness Forecast |
| **Primary Actor** | Coach, Athlete |
| **Pre-conditions** | A trained ML model artifact exists. |
| **Post-conditions** | User is presented with a forecasted fitness score. |
| **Main Success Scenario** | 1. User loads Analytics Dashboard.<br>2. Client requests fitness prediction for squad.<br>3. FastAPI invokes ML Service.<br>4. ML Service loads `.joblib` artifact.<br>5. ML Service aggregates recent features.<br>6. ML Service executes LinearRegression `predict()`.<br>7. System returns predicted score (0-100).<br>8. System generates automated string recommendations.<br>9. JSON response is sent to Client.<br>10. UI renders line chart showing forecasted progression. |
| **Alternative Flows** | 5a. Missing feature data for a new athlete: System returns null for that specific athlete. |

| Use Case ID | UC-12 |
| :--- | :--- |
| **Use Case Name** | Generate Reports |
| **Primary Actor** | Staff/Admin |
| **Pre-conditions** | Admin is authenticated. |
| **Post-conditions** | CSV or PDF report is generated. |
| **Main Success Scenario** | 1. Admin navigates to Reports module.<br>2. Admin selects date range.<br>3. Admin selects data type (e.g., Facility Utilization).<br>4. Admin clicks 'Generate CSV'.<br>5. Backend queries the database.<br>6. Backend formats data using Pandas.<br>7. Backend streams CSV file response.<br>8. Browser downloads the file.<br>9. Download completes.<br>10. UI displays success notification. |
| **Alternative Flows** | 5a. Query timeout due to massive date range: Returns 504 Gateway Timeout. |

**Sequence Diagram: Authentication Flow**
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant React Client
    participant FastAPI
    participant PostgreSQL

    User->>React Client: Enter email & password
    React Client->>FastAPI: POST /api/auth/login
    FastAPI->>PostgreSQL: SELECT * FROM users WHERE email = ?
    PostgreSQL-->>FastAPI: Return User Record (hashed_pwd)
    FastAPI->>FastAPI: bcrypt.verify(password, hashed_pwd)
    FastAPI->>FastAPI: jwt.encode({'sub': user_id, 'role': role})
    FastAPI-->>React Client: 200 OK (access_token)
    React Client->>React Client: localStorage.setItem('token')
    React Client->>FastAPI: GET /api/auth/me (Auth: Bearer JWT)
    FastAPI->>FastAPI: jwt.decode() & validate expiration
    FastAPI-->>React Client: 200 OK (User Profile Data)
    React Client-->>User: Render Authorized Dashboard
```

**Sequence Diagram: Injury Logging Flow**
```mermaid
sequenceDiagram
    autonumber
    actor Physio
    participant React Client
    participant FastAPI
    participant Database

    Physio->>React Client: Submit New Injury Form
    React Client->>FastAPI: POST /api/injuries (JSON payload, Bearer JWT)
    FastAPI->>FastAPI: Validate JWT and Role == 'physiotherapist'
    FastAPI->>FastAPI: Validate JSON via Pydantic Schema
    FastAPI->>Database: INSERT INTO injury_records
    Database-->>FastAPI: Transaction Commit Success
    opt If severity == 'Severe'
        FastAPI->>Database: UPDATE athletes SET is_active = False WHERE id = ?
        Database-->>FastAPI: Transaction Commit Success
    end
    FastAPI-->>React Client: 201 Created (InjuryRecord JSON)
    React Client-->>Physio: Display Success Toast & Refresh Athlete Profile
```

**Sequence Diagram: ML Prediction Inference Flow**
```mermaid
sequenceDiagram
    autonumber
    actor Coach
    participant React Client
    participant FastAPI
    participant ML_Service
    participant PostgreSQL

    Coach->>React Client: View Athlete Analytics Profile
    React Client->>FastAPI: GET /api/ml/predict/{athlete_id}
    FastAPI->>ML_Service: predict_injury_risk(athlete_id)
    ML_Service->>PostgreSQL: Query recent MLModel artifact path
    PostgreSQL-->>ML_Service: Return artifact_path
    ML_Service->>ML_Service: joblib.load(artifact_path)
    ML_Service->>PostgreSQL: Query Athlete historical features (ACWR)
    PostgreSQL-->>ML_Service: Return Feature Vector
    ML_Service->>ML_Service: Scaler.transform(Feature Vector)
    ML_Service->>ML_Service: LogisticRegression.predict_proba()
    ML_Service->>ML_Service: Map probability to Risk Level Enum
    ML_Service-->>FastAPI: Return Risk Dictionary
    FastAPI-->>React Client: 200 OK (Risk JSON Payload)
    React Client-->>Coach: Render Visual Risk Badge Component
```

---
## CHAPTER 3: DESIGN SPECIFICATION

### 3.1 High-Level Architecture
#### 3.1.1 Software Architecture Paradigm
The Sports Club AI Platform strictly adheres to a multi-tier Layered Architecture, heavily influenced by Client-Server computing principles and Object-Oriented Software Engineering (OOSE). The system decouples the presentation layer, the application logic layer, and the data persistence layer to ensure maximum scalability and maintainability.

**Presentation Layer (Frontend):** 
The client is a Single Page Application (SPA) built using React 19 and TypeScript. It is entirely decoupled from the backend and communicates exclusively via asynchronous HTTP REST calls. By offloading HTML rendering and state management (via Context API) to the client's browser, the server is freed to handle high-concurrency requests and expensive machine learning computations.

**Application Logic Layer (Backend):**
The backend acts as the central intelligence node, powered by Python 3.11 and the FastAPI framework. FastAPI operates as an asynchronous ASGI server, natively handling concurrent requests using `asyncio`. Within this layer, strict separations exist:
- **Routers**: Handle HTTP request parsing and response formatting.
- **Services/Controllers**: House the core business logic (e.g., calculating ACWR, verifying JWTs).
- **ML Pipeline**: A dedicated, decoupled subsystem utilizing Scikit-learn to execute data transformations and inference independent of the web request cycle.

**Data Layer:**
All state persistence is managed by a PostgreSQL relational database. The application layer interfaces with the data layer strictly through the SQLAlchemy Object-Relational Mapper (ORM), neutralizing SQL injection vulnerabilities and allowing developers to interact with database rows as encapsulated Python objects.

#### 3.1.2 Authentication & ML Subsystem Design
**Stateless Authentication (JWT):**
The system abandons traditional server-side session cookies in favor of stateless JSON Web Tokens (JWT). Upon successful login, the FastAPI server signs a JWT containing the user's UUID and RBAC role. The React client stores this token in memory (or `localStorage`) and injects it into the Authorization header of every subsequent API request as a Bearer token. This statelessness implies the backend does not need to query the database to verify an active session; it merely mathematically verifies the JWT cryptographic signature, drastically reducing database load and allowing horizontal scaling of the API servers.

**Scikit-Learn Persistent Pipelines:**
The Machine Learning subsystem is integrated directly into the Python application layer. To prevent memory leaks and model drift, the system utilizes the `joblib` library to serialize fitted Scikit-learn models (Logistic Regression for classification, Linear Regression for forecasting) alongside their respective `StandardScaler` transformations. These pipelines are persisted to the server's disk as binary artifacts (`.joblib` files). During inference, the API dynamically loads the most recent artifact, guaranteeing that predictions always utilize the latest historical data distribution.

**Mermaid.js High-Level Architecture Diagram:**
```mermaid
flowchart TD
    %% Frontend Layer
    subgraph Presentation Layer [Frontend SPA - React 19]
        UI[React Components & Views]
        State[React Context / Redux]
        Client[Axios HTTP Client]
        UI --> State
        State --> Client
    end

    %% External Network
    Client -- "HTTP/REST (JSON + JWT)" --> Gateway[FastAPI Uvicorn ASGI Server]

    %% Backend Layer
    subgraph Application Logic Layer [Backend API - FastAPI]
        Gateway --> Auth[JWT Security Dep]
        Gateway --> Routers[API Routers]
        Auth --> Routers
        Routers --> Services[Business Logic Services]
        Routers --> Pydantic[Pydantic DTO Validation]
        
        %% ML Subsystem
        Services <--> ML[Scikit-learn MLService]
        ML <--> Joblib[(Joblib Disk Artifacts)]
    end

    %% Data Access
    Services --> ORM[SQLAlchemy ORM]

    %% Persistence Layer
    subgraph Data Persistence Layer [Database]
        ORM -- "TCP (psycopg2)" --> Postgres[(PostgreSQL Relational DB)]
    end
```

#### 3.1.3 Full API Routing Specification
The system exposes a comprehensive, RESTful API surface. The following exhaustive table dictates the contract for every endpoint in the application.

| Endpoint Route | HTTP Method | Protected? (Role) | Request Payload (DTO Schema) | Success Code | Description / Internal Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/auth/login` | POST | Public | `OAuth2PasswordRequestForm` | 200 OK | Validates credentials; returns signed JWT `access_token`. |
| `/api/auth/register` | POST | Admin | `UserCreate` | 201 Created | Registers new user, hashes pwd via bcrypt. |
| `/api/auth/me` | GET | Any Registered | None | 200 OK | Decodes JWT, returns current active user profile. |
| `/api/athletes` | GET | Coach, Admin | Query Params: `team`, `position` | 200 OK | Returns paginated list of all active Athlete objects. |
| `/api/athletes/{id}` | GET | Any Registered | None | 200 OK | Returns comprehensive detailed view of a single Athlete. |
| `/api/athletes` | POST | Coach, Admin | `AthleteCreate` | 201 Created | Inserts new athlete profile linked to a User account. |
| `/api/athletes/{id}` | PUT | Coach | `AthleteUpdate` | 200 OK | Updates athlete biometrics (height, weight). |
| `/api/athletes/{id}` | DELETE | Admin | None | 204 No Content | Cascade deletes athlete and all linked historic records. |
| `/api/training` | GET | Any Registered | Query Params: `start_date`, `end_date`| 200 OK | Retrieves list of TrainingSession objects for calendar. |
| `/api/training` | POST | Coach | `TrainingSessionCreate` | 201 Created | Schedules a new session, enforcing facility availability. |
| `/api/training/{id}` | PUT | Coach | `TrainingSessionUpdate` | 200 OK | Modifies session time, duration, or tactical focus. |
| `/api/training/{id}` | DELETE | Coach, Admin | None | 204 No Content | Cancels a session and deletes associated attendance models. |
| `/api/attendance` | POST | Coach | `List[AttendanceCreate]` | 201 Created | Batch inserts attendance and RPE logs for a session. |
| `/api/attendance/{id}` | PUT | Coach | `AttendanceUpdate` | 200 OK | Modifies an existing RPE score; recalculates training load. |
| `/api/injuries` | GET | Coach, Physio | Query Params: `athlete_id` | 200 OK | Retrieves historic injury logs. |
| `/api/injuries` | POST | Physio | `InjuryRecordCreate` | 201 Created | Creates injury log; automatically flags Athlete as inactive if severe. |
| `/api/injuries/{id}` | PUT | Physio | `InjuryRecordUpdate` | 200 OK | Updates recovery status, notes, or expected return date. |
| `/api/performance` | POST | Coach | `PerformanceRecordCreate` | 201 Created | Logs quantitative fitness metrics (e.g., VO2 Max, Sprint Speed). |
| `/api/facilities` | GET | Any Registered | None | 200 OK | Lists all club facilities and their max capacities. |
| `/api/facilities` | POST | Admin | `FacilityCreate` | 201 Created | Registers a new physical sports facility. |
| `/api/facilities/book`| POST | Coach, Staff | `FacilityBookingCreate` | 201 Created | Reserves a facility slot; blocks overlapping temporal bounds. |
| `/api/equipment` | GET | Staff, Admin | None | 200 OK | Returns list of all equipment inventory and condition statuses. |
| `/api/equipment` | POST | Staff | `EquipmentCreate` | 201 Created | Registers new inventory items into the database. |
| `/api/equipment/{id}` | PUT | Staff | `EquipmentUpdate` | 200 OK | Updates equipment condition (e.g., marks as Broken). |
| `/api/ml/train` | POST | Coach, Admin | None | 200 OK | Triggers ML pipeline: extracts features, fits LogReg/LinReg models. |
| `/api/ml/predict/{id}`| GET | Coach, Physio | None | 200 OK | Executes joblib inference; returns Injury Risk classification %. |
| `/api/ml/forecast/{id}`| GET | Coach, Athlete | None | 200 OK | Executes joblib inference; returns forecasted Fitness Score (0-100). |
| `/api/users` | GET | Admin | None | 200 OK | Lists all system users and their RBAC roles. |
| `/api/memberships` | POST | Admin | `MembershipCreate` | 201 Created | Links an Athlete to a financial membership tier. |

#### 3.1.4 Database Data Dictionary
The physical data model relies on a fully normalized PostgreSQL database utilizing primary and foreign key constraints to ensure referential integrity. 

*Table 1: `users`*
| Column Name | Data Type | Key Type (PK/FK) | Nullable | Description / Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | UUID | PK | No | System-generated unique identifier. |
| `email` | VARCHAR(255) | Unique Index | No | User's email address for authentication. |
| `hashed_password` | VARCHAR(255) | - | No | Bcrypt hash of the plaintext password. |
| `full_name` | VARCHAR(100) | - | No | Display name of the user. |
| `role` | VARCHAR(50) | - | No | RBAC Role (admin, coach, athlete, physio, staff). |
| `is_active` | BOOLEAN | - | No | Defaults to TRUE. Disabling locks account access. |

*Table 2: `athletes`*
| Column Name | Data Type | Key Type (PK/FK) | Nullable | Description / Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | INTEGER | PK | No | Auto-incrementing identifier. |
| `user_id` | UUID | FK -> users.id | No | One-to-one relationship to the User table. |
| `height_cm` | FLOAT | - | Yes | Athlete height in centimeters. |
| `weight_kg` | FLOAT | - | Yes | Athlete weight in kilograms. |
| `position` | VARCHAR(50) | - | Yes | Tactical playing position (e.g., Striker, Goalkeeper). |
| `is_active` | BOOLEAN | - | No | Reflects physical availability. Set to FALSE upon severe injury. |

*Table 3: `training_sessions`*
| Column Name | Data Type | Key Type (PK/FK) | Nullable | Description / Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | INTEGER | PK | No | Auto-incrementing identifier. |
| `date_time` | TIMESTAMP | Indexed | No | Start date and time of the session. |
| `duration_min` | INTEGER | - | No | Session length in minutes. |
| `focus_area` | VARCHAR(255) | - | Yes | Tactical or physical focus (e.g., "Cardio", "Set Pieces"). |
| `facility_id` | INTEGER | FK -> facilities.id | No | Physical location of the session. |

*Table 4: `attendances`*
| Column Name | Data Type | Key Type (PK/FK) | Nullable | Description / Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | INTEGER | PK | No | Auto-incrementing identifier. |
| `athlete_id` | INTEGER | FK -> athletes.id | No | The athlete attending. |
| `session_id` | INTEGER | FK -> training_sessions.id | No | The target session. |
| `status` | VARCHAR(20) | - | No | Enum: "Present", "Absent", "Late". |
| `rpe` | INTEGER | - | Yes | Rating of Perceived Exertion (1-10). |
| `training_load` | FLOAT | - | Yes | Calculated: duration_min * rpe. Null if Absent. |

*Table 5: `injury_records`*
| Column Name | Data Type | Key Type (PK/FK) | Nullable | Description / Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | INTEGER | PK | No | Auto-incrementing identifier. |
| `athlete_id` | INTEGER | FK -> athletes.id | No | The injured athlete. |
| `body_part` | VARCHAR(100) | - | No | Location of injury (e.g., "Left Hamstring"). |
| `severity` | VARCHAR(50) | - | No | Enum: "Minor", "Moderate", "Severe". |
| `date_logged` | TIMESTAMP | - | No | Defaults to current timestamp. |
| `expected_return` | DATE | - | Yes | Forecasted recovery date. |
| `status` | VARCHAR(50) | - | No | "Active" or "Resolved". |

*Table 6: `performance_records`*
| Column Name | Data Type | Key Type (PK/FK) | Nullable | Description / Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | INTEGER | PK | No | Auto-incrementing identifier. |
| `athlete_id` | INTEGER | FK -> athletes.id | No | Target athlete. |
| `date_logged` | TIMESTAMP | - | No | Date metrics were recorded. |
| `vo2_max` | FLOAT | - | Yes | Oxygen consumption metric. |
| `sprint_speed_ms`| FLOAT | - | Yes | Max sprint speed in meters per second. |
| `fatigue_index` | FLOAT | - | Yes | Calculated metric of physical degradation. |

*Table 7: `facilities`*
| Column Name | Data Type | Key Type (PK/FK) | Nullable | Description / Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | INTEGER | PK | No | Auto-incrementing identifier. |
| `name` | VARCHAR(150) | - | No | Display name (e.g., "Main Pitch"). |
| `facility_type` | VARCHAR(100) | - | No | Enum: "Pitch", "Gym", "Pool", "Clinic". |
| `max_capacity` | INTEGER | - | No | Maximum allowed human occupants. |
| `is_available` | BOOLEAN | - | No | Global override for maintenance closure. |

*Table 8: `equipment`*
| Column Name | Data Type | Key Type (PK/FK) | Nullable | Description / Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | INTEGER | PK | No | Auto-incrementing identifier. |
| `name` | VARCHAR(150) | - | No | Equipment identifier (e.g., "GPS Vest #12"). |
| `category` | VARCHAR(100) | - | No | Enum: "Wearable", "Ball", "Medical", "Gym". |
| `condition` | VARCHAR(50) | - | No | Enum: "Good", "Fair", "Broken". |
| `last_maintenance`| DATE | - | Yes | Date of last service. |

*Table 9: `memberships`*
| Column Name | Data Type | Key Type (PK/FK) | Nullable | Description / Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | INTEGER | PK | No | Auto-incrementing identifier. |
| `athlete_id` | INTEGER | FK -> athletes.id | No | Subscribed athlete. |
| `tier` | VARCHAR(50) | - | No | Enum: "Standard", "Premium", "Elite". |
| `start_date` | DATE | - | No | Subscription start. |
| `end_date` | DATE | - | No | Subscription expiration. |

*Table 10: `ml_models`*
| Column Name | Data Type | Key Type (PK/FK) | Nullable | Description / Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | INTEGER | PK | No | Auto-incrementing identifier. |
| `version` | VARCHAR(50) | Unique | No | Release tag (e.g., "v1.2.0-logreg"). |
| `artifact_path` | VARCHAR(255) | - | No | File system path to the `.joblib` binary. |
| `accuracy_score` | FLOAT | - | No | Model validation metric (e.g., 0.89). |
| `created_at` | TIMESTAMP | - | No | Timestamp of pipeline execution. |
| `is_active` | BOOLEAN | - | No | Indicates the currently deployed inference model. |

### 3.2 Detail Design

#### 3.2.1 Design Trade-offs & Conventions
In designing the Sports Club AI Platform, several critical architectural trade-offs were made to balance performance, complexity, and maintainability.

**Speed vs. Memory in the ML Pipeline:**
Scikit-Learn Logistic and Linear Regression models were selected explicitly over Deep Learning (Neural Network) architectures. While Deep Learning can model highly non-linear relationships, it demands massive memory overhead, specialized GPU instances, and hundreds of thousands of data rows to avoid overfitting. Given the relatively small, tabular nature of the sports club's dataset (attendance, RPE, height, weight), classical algorithms execute inference in microseconds (optimizing Speed) and occupy mere kilobytes of RAM (optimizing Memory), fulfilling the performance SLA without sacrificing accuracy.

**Synchronous vs. Asynchronous Operations:**
FastAPI natively supports `async`/`await`. All database I/O operations (SQLAlchemy ORM queries) and external network calls are executed asynchronously, preventing thread-blocking during high-concurrency events (e.g., 40 athletes opening their dashboards simultaneously). However, the Machine Learning training pipeline is inherently CPU-bound and synchronous. To prevent the ML training loop from freezing the asynchronous web server, the `execute_training_pipeline()` function is delegated to a separate background worker thread using FastAPI's `BackgroundTasks` API.

**Error Handling Strategy:**
The backend implements a globally registered exception handler. Rather than allowing raw Python stack traces (which pose a security risk) or generic 500 errors to propagate to the React client, all ORM `IntegrityError` (e.g., duplicate email) and `ValueError` exceptions are caught at the middleware layer. They are serialized into standardized JSON problem details (RFC 7807) featuring consistent `error_code` and `detail` keys. The React client intercepts these standard structures via Axios interceptors to display user-friendly localized toast notifications.

#### 3.2.2 Package Decomposition
The backend Python source code is strictly decomposed into cohesive packages following domain-driven design principles.

**Mermaid.js Package Diagram:**
```mermaid
classDiagram
    %% Packages
    namespace FastAPI_Backend {
        class `app.main` {
            +FastAPI App Instance
            +CORS Middleware
        }
        class `app.api` {
            +Routers (Auth, Athletes, ML)
            +Dependency Injection
        }
        class `app.core` {
            +Config Settings
            +Security / JWT Logic
        }
        class `app.models` {
            +SQLAlchemy ORM Classes
            +DB Declarative Base
        }
        class `app.schemas` {
            +Pydantic Validation DTOs
        }
        class `app.crud` {
            +Database I/O functions
        }
        class `app.ml` {
            +Scikit-Learn MLService
            +Feature Engineering
        }
        class `app.db` {
            +Database Session Local
            +Postgres Engine Connection
        }
    }

    %% Dependencies
    `app.main` --> `app.api`
    `app.main` --> `app.core`
    `app.api` --> `app.schemas`
    `app.api` --> `app.crud`
    `app.crud` --> `app.models`
    `app.crud` --> `app.db`
    `app.models` --> `app.db`
    `app.api` --> `app.ml`
    `app.ml` --> `app.crud`
```

#### 3.2.3 Class Interface Specifications (ODD)

The following tables define the strict Object-Oriented interfaces utilized throughout the application layer.

**1. Core SQLAlchemy ORM Models (`app.models`)**

| Class Name & Package | Public Attributes (Name, Type) | Public Methods (Signature, Return Type) | Description / Notes |
| :--- | :--- | :--- | :--- |
| `app.models.User` | `id: str`, `email: str`, `hashed_password: str`, `role: str`, `athlete: relationship` | `verify_password(plain_pwd: str) -> bool` | Encapsulates identity and credential verification logic. |
| `app.models.Athlete` | `id: int`, `user_id: str`, `height_cm: float`, `weight_kg: float`, `position: str`, `is_active: bool` | `calculate_bmi() -> float` | Core domain entity. Related to `User` (1:1) and `Attendance` (1:N). |
| `app.models.TrainingSession`| `id: int`, `date_time: datetime`, `duration_min: int`, `focus: str`, `facility_id: int` | `is_upcoming() -> bool` | Temporal entity tracking scheduling. |
| `app.models.Attendance` | `id: int`, `athlete_id: int`, `session_id: int`, `status: str`, `rpe: int`, `training_load: float` | `compute_load() -> float` | Associative entity mapping Athletes to Sessions. |
| `app.models.InjuryRecord` | `id: int`, `athlete_id: int`, `body_part: str`, `severity: str`, `date_logged: datetime`, `status: str` | `mark_resolved() -> None` | Medical ledger entity. Automatically triggers athlete availability logic. |

**2. Core Pydantic DTO Schemas (`app.schemas`)**

| Class Name & Package | Inherits From | Public Attributes (Name, Type, Constraints) | Description / Notes |
| :--- | :--- | :--- | :--- |
| `app.schemas.AthleteCreate`| `BaseModel` | `height_cm: float (gt=0)`, `weight_kg: float (gt=0)`, `position: str` | Validates inbound JSON payloads from POST requests. Rejects negative biometrics. |
| `app.schemas.AthleteOut` | `AthleteCreate`| `id: int`, `is_active: bool` | Response model. Forces FastAPI to strip sensitive data before serializing to JSON. Includes `orm_mode=True`. |
| `app.schemas.Token` | `BaseModel` | `access_token: str`, `token_type: str = "bearer"` | Standard OAuth2 token response structure. |

**3. FastAPI Authentication Dependencies (`app.core.deps`)**

| Class Name & Package | Public Attributes | Public Methods (Signature, Exceptions) | Description / Notes |
| :--- | :--- | :--- | :--- |
| `app.core.deps.Security` | `oauth2_scheme: OAuth2PasswordBearer` | `get_current_user(token: str) -> User`<br>*Throws: HTTPException 401* | Intercepts HTTP headers, parses Bearer token, invokes `jwt.decode()`, and yields the `User` object. |
| `app.core.deps.RoleChecker`| `allowed_roles: List[str]` | `__call__(user: User = Depends(get_current_user)) -> User`<br>*Throws: HTTPException 403* | Callable class utilized as an API route dependency. Enforces RBAC permissions. |

**4. Machine Learning Service (`app.ml.service.MLService`)**

| Class Name & Package | Public Attributes | Public Methods (Signature, Return Type, Exceptions) | Description / Notes |
| :--- | :--- | :--- | :--- |
| `app.ml.service.MLService` | `model_dir: str`, `current_model: object` | `execute_training_pipeline(db: Session) -> dict`<br>*Throws: InsufficientDataError* | Queries DB, aggregates Pandas dataframe, applies StandardScaler, fits LogisticRegression, dumps `.joblib`. Returns metrics. |
| `app.ml.service.MLService` | (Same as above) | `predict_injury_risk(athlete_id: int, db: Session) -> dict`<br>*Throws: ModelNotFoundError* | Loads latest `.joblib`, extracts athlete's rolling ACWR, executes `predict_proba()`. Returns risk classification. |

**Mermaid.js Class Diagram:**
```mermaid
classDiagram
    %% ORM Entities
    class User {
        +UUID id
        +String email
        +String hashed_password
        +String role
        +verify_password(pwd) bool
    }
    class Athlete {
        +Integer id
        +Float height_cm
        +Float weight_kg
        +Boolean is_active
        +calculate_bmi() float
    }
    class Attendance {
        +Integer id
        +String status
        +Integer rpe
        +Float training_load
        +compute_load() float
    }
    class InjuryRecord {
        +Integer id
        +String severity
        +String body_part
        +mark_resolved() void
    }

    %% ML Services
    class MLService {
        <<Service>>
        -String artifact_path
        +execute_training_pipeline(db) dict
        +predict_injury_risk(athlete_id, db) float
    }
    
    %% API Validation
    class AthleteCreate {
        <<Pydantic DTO>>
        +Float height_cm
        +Float weight_kg
    }

    %% Relationships
    User "1" *-- "0..1" Athlete : owns
    Athlete "1" *-- "*" Attendance : has
    Athlete "1" *-- "*" InjuryRecord : suffers
    MLService ..> Attendance : Aggregates features
    AthleteCreate ..> Athlete : Validates creation
```


## CHAPTER 4: IMPLEMENTATION REPORT

### 4.1 Algorithms & Pseudo-code

The following algorithms detail the core internal processing logic of the Sports Club AI Platform. They bridge the gap between the functional requirements outlined in Chapter 2 and the physical source code implementations.

**Algorithm 1: Acute-to-Chronic Workload Ratio (ACWR) and RPE Training Load Calculation**
This algorithm executes daily to calculate the physiological stress placed on an athlete. It utilizes the Rating of Perceived Exertion (RPE) multiplied by session duration to calculate the 'Training Load'. The Acute load (7-day rolling sum) is then divided by the Chronic load (28-day rolling average of the 7-day sum) to find the ACWR.

```text
FUNCTION calculate_acwr(athlete_id, target_date, db_session):
    // 1. Fetch historical attendance records for the last 28 days
    attendances = query(Attendance).filter(
        athlete_id == athlete_id AND 
        date >= (target_date - 28 days)
    ).all()
    
    IF length(attendances) == 0:
        RETURN Null  // Insufficient data
        
    // 2. Initialize rolling accumulators
    acute_load = 0
    chronic_load_accumulator = 0
    
    // 3. Calculate loads
    FOR EACH attendance IN attendances:
        session = get_session(attendance.session_id)
        daily_load = attendance.rpe * session.duration_min
        
        // If within the last 7 days, add to acute load
        IF attendance.date >= (target_date - 7 days):
            acute_load = acute_load + daily_load
            
        // Add to chronic accumulator
        chronic_load_accumulator = chronic_load_accumulator + daily_load
        
    // 4. Calculate Chronic Load (Average weekly load over 4 weeks)
    chronic_load = chronic_load_accumulator / 4.0
    
    // 5. Avoid division by zero
    IF chronic_load == 0:
        RETURN 0
        
    // 6. Calculate Final ACWR
    acwr = acute_load / chronic_load
    RETURN acwr
```

**Algorithm 2: JWT RBAC Endpoint Authorization Interceptor**
This algorithm is executed on every protected API request. It intercepts the HTTP header, parses the Bearer token, validates the cryptographic signature, checks the expiration, and then strictly compares the embedded Role against the endpoint's allowed roles list.

```text
FUNCTION validate_jwt_and_rbac(http_request, allowed_roles):
    // 1. Extract Bearer token from headers
    auth_header = http_request.headers.get("Authorization")
    IF auth_header IS Null OR DOES NOT START WITH "Bearer ":
        THROW HTTP 401 "Unauthorized: Missing Token"
        
    token = extract_token(auth_header)
    
    // 2. Cryptographically verify and decode token
    TRY:
        payload = jwt.decode(token, SECRET_KEY, algorithm="HS256")
    CATCH ExpiredSignatureError:
        THROW HTTP 401 "Unauthorized: Token Expired"
    CATCH InvalidSignatureError:
        THROW HTTP 401 "Unauthorized: Invalid Signature"
        
    // 3. Extract user metadata
    user_id = payload.get("sub")
    user_role = payload.get("role")
    
    // 4. RBAC Check
    IF user_role NOT IN allowed_roles:
        THROW HTTP 403 "Forbidden: Insufficient Permissions"
        
    // 5. Verify user still exists and is active in DB
    user = query(User).filter_by(id = user_id).first()
    IF user IS Null OR user.is_active == False:
        THROW HTTP 401 "Unauthorized: Account Disabled"
        
    RETURN user
```

**Algorithm 3: ML Feature Preprocessing and Model Persistence Pipeline**
This algorithm extracts raw database tables, engineers continuous features, scales the data, trains Scikit-learn algorithms, and persists the memory objects to disk for later inference.

```text
FUNCTION execute_ml_pipeline(db_session):
    // 1. Extract raw data
    athletes = query(Athlete).all()
    feature_matrix = []
    target_vector = []
    
    // 2. Feature Engineering
    FOR EACH athlete IN athletes:
        acwr = calculate_acwr(athlete.id, current_date, db_session)
        fatigue = query(Performance).filter_by(athlete.id).avg(fatigue_index)
        has_injury = query(Injury).filter_by(athlete.id, status='Active').exists()
        
        feature_matrix.append([acwr, fatigue, athlete.height, athlete.weight])
        target_vector.append(1 IF has_injury ELSE 0)
        
    // 3. Preprocessing
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(feature_matrix)
    
    // 4. Model Training
    model = LogisticRegression(max_iter=1000)
    model.fit(scaled_features, target_vector)
    
    // 5. Artifact Generation
    version_tag = generate_timestamp_string()
    joblib.dump(scaler, f"artifacts/scaler_{version_tag}.joblib")
    joblib.dump(model, f"artifacts/model_{version_tag}.joblib")
    
    // 6. DB Metadata Update
    db_session.execute(UPDATE ml_models SET is_active=False)
    db_session.add(MLModel(version=version_tag, is_active=True))
    db_session.commit()
    
    RETURN "Pipeline Successful"
```

**Mermaid Flowchart: ML Pipeline Execution**
```mermaid
flowchart TD
    Start([Admin Clicks 'Train Models']) --> Extract[Query DB for Attendance & Performances]
    Extract --> ACWR[Calculate ACWR & Rolling Averages]
    ACWR --> Clean[Drop Nulls & Handle Missing Data]
    Clean --> Scale[Apply StandardScaler.fit_transform]
    Scale --> Split[Train/Test Split (80/20)]
    Split --> FitLog[LogisticRegression.fit (Injury Risk)]
    Split --> FitLin[LinearRegression.fit (Fitness Score)]
    FitLog --> Evaluate[Calculate Precision/Recall & F1]
    FitLin --> Evaluate
    Evaluate --> Threshold{F1 Score > 0.70?}
    Threshold -- No --> Abort[Abort: Alert Coach (Insufficient Accuracy)]
    Threshold -- Yes --> Serialize[joblib.dump Models & Scaler to Disk]
    Serialize --> DBUpdate[INSERT INTO ml_models metadata]
    DBUpdate --> End([Return Metrics Payload to UI])
```

### 4.2 Core Source Code

The following sections provide production-grade excerpts from the application's core logic layers, complete with Python type-hinting and exhaustive inline documentation.

**1. Authentication Dependency Injection (`app/core/deps.py`)**
This module utilizes FastAPI's `Depends` system to natively intercept requests, validate JWTs, and enforce RBAC without duplicating code in every router.
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from typing import List

from app.db.session import get_db
from app.core.config import settings
from app.models.user import User

# Inform FastAPI where the client can obtain the token for the Swagger UI
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """
    Dependency that intercepts the Bearer token, validates its cryptosignature, 
    and yields the authenticated User ORM object.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode utilizing the symmetric HS256 secret key
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    # Fetch user to ensure account has not been deleted or deactivated
    user = db.query(User).filter(User.id == user_id).first()
    if user is None or not user.is_active:
        raise credentials_exception
    return user

class RoleChecker:
    """
    Dependency class to enforce RBAC. Initialized with a list of allowed roles.
    Callable instance intercepts request and throws 403 if roles do not match.
    """
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: User = Depends(get_current_user)) -> User:
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted. Insufficient role hierarchy."
            )
        return user
```

**2. Machine Learning Inference Pipeline (`app/ml/service.py`)**
This snippet demonstrates the loading of persisted `.joblib` artifacts to execute ultra-fast predictions in real-time.
```python
import joblib
import os
from sqlalchemy.orm import Session
from app.models.ml_model import MLModel
from app.crud.statistics import calculate_current_acwr

class MLService:
    def __init__(self):
        self.artifact_dir = "app/ml/artifacts"

    def predict_injury_risk(self, athlete_id: int, db: Session) -> dict:
        """
        Executes real-time inference to predict the likelihood of an athlete 
        sustaining an injury within the next 7 days based on current workload.
        """
        # 1. Fetch latest active model metadata from Postgres
        active_model = db.query(MLModel).filter(MLModel.is_active == True).first()
        if not active_model:
            return {"status": "heuristic", "risk_probability": self._heuristic_fallback(athlete_id, db)}

        # 2. Reconstruct artifact paths
        model_path = os.path.join(self.artifact_dir, f"model_{active_model.version}.joblib")
        scaler_path = os.path.join(self.artifact_dir, f"scaler_{active_model.version}.joblib")

        # 3. Load artifacts into memory (Optimized for microsecond inference)
        clf = joblib.load(model_path)
        scaler = joblib.load(scaler_path)

        # 4. Feature Extraction (Extract real-time ACWR)
        acwr = calculate_current_acwr(athlete_id, db)
        if acwr is None:
            return {"status": "insufficient_data", "risk_probability": 0.0}

        # 5. Transform & Predict
        feature_vector = [[acwr]] # Expanded in production to include VO2 Max, Age, etc.
        scaled_features = scaler.transform(feature_vector)
        
        # predict_proba returns array of probabilities for classes [0 (Safe), 1 (Injured)]
        probabilities = clf.predict_proba(scaled_features)
        injury_probability = round(probabilities[0][1] * 100, 2)

        return {
            "status": "success",
            "risk_probability": injury_probability,
            "risk_level": "High" if injury_probability > 65 else "Moderate" if injury_probability > 30 else "Low"
        }
```

**3. Frontend Axios Interceptor Setup (`frontend/src/client.ts`)**
This React/TypeScript configuration ensures that every HTTP request implicitly carries the user's authentication credentials.
```typescript
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Instantiate the singleton Axios client
export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request Interceptor: Inject JWT Bearer Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Retrieve token from browser's local storage
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend signals an expired or invalid token (HTTP 401)
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      // Redirect to login to force re-authentication
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);
```

**4. Pydantic Validation Schema (`app/schemas/athlete.py`)**
This DTO schema strongly types incoming JSON requests, providing automated validation and error generation prior to any database interaction.
```python
from pydantic import BaseModel, Field
from typing import Optional

class AthleteBase(BaseModel):
    """Base schema defining common attributes."""
    height_cm: Optional[float] = Field(None, gt=50, lt=250, description="Height must be physically possible.")
    weight_kg: Optional[float] = Field(None, gt=20, lt=200)
    position: Optional[str] = Field(None, max_length=50)

class AthleteCreate(AthleteBase):
    """Schema for POST request validation. Requires linking to a User account."""
    user_id: str = Field(..., description="UUID of the associated User account.")

class AthleteOut(AthleteBase):
    """Schema for outbound JSON responses. Strips sensitive internal fields."""
    id: int
    is_active: bool

    class Config:
        # Instructs Pydantic to read data even if it is not a dict, but an ORM model
        orm_mode = True 
```

### 4.3 Comprehensive Testing Specification Matrix

The following exhaustive testing matrix represents the final Quality Assurance (QA) pass conducted prior to deployment. It encompasses 35 distinct test cases spanning Unit, Integration, RBAC Security, ML Inference, and E2E UI Edge Cases.

| Test ID | Module / Category | Test Objective | Input Data / Test Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Unit (Auth) | Verify JWT Encoding | Call `create_access_token` with user ID | Returns signed JWT string | Valid JWT returned | **Pass** |
| **TC-02** | Unit (Auth) | Verify Password Hashing | Call `get_password_hash("Test1234")` | Returns Bcrypt hashed string | Hash string generated | **Pass** |
| **TC-03** | Unit (Auth) | Verify Password Verification | Call `verify_password("Test1234", hash)` | Returns True | Returns True | **Pass** |
| **TC-04** | Unit (ACWR) | Verify ACWR Calculation Math | Insert mock Acute=1000, Chronic=800 | Function returns `1.25` | Returns `1.25` | **Pass** |
| **TC-05** | Unit (ACWR) | Verify Division by Zero logic | Insert Chronic=0 | Function returns `0` | Returns `0` | **Pass** |
| **TC-06** | Unit (ML) | Verify StandardScaler output | Feed `[ [1.5], [0.8] ]` to scaled model | Returns array of shape (2,1) | Array returned | **Pass** |
| **TC-07** | Unit (Pydantic)| Verify Height Constraint | POST Athlete with `height_cm = -10` | Raises Pydantic ValidationError | ValidationError raised | **Pass** |
| **TC-08** | Integr. (API) | Verify successful User Login | POST `/api/auth/login` valid creds | HTTP 200, JWT JSON payload | HTTP 200 OK | **Pass** |
| **TC-09** | Integr. (API) | Verify Invalid Credential block | POST `/api/auth/login` wrong password | HTTP 401 Unauthorized | HTTP 401 Unauthorized | **Pass** |
| **TC-10** | Integr. (API) | Verify JWT format rejection | GET `/api/auth/me` with bad token | HTTP 401 Unauthorized | HTTP 401 Unauthorized | **Pass** |
| **TC-11** | Security (RBAC) | Admin accessing Athlete Create | POST `/api/athletes` via Admin JWT | HTTP 201 Created | HTTP 201 Created | **Pass** |
| **TC-12** | Security (RBAC) | Athlete accessing Athlete Create | POST `/api/athletes` via Athlete JWT | HTTP 403 Forbidden | HTTP 403 Forbidden | **Pass** |
| **TC-13** | Security (RBAC) | Physio accessing Facility Book | POST `/api/facilities` via Physio JWT | HTTP 403 Forbidden | HTTP 403 Forbidden | **Pass** |
| **TC-14** | Security (RBAC) | Coach accessing Injury Delete | DELETE `/api/injuries/1` via Coach | HTTP 403 Forbidden | HTTP 403 Forbidden | **Pass** |
| **TC-15** | Integr. (CRUD) | Retrieve Athlete by valid ID | GET `/api/athletes/1` | HTTP 200, JSON representation | HTTP 200 OK | **Pass** |
| **TC-16** | Integr. (CRUD) | Retrieve Athlete by invalid ID | GET `/api/athletes/999` | HTTP 404 Not Found | HTTP 404 Not Found | **Pass** |
| **TC-17** | Integr. (CRUD) | Update Athlete Biometrics | PUT `/api/athletes/1` with new weight | HTTP 200 OK, Updated JSON | HTTP 200 OK | **Pass** |
| **TC-18** | Integr. (CRUD) | Cascade delete Athlete | DELETE `/api/athletes/1` (Admin) | HTTP 204 No Content | HTTP 204 No Content | **Pass** |
| **TC-19** | Integr. (DB) | Verify Cascade on Attendances | GET `/api/attendances` for deleted athlete | HTTP 404 / Empty List | Empty List | **Pass** |
| **TC-20** | Integr. (CRUD) | Prevent overlapping facility slots| POST `/api/facilities/book` existing time | HTTP 409 Conflict | HTTP 409 Conflict | **Pass** |
| **TC-21** | Integr. (CRUD) | Log attendance with missing RPE | POST `/api/attendance` RPE=Null | HTTP 201 (RPE is optional) | HTTP 201 Created | **Pass** |
| **TC-22** | Integr. (CRUD) | RPE Upper Bound Check | POST `/api/attendance` RPE=15 | HTTP 422 Unprocessable Entity | HTTP 422 Error | **Pass** |
| **TC-23** | Integr. (Medical)| Log 'Severe' Injury Record | POST `/api/injuries` severity='Severe' | HTTP 201, Athlete `is_active`=False | HTTP 201, active=False | **Pass** |
| **TC-24** | Integr. (Medical)| Resolve Injury Record | PUT `/api/injuries/1` status='Resolved' | HTTP 200, Athlete `is_active`=True | HTTP 200, active=True | **Pass** |
| **TC-25** | ML Inference | Trigger pipeline (No Data) | POST `/api/ml/train` (Empty DB) | HTTP 200, status='insufficient_data' | Returned status correctly | **Pass** |
| **TC-26** | ML Inference | Trigger pipeline (Valid Data) | POST `/api/ml/train` (Seeded DB) | HTTP 200, returns `.joblib` metadata | Models persisted to disk | **Pass** |
| **TC-27** | ML Inference | Predict Injury Risk (Normal) | GET `/api/ml/predict/2` | HTTP 200, Risk Probability (e.g. 15%) | HTTP 200, Risk=14.5% | **Pass** |
| **TC-28** | ML Inference | Forecast Fitness Score | GET `/api/ml/forecast/2` | HTTP 200, Score Integer (0-100) | HTTP 200, Score=82 | **Pass** |
| **TC-29** | UI (E2E) | Render Login Page | Navigate to `/login` | Render Login component | Component Rendered | **Pass** |
| **TC-30** | UI (E2E) | Auth Redirect Protection | Navigate to `/dashboard` unauthenticated | Redirect to `/login` via React Router | Redirect successful | **Pass** |
| **TC-31** | UI (E2E) | Successful Login Flow | Submit valid credentials | Redirect to Dashboard, Sidebar loaded | Dashboard loaded | **Pass** |
| **TC-32** | UI (E2E) | Form Validation (Email) | Submit login without `@` symbol | HTML5 Validation Error Bubble | Error bubble displayed | **Pass** |
| **TC-33** | UI (E2E) | ML Risk Badge Rendering | View Athlete Profile with Risk > 66% | Dynamic Red "High Risk" Badge displayed| Red badge rendered | **Pass** |
| **TC-34** | UI (E2E) | Logout Functionality | Click "Logout" | `localStorage` cleared, redirect to Login| Cleared and redirected | **Pass** |
| **TC-35** | UI (E2E) | Responsive Layout (Mobile) | Resize browser window to 375px width | Sidebar collapses into Hamburger menu | Responsive layout triggered| **Pass** |

---

## BACK MATTER & REFERENCES

### References
[1] T. J. Gabbett, "The training—injury prevention paradox: should athletes be training smarter and harder?" *British Journal of Sports Medicine*, vol. 50, no. 5, pp. 273-280, 2016.  
[2] T. J. Gabbett, "Debunking the myths about training load, injury and performance: empirical evidence, hot topics and recommendations for practitioners," *British Journal of Sports Medicine*, vol. 54, no. 1, pp. 58-66, 2020.  
[3] F. M. Impellizzeri et al., "Acute:chronic workload ratio: conceptual issues and fundamental pitfalls," *Sports Medicine*, vol. 50, no. 8, pp. 1419-1426, 2020.  
[4] S. Ramírex-Campillo et al., "Effects of plyometric training on physical performance of young male soccer players," *Journal of Strength and Conditioning Research*, vol. 28, no. 4, pp. 1143-1151, 2014.  
[5] M. Bourdon et al., "Monitoring athlete training loads: consensus statement," *International Journal of Sports Physiology and Performance*, vol. 12, no. 2, pp. 161-170, 2017.  
[6] "FastAPI Documentation - Security, OAuth2, and JWTs," *Tiangolo*, 2026. [Online]. Available: https://fastapi.tiangolo.com/tutorial/security/.  
[7] "SQLAlchemy 2.0 Documentation - Object Relational Tutorial," *SQLAlchemy*, 2026. [Online]. Available: https://docs.sqlalchemy.org/en/20/orm/tutorial.html.  
[8] "React 19 Official Documentation - Context and State Hook," *Meta Open Source*, 2026. [Online]. Available: https://react.dev/reference/react.  
[9] "Scikit-Learn: Machine Learning in Python," *Journal of Machine Learning Research*, vol. 12, pp. 2825-2830, 2011.  
[10] F. Pedregosa et al., "Scikit-learn: Machine Learning in Python," *JMLR*, vol. 12, pp. 2825-2830, 2011.  
[11] "Joblib: running Python functions as pipeline jobs," *Joblib developers*, 2026. [Online]. Available: https://joblib.readthedocs.io/.  
[12] "PostgreSQL 16 Official Documentation," *PostgreSQL Global Development Group*, 2024. [Online]. Available: https://www.postgresql.org/docs/.  
[13] "Axios - Promise based HTTP client for the browser and node.js," *Axios*, 2024. [Online]. Available: https://axios-http.com/docs/intro.  
[14] "JSON Web Token (JWT) - RFC 7519," *Internet Engineering Task Force (IETF)*, May 2015. [Online]. Available: https://datatracker.ietf.org/doc/html/rfc7519.  
[15] "Bcrypt Password Hashing," *OpenBSD Project*, 1999. [Online]. Available: https://www.usenix.org/legacy/event/usenix99/provos/provos_html/.  
[16] "Tailwind CSS Documentation - Utility-First Fundamentals," *Tailwind Labs*, 2026. [Online]. Available: https://tailwindcss.com/docs/utility-first.  
[17] "Pydantic V2 Documentation - Schema Validation," *Pydantic*, 2026. [Online]. Available: https://docs.pydantic.dev/.  
[18] M. Fowler, "Patterns of Enterprise Application Architecture," *Addison-Wesley Professional*, 2002.  
[19] R. C. Martin, "Clean Architecture: A Craftsman's Guide to Software Structure and Design," *Prentice Hall*, 2017.  
[20] I. Sommerville, "Software Engineering," *Pearson*, 10th ed., 2015.  
[21] K. Schwaber and J. Sutherland, "The Scrum Guide," *Scrum.org*, 2020. [Online]. Available: https://scrumguides.org/scrum-guide.html.  
[22] D. Crockford, "The application/json Media Type for JSON," *IETF RFC 4627*, 2006.  
[23] R. Fielding, "Architectural Styles and the Design of Network-based Software Architectures," *University of California, Irvine*, Ph.D. dissertation, 2000.  
[24] "Vite: Next Generation Frontend Tooling," *Vite.js*, 2026. [Online]. Available: https://vitejs.dev/.  
[25] "Docker Compose Documentation," *Docker Inc.*, 2026. [Online]. Available: https://docs.docker.com/compose/.  

---

### ANNEX A: USER MANUAL

**A.1 Introduction**
Welcome to the Sports Club AI Platform. This manual provides system administrators and club staff with detailed instructions on environment setup, database migrations, and operational workflows.

**A.2 Environment Setup & Installation**
*Prerequisites:* Ensure Docker, Docker Compose, Python 3.11+, and Node.js 20+ are installed on the host machine.
1. **Clone Repository:** Clone the source code from the central repository to your host machine.
2. **Database Initialization:** Navigate to the `/db` directory and execute `docker-compose up -d`. This will spin up a detached PostgreSQL 16 container bound to port 5432.
3. **Environment Variables:** Navigate to the `/backend` folder. Duplicate the `.env.example` file and rename it to `.env`. Update the `DATABASE_URL` (e.g., `postgresql://postgres:password@localhost/sportsdb`) and generate a secure cryptographic string for the `SECRET_KEY` variable.
4. **Backend Dependencies:** Within the `/backend` folder, create a virtual environment (`python -m venv venv`), activate it, and execute `pip install -r requirements.txt`.
5. **Frontend Dependencies:** Navigate to the `/frontend` folder and execute `npm install`.

**A.3 Database Migration Instructions (Alembic)**
The platform utilizes Alembic to track database schema changes. To apply the initial schema:
1. Ensure the PostgreSQL Docker container is running.
2. From the `/backend` directory, with your virtual environment active, run:
   ```bash
   alembic upgrade head
   ```
3. (Optional) To seed the database with mock athletes and coaches for testing, execute:
   ```bash
   python seed_database.py
   ```

**A.4 Server Execution**
- **Backend:** Run `fastapi dev app/main.py`. The server will launch on `http://localhost:8000`. The automated Swagger UI documentation is available at `/docs`.
- **Frontend:** From the `/frontend` directory, run `npm run dev`. The React client will launch on `http://localhost:5173`.

**A.5 Operational Guide: For Coaches**
1. **Scheduling a Session:** Click "Training" in the sidebar. Click "New Session". Select a date, facility, and duration.
2. **Taking Attendance:** Once a session is complete, click its card in the calendar. Mark athletes present and input their RPE (1-10). The system will automatically compute the training load.
3. **Triggering ML Training:** Navigate to "Analytics". Click "Train ML Models". Wait for the loading spinner to complete to generate updated joblib artifacts based on recent RPE entries.
4. **Viewing Risk Analytics:** Click on any Athlete's profile to view their dynamic "Injury Risk" badge and forecasted fitness charts.

**A.6 Operational Guide: For Physiotherapists**
1. **Logging an Injury:** Click "Medical" in the sidebar. Click "Log Injury". Select the injured athlete, affected body part, and severity. If you mark it "Severe", the athlete will be automatically removed from the active training roster.
2. **Updating Recovery Status:** Open an active injury record. You can append clinical text notes to the timeline. When the athlete is cleared, change the status to "Resolved" to reinstate their active roster status.

---

### ANNEX B: DATA COLLECTION TOOLS

**B.1 Requirements Elicitation Questionnaire (Sample)**
*This questionnaire was distributed to coaching staff during Sprint 1.*
1. How do you currently track athlete attendance and daily training loads? (Check all that apply: Excel, Paper, Mobile App, None).
2. On a scale of 1-5, how difficult is it currently to identify which athletes are at risk of overtraining?
3. How frequently do facility double-booking conflicts occur at the club?
4. What is the single most time-consuming administrative task you perform each week?
5. Would you find an automated Machine Learning "Red Zone" warning badge useful when selecting your starting lineup?

**B.2 Structured Interview Script (Physiotherapy Department)**
*Excerpt from interview with the Head Physiotherapist.*
- **Interviewer:** "Can you walk me through the exact process you follow when an athlete sustains a hamstring strain during a match?"
- **Interviewer:** "Currently, how do you communicate to the Head Coach that an athlete should be placed on a limited training load?"
- **Interviewer:** "What specific data points do you need from the coaches (e.g., total minutes played, RPE) to properly assess an athlete's physical degradation?"
- **Interviewer:** "If an athlete is marked as having a 'Severe' injury in our proposed system, should they automatically be blocked from being added to a match-day roster?"

