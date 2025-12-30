from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from src.infrastructure.repositories.user_repository import UserRepository
from src.infrastructure.helpers.cookie_helper import get_session_cookie, delete_session_cookie
from datetime import datetime, timezone
from src.dependencies import get_db
from types import SimpleNamespace 

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            return await call_next(request)

        public_routes = [
            "/api/auth/login",
            "/api/auth/register", 
            "/api/auth/logout",
            "/health",
            "/docs",
            "/openapi.json"
        ]
        
        if request.url.path == "/" or any(request.url.path.startswith(route) for route in public_routes):
            return await call_next(request)
        
        session_id = get_session_cookie(request)
        if not session_id:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Not authenticated"}
            )
        
        async for db_session in get_db():
            user_repo = UserRepository(db_session)
            
            try:
                user_session = await user_repo.get_session_by_id(session_id)
                current_time = datetime.now(timezone.utc)
                
                if not user_session or user_session.expiry < current_time:
                    delete_session_cookie(request)
                    return JSONResponse(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        content={"detail": "Session expired or invalid"}
                    )
                
                await user_repo.update_session_activity(session_id)
                await db_session.commit()
                
                request.state.user = SimpleNamespace(
                    id=user_session.user.id,
                    email=user_session.user.email,
                    username=user_session.user.username
                )
                
                
                response = await call_next(request)
                return response
                
            except Exception as e:
                print(f"Auth Middleware Error: {e}") 
                return JSONResponse(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    content={"detail": f"Authentication failed: {str(e)}"}
                )
            finally:
                await db_session.close()