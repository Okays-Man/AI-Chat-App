from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession 
from src.application.dtos.user_dto import UpdateUserDTO
from src.application.use_cases.user_use_cases import GetUserProfileUseCase, UpdateUserProfileUseCase
from src.dependencies import get_user_repository, get_db 

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/profile")
async def get_profile(
    request: Request,
    db_session: AsyncSession = Depends(get_db) 
):
    user_id = request.state.user.id
    
    user_repo = await get_user_repository(db_session) 
    
    use_case = GetUserProfileUseCase(user_repo)
    user = await use_case.execute(user_id)
    return user

@router.put("/profile")
async def update_profile(
    request: Request, 
    dto: UpdateUserDTO,
    db_session: AsyncSession = Depends(get_db) 
):
    user_id = request.state.user.id
    
    user_repo = await get_user_repository(db_session)
    
    use_case = UpdateUserProfileUseCase(user_repo)
    
    try:
        user = await use_case.execute(user_id, dto)
        return user
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))