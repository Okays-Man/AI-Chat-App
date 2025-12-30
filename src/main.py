import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import create_async_engine
from src.config import settings
from src.middleware.auth_middleware import AuthMiddleware
from src.presentation.routes import setup_routes

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.db_engine = create_async_engine(settings.DATABASE_URL, echo=settings.DEBUG)
    yield 
    await app.state.db_engine.dispose()

app = FastAPI(
    title="AI Chat Application",
    description="Production-ready AI chat application with clean architecture",
    version="1.0.0",
    lifespan=lifespan  
)

app.add_middleware(AuthMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Length", "X-CSRF-Token"],
    max_age=600,
)

setup_routes(app)

@app.get("/")
async def root():
    return {"message": "AI Chat Application is running"}