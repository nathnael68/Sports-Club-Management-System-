# ⚽ Sports Club AI

<div align="center">

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB.svg?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0+-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.5+-F7931E.svg?style=flat-square&logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**AI-powered sports management platform that predicts athletic injury risks and streamlines club operations.**

</div>

---

## 📌 What is Sports Club AI?

**Sports Club AI** is a web-based athletic management platform that bridges physical training with data science. By analyzing athlete-reported exertion (RPE) and Acute-to-Chronic Workload Ratios (ACWR), the system uses Machine Learning to detect overtraining and forecast soft-tissue injury risk before injuries happen.

---

## 🚀 Core Features

* **🔮 Predictive Injury Analytics**: Real-time ACWR tracking (7-day Acute Load vs. 28-day Chronic Baseline) and ML risk probability ($89.6\%$ accuracy).
* **📈 Interactive Visual Telemetry**: Live Recharts curves displaying athlete workload progression and optimal conditioning sweet spots ($0.8\text{--}1.3$).
* **👥 Role-Based Portals**: Dedicated workspaces for **Admins**, **Coaches**, **Physiotherapists / Staff**, and **Athletes**.
* **🔐 Google SSO & Admin Approval**: Single Sign-On with a verification gate where an admin approves new accounts before granting access.
* **🩺 Medical & 1-Click Return-to-Play**: Injury timeline tracking, clinical severity grading, and 1-click clearance for match selection.
* **⚡ Athlete Self-Service**: Mobile-ready portal to submit post-session RPE ($1\text{--}10$) and track personal fitness scores.
* **📊 1-Click Audit Exports**: Instant CSV streaming for attendance, facilities, memberships, and user directories.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons |
| **Backend** | FastAPI, Python 3.11, Pydantic v2, Uvicorn, OAuth2 Bearer JWT |
| **Database** | SQLite (development) / PostgreSQL 16 (production), SQLAlchemy 2.0, Alembic |
| **Machine Learning**| Scikit-learn (Logistic Regression, Gradient Boosting), Pandas, Joblib |

---

## ⚡ Quick Start

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv .venv

# Activate virtual environment
# Windows: .venv\Scripts\Activate.ps1 | Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt

# Seed database with mock squad and pre-trained ML models
python seed.py

# Start API server (port 8000)
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
* Interactive API Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
* Web Application: [http://localhost:5173](http://localhost:5173)

---

## 🔑 Quick Demo Accounts

Click any demo button on the login screen to autofill:

| Role | Email | Password | Primary Portal |
| :--- | :--- | :--- | :--- |
| 👑 **Admin** | `admin@example.com` | `admin123` | `/dashboard/admin` |
| 🏆 **Coach** | `coach@example.com` | `coach123` | `/dashboard/coach` |
| 🩺 **Physio / Staff** | `physio@example.com` | `physio123` | `/dashboard/staff` |
| ⚡ **Athlete** | `athlete@example.com` | `athlete123` | `/dashboard/athlete` |

---

## 📖 Full Documentation

For the full 1,000+ line technical specification, data dictionary, testing matrix, and deployment guide, see:  
👉 **[Master Project Documentation](docs/FULL_PROJECT_DOCUMENTATION.md)**
