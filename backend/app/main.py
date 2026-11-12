from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.test_db import router as test_router
from app.routes.user_routes import router as user_router
from app.routes.protected_routes import router as protected_router
from app.routes.upload_routes import router as upload_router
from app.routes.cases import router as cases_router
from app.routes.case_routes import router as case_router
from app.routes import blockchain_routes
from app.routes import verification_routes
from app.routes.forensic_routes import router as forensic_router
from app.routes.dashboard_routes import router as dashboard_router
from app.routes.profile_routes import router as profile_router


# ============================================================
# FastAPI Application
# ============================================================

app = FastAPI(
    title="ProofGenesis API",
    version="1.0.0"
)


# ============================================================
# CORS Middleware
# ============================================================
# Allows the React frontend running on Vite (port 5173)
# to communicate with the FastAPI backend.
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# Register All Routers
# ============================================================

# Test / Database routes
app.include_router(test_router)

# Authentication / User routes
app.include_router(user_router)

# Protected routes
app.include_router(protected_router)

# Upload routes
app.include_router(upload_router)

# Cases routes
app.include_router(cases_router)

# Individual case routes
app.include_router(case_router)

# Dashboard routes
app.include_router(dashboard_router)

# Blockchain routes
app.include_router(blockchain_routes.router)

# Verification routes
app.include_router(verification_routes.router)

# Forensic routes
app.include_router(forensic_router)

# Profile routes
app.include_router(profile_router)


# ============================================================
# Home Route
# ============================================================

@app.get("/")
def home():
    return {
        "message": "Welcome to ProofGenesis Backend!"
    }


# ============================================================
# Test Route
# ============================================================

@app.get("/hello")
def hello():
    return {
        "message": "Hello from FastAPI!"
    }
