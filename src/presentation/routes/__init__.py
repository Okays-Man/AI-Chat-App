from fastapi import APIRouter
from src.presentation.controllers.auth_controller import router as auth_router
from src.presentation.controllers.chat_controller import router as chat_router
from src.presentation.controllers.user_controller import router as user_router

def setup_routes(app):
    api_router = APIRouter(prefix="/api")
    
    api_router.include_router(auth_router)
    api_router.include_router(chat_router)
    api_router.include_router(user_router)
    
    app.include_router(api_router)