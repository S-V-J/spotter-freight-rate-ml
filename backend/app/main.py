from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.routers import auth, ml, files

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Spotter Freight ML Platform", version="1.0.0")

# Completely permissive CORS for local development to eliminate all browser blocking
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(ml.router)
app.include_router(files.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Spotter Freight ML Platform API"}