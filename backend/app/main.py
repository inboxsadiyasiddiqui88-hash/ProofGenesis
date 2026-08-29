from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.test_db import router as test_router
from app.routes.user_routes import router as user_router
from app.routes.protected_routes import router as protected_router
from app.routes.upload_routes import router as upload_router
from app.routes.cases import router as cases_router  # NEW
from app.routes.case_routes import router as case_router
from app.routes import blockchain_routes
from app.routes import verification_routes
from app.routes.forensic_routes import router as forensic_router
from app.routes.dashboard_routes import router as dashboard_router
from app.routes import dashboard_routes

app = FastAPI(
    title="ProofGenesis API",
    version="1.0.0"
)

# Allow React frontend to access backend
origins = [
    "http://localhost:5173",
]

# Register all routers
app.include_router(test_router)
app.include_router(user_router)
app.include_router(protected_router)
app.include_router(upload_router)
app.include_router(cases_router)  # NEW
app.include_router(case_router)
app.include_router(dashboard_router)
app.include_router(blockchain_routes.router)
app.include_router(verification_routes.router)
app.include_router(forensic_router)
app.include_router(dashboard_routes.router)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Home Route
@app.get("/")
def home():
    return {
        "message": "Welcome to ProofGenesis Backend!"
    }

# Test Route
@app.get("/hello")
def hello():
    return {
        "message": "Hello from FastAPI!"
    }