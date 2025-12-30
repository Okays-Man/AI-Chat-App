from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from src.application.dtos.auth_dto import LoginDTO, RegisterDTO
from src.application.use_cases.auth_use_cases import LoginUseCase, RegisterUseCase, LogoutUseCase
from src.dependencies import get_user_repository, get_db
from src.infrastructure.helpers.cookie_helper import set_session_cookie, delete_session_cookie, get_session_cookie
from src.config import settings
import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    request: Request, 
    response: Response, 
    dto: RegisterDTO,
    db_session: AsyncSession = Depends(get_db)
):
    user_repo = await get_user_repository(db_session)
    use_case = RegisterUseCase(user_repo)
    
    try:
        user = await use_case.execute(dto)
        
        session_id = str(uuid.uuid4())
        expiry = datetime.now(timezone.utc) + timedelta(days=settings.SESSION_EXPIRY_DAYS)
        await user_repo.create_session(user.id, session_id, expiry)
        
        # Set session cookie
        set_session_cookie(response, session_id)
        
        return {"message": "User registered successfully", "user_id": user.id}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login")
async def login(
    request: Request, 
    response: Response, 
    dto: LoginDTO,
    db_session: AsyncSession = Depends(get_db)
):
    user_repo = await get_user_repository(db_session)
    use_case = LoginUseCase(user_repo)
    
    try:
        user = await use_case.execute(dto)
        
        session_id = str(uuid.uuid4())
        expiry = datetime.now(timezone.utc) + timedelta(days=settings.SESSION_EXPIRY_DAYS)
        await user_repo.create_session(user.id, session_id, expiry)
        
        set_session_cookie(response, session_id)
        
        return {"message": "Login successful", "user_id": user.id}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/logout")
async def logout(
    request: Request, 
    response: Response,
    db_session: AsyncSession = Depends(get_db)
):
    session_id = get_session_cookie(request)
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No active session"
        )
    
    user_repo = await get_user_repository(db_session)
    use_case = LogoutUseCase(user_repo)
    
    try:
        await use_case.execute(session_id)
        delete_session_cookie(response)
        return {"message": "Logout successful"}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Logout failed: {str(e)}"
        )