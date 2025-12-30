from fastapi import Request, Response
from src.config import settings
from datetime import datetime, timedelta, timezone

def set_session_cookie(response: Response, session_id: str):
    expiry = datetime.now(timezone.utc) + timedelta(days=settings.SESSION_EXPIRY_DAYS)
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=not settings.DEBUG,
        samesite="lax",
        expires=expiry,
        max_age=settings.SESSION_EXPIRY_DAYS * 86400
    )

def get_session_cookie(request: Request) -> str:
    return request.cookies.get("session_id")

def delete_session_cookie(response: Response):
    response.delete_cookie(
        key="session_id",
        httponly=True,
        secure=not settings.DEBUG,
        samesite="lax"
    )