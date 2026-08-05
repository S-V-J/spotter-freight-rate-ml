.PHONY: help setup build start stop restart clean prune logs status \
        dev-backend dev-frontend format type-check train score db-shell

.DEFAULT_GOAL := help

# Auto-detect Docker Compose V2, fallback to V1
DOCKER_COMPOSE := $(shell if command -v docker compose > /dev/null; then echo "docker compose"; else echo "docker-compose"; fi)
PYTHON := python3
PIP := pip3

##@ 🚀 Application Lifecycle (Docker)

help: ## Display this help screen
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

build: ## Build or rebuild all Docker containers
	@echo "🔨 Building Docker containers..."
	$(DOCKER_COMPOSE) build --no-cache

start: ## Start the application in detached mode
	@echo "🚀 Starting Spotter Universal ML Platform..."
	$(DOCKER_COMPOSE) up -d
	@echo "✅ Frontend UI: http://localhost:3005 (or check frontend-url.txt)"
	@echo "✅ Backend API:  http://localhost:8001/docs"

stop: ## Stop all running containers
	@echo "🛑 Stopping application..."
	$(DOCKER_COMPOSE) stop

restart: ## Restart all containers (applies code/config changes)
	@echo "🔄 Restarting application..."
	$(DOCKER_COMPOSE) restart

clean: ## Stop and remove all containers, networks, and volumes (WARNING: Deletes DB and uploads!)
	@echo "⚠️  Cleaning up Docker environment..."
	$(DOCKER_COMPOSE) down -v --remove-orphans

prune: ## Remove unused Docker data (images, networks, dangling volumes)
	@echo "🧹 Pruning unused Docker resources..."
	docker system prune -f
	docker volume prune -f

logs: ## Follow live logs of all services
	$(DOCKER_COMPOSE) logs -f

logs-backend: ## Follow live logs of the backend only
	$(DOCKER_COMPOSE) logs -f backend

logs-frontend: ## Follow live logs of the frontend only
	$(DOCKER_COMPOSE) logs -f frontend

status: ## Show the current status of all Docker containers
	$(DOCKER_COMPOSE) ps

##@ 💻 Local Development (No Docker)

dev-backend: ## Start the FastAPI backend locally with hot-reload
	@echo "🐍 Starting local backend on http://127.0.0.1:8001..."
	cd backend && $(PYTHON) -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8001

dev-frontend: ## Start the Next.js frontend locally with hot-reload
	@echo "⚛️  Starting local frontend..."
	cd frontend && npm run dev

setup: ## Install local Python and Node.js dependencies
	@echo "📦 Installing dependencies..."
	cd backend && $(PYTHON) -m venv .venv && . .venv/bin/activate && $(PIP) install --upgrade pip && $(PIP) install -r requirements.txt
	cd frontend && npm install

##@ 🛠️ Code Quality & Maintenance

format: ## Format backend (Black/isort) and frontend (Prettier) code
	@echo "🎨 Formatting code..."
	cd backend && . .venv/bin/activate && python -m isort . && python -m black . || true
	cd frontend && npx prettier --write "src/**/*.{ts,tsx,js,jsx,json,css}" || true

type-check: ## Run TypeScript type checking on frontend
	@echo "🔍 Running TypeScript type check..."
	cd frontend && npx tsc --noEmit

##@ 🧠 ML Pipeline (Dockerized Execution)

train: ## Run the ML training pipeline inside the backend container
	@echo "🧠 Running ML training pipeline in Docker..."
	$(DOCKER_COMPOSE) exec backend $(PYTHON) src/train_predict.py

score: ## Run the official Spotter scorer inside the backend container
	@echo "🎯 Running official scorer in Docker..."
	$(DOCKER_COMPOSE) exec backend $(PYTHON) score.py --predictions validation_predictions.csv --december-predictions data/december_chart_inputs.csv

##@ 🗄️ Database Utilities

db-shell: ## Open a Python shell to inspect the database (inside backend container)
	@echo "🐚 Opening database shell..."
	$(DOCKER_COMPOSE) exec backend $(PYTHON) -c "from app.core.database import SessionLocal; from app.models.user import User; db = SessionLocal(); print('Users:', db.query(User.email, User.is_superuser).all()); db.close()"
