from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.core.config import settings
from app.api.v1.dashboard import router as dashboard_router
from app.db.session import init_db, seed_data, SessionLocal

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database schema
    init_db()
    
    # Seed mock data if database is empty
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AccrediVerse AI Recommendation Engine and Dashboard API Backend Service",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Include dashboard router
app.include_router(dashboard_router)

@app.get("/")
def read_root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API. Access interactive documentation at /docs",
        "version": settings.VERSION
    }
