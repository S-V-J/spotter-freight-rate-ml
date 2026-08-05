# Spotter Universal ML Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat-square)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square)](https://www.docker.com/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-Support%20this%20project-eb4aaa?style=flat-square&logo=github)](https://github.com/sponsors/S-V-J)

> **Bring Your Own Data. Build Your Own Future.**  
> A production-ready, domain-agnostic Machine Learning Workbench designed to orchestrate the entire ML lifecycle. From intelligent data validation to one-click model training and real-time insights, Spotter handles the pipeline seamlessly.

---

## 📚 Documentation

This repository contains comprehensive documentation to help you understand, deploy, and maintain the platform:
- **[README.md](README.md)**: Project overview, core capabilities, and quick start guide *(You are here)*.
- **[INTRODUCTION.md](INTRODUCTION.md)**: Executive summary, the problem we solve, and the Spotter solution philosophy.
- **[INSTALL.md](INSTALL.md)**: Comprehensive deployment, local development, maintenance, and troubleshooting guide for system administrators.

---

## Core Capabilities

- **Smart File Manager**: Modern drag-and-drop uploads paired with an inline Data Inspector that automatically parses CSV/JSON/Excel files, detects missing values, and recommends the correct pipeline step based on schema analysis.
- **Anti-Bottleneck Pipeline Wizard**: Replaces confusing multi-dropdown forms with an intuitive, locked-step visual stepper that validates file schemas in real-time before execution, preventing configuration errors.
- **Dynamic Model Insights**: Automatically parses training outputs to display real-time performance metrics (MAE, RMSE, MAPE) and interactive LightGBM feature importance charts via Recharts.
- **Results & Deliverables**: One-click generation and download of validation predictions (CSV) and route forecasting charts (PNG), complete with official scorer validation logs.
- **Enterprise Security**: Path-traversal protection, robust file validation, and role-based access control for system configurations.

---

## 🏗️ Project Structure

```text
spotter-webapp/
├── backend/                 # FastAPI application, ML logic, and Dockerfile
│   ├── app/                 # Core application logic (routers, models, schemas, core)
│   └── requirements.txt     # Python dependencies
├── frontend/                # Next.js 16 application and Dockerfile
│   └── src/                 # React components, pages, contexts, and API clients
├── docker-compose.yml       # Orchestrates backend and frontend services
├── Makefile                 # Centralized command runner for dev, ops, and ML pipelines
├── INSTALL.md               # Comprehensive deployment and maintenance guide
├── INTRODUCTION.md          # Executive summary, problem statement, and solution overview
├── README.md                # Project overview, features, and quick start
└── LICENSE                  # MIT License
```

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 18, Tailwind CSS, Lucide Icons, Recharts |
| **Backend** | Python 3.11, FastAPI, Pydantic, Uvicorn, Pandas, Scikit-Learn, LightGBM |
| **Infrastructure** | Docker, Docker Compose, systemd (Dynamic Port Allocation), Make |
| **Persistence** | Local Docker Volumes (Ensures data survival across container restarts) |

---

## 🚀 Quick Start

The most reliable way to run the entire platform is via Docker Compose and the provided `Makefile`. This handles both the FastAPI backend and the Next.js frontend in isolated, optimized containers.

### 1. Clone the Repository
```bash
git clone https://github.com/S-V-J/spotter-freight-rate-ml.git
cd spotter-freight-rate-ml/spotter-webapp
```

### 2. Start the Application
We provide a `Makefile` to simplify Docker operations. Run:
```bash
make start
```
*(Alternatively, you can run `sudo docker compose up -d --build` directly).*

### 3. Access the Platform
- **Frontend UI**: Open your browser and navigate to `http://localhost:3005` (or the port specified in `frontend-url.txt`)
- **Backend API Docs**: Navigate to `http://localhost:8001/docs`

### 4. Default Credentials
- **Email**: `admin@spotter.com`
- **Password**: `admin123` *(Please change this immediately in Account Settings)*

---

## 💻 Local Development

If you prefer to run the services natively for active development and hot-reloading, the `Makefile` has you covered:

### 1. Install Dependencies
```bash
make setup
```
*(This creates a Python virtual environment in `backend/` and runs `npm install` in `frontend/`)*

### 2. Start the Backend
Open a terminal and run:
```bash
make dev-backend
```
*(Runs on `http://127.0.0.1:8001`)*

### 3. Start the Frontend
Open a **second** terminal and run:
```bash
make dev-frontend
```
*(The custom startup script will automatically find an available port, typically `3003` or `3000`)*

---

## 🧠 Running the ML Pipeline

The platform includes built-in commands to execute the machine learning workflow directly inside the backend container:

### 1. Train the Model
Generates predictions, saves model artifacts, and updates the December chart inputs:
```bash
make train
```

### 2. Run the Official Scorer
Validates the generated predictions against the December chart inputs and generates the final chart:
```bash
make score
```

*Note: You can also trigger both of these workflows directly from the Frontend UI via the Dashboard.*

---

## 💙 Support & Donations

This platform was engineered with a focus on robustness, security, and intuitive user experience. If you find this project useful for your own workflows, learning, or as a template for your applications, please consider supporting my work.

<div align="center">

### 🟣 GitHub Sponsors (Recommended)
[![Sponsor S-V-J](https://img.shields.io/badge/Sponsor%20on%20GitHub-Support%20this%20project-eb4aaa?style=for-the-badge&logo=github)](https://github.com/sponsors/S-V-J)

*Your support directly funds:*
- *Cloud credits for VoIP lab servers and GPU resources for AI model training.*
- *Production quality for the "Zero to Hero" open-source course.*
- *Keeping all code, tutorials, and guides 100% free and MIT-licensed.*

</div>

*Even a small contribution (e.g., $2) or a ⭐ star on this repository is highly appreciated. Thank you for believing in practical, open-source engineering!*

---

## Author

**Siddhant Kumar**  
*Full-Stack Developer | VoIP & Telephony Engineer | AI Developer*  
- **Location**: Bihar, India (Open to Global Remote Roles)  
- **Email**: [stjl093@gmail.com](mailto:stjl093@gmail.com) | **Phone**: +91 8095875948  
- **LinkedIn**: [linkedin.com/in/sid-093](https://linkedin.com/in/sid-093)  
- **GitHub**: [github.com/S-V-J](https://github.com/S-V-J)  
- **Portfolio**: [localhost:3005/about-dev](http://localhost:3005/about-dev) *(When running locally)*

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.