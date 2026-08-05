# Spotter Universal ML Platform - Installation & Deployment Guide

This guide provides comprehensive instructions for system administrators and developers to deploy, run, and maintain the Spotter Universal ML Platform.

---

## 📋 Prerequisites

Ensure the following are installed on your host machine (Ubuntu/Debian recommended):
- **Docker Engine** (v20.10+)
- **Docker Compose** (v2.0+)
- **Make** (for simplified command execution)
- **Git**

*Note: If running locally without Docker, you will also need Python 3.11+ and Node.js 20+.*

---

## 🚀 Quick Start (Recommended Docker Deployment)

The fastest and most reliable way to run the platform is via Docker Compose, which handles both the FastAPI backend and Next.js frontend in isolated, optimized containers.

### 1. Clone the Repository
```bash
git clone https://github.com/S-V-J/spotter-freight-rate-ml.git
cd spotter-freight-rate-ml/spotter-webapp
```

### 2. Build and Start the Application
We provide a `Makefile` to simplify Docker operations. Run:
```bash
make start
```
*(Alternatively, you can run `sudo docker compose up -d --build` directly).*

### 3. Verify the Deployment
Check if both services are running smoothly:
```bash
make status
```
*Expected Output: Both `spotter-backend` and `spotter-frontend` should show `Up` under the STATUS column.*

### 4. Access the Platform
- **Frontend UI:** Open your browser and navigate to `http://localhost:3005` *(or the port specified in `frontend-url.txt`)*.
- **Backend API Docs:** Navigate to `http://localhost:8001/docs`.

### 5. Default Admin Credentials
Upon first run, use the following credentials to log in:
- **Email:** `admin@spotter.com`
- **Password:** `admin123`  
  *(⚠️ Please change this immediately in the Account Settings page).*

---

## 💻 Local Development (Without Docker)

If you prefer to run the services natively for active development and hot-reloading:

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

The platform includes built-in commands to execute the machine learning workflow directly inside the backend container.

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

## 🛠️ Maintenance & Troubleshooting

### Updating the Application
To pull the latest changes and rebuild the containers cleanly:
```bash
git pull origin main
make clean      # Removes old containers, networks, and volumes
make start      # Rebuilds and starts fresh
```

### Viewing Logs
To troubleshoot issues, view the live logs:
```bash
make logs           # View all services
make logs-backend   # View backend only
make logs-frontend  # View frontend only
```

### Common Issues
1. **Port Conflicts:** If port `8001` or `3005` is already in use, the frontend startup script will automatically fallback to an available port (e.g., `3003`). Check `cat frontend-url.txt` for the exact URL.
2. **Docker Build Timeouts:** If `pip install` times out during the build, the Dockerfile is already configured with `--default-timeout=1000` to prevent this. If issues persist, run `make clean` to clear the Docker cache before rebuilding.
3. **Permission Denied on Docker:** Ensure your user is added to the `docker` group:  
   `sudo usermod -aG docker $USER` *(then log out and log back in, or run `newgrp docker`)*.

---

## 📂 Project Structure Overview

```text
spotter-webapp/
├── backend/               # FastAPI application, ML logic, and Dockerfile
├── frontend/              # Next.js 16 application and Dockerfile
├── docker-compose.yml     # Orchestrates backend and frontend services
├── Makefile               # Centralized command runner for dev and ops
├── INSTALL.md             # This file
└── README.md              # Project overview and feature list
```

For more details on the architecture, features, and support options, please refer to the [README.md](README.md).