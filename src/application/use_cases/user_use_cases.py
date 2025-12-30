from src.application.interfaces.repositories.user_repository_interface import UserRepositoryInterface
from src.application.dtos.user_dto import UpdateUserDTO
from src.application.viewmodels.user_viewmodel import UserViewModel
from src.domain.exceptions.not_found_error import NotFoundError
from src.domain.exceptions.validation_error import ValidationError

class GetUserProfileUseCase:
    def __init__(self, user_repository: UserRepositoryInterface):
        self.user_repository = user_repository
    
    async def execute(self, user_id: int):
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise NotFoundError("User not found")
        
        return UserViewModel(
            id=user.id,
            username=user.username,
            email=user.email,
            created_at=user.created_at,
            updated_at=user.updated_at
        )

class UpdateUserProfileUseCase:
    def __init__(self, user_repository: UserRepositoryInterface):
        self.user_repository = user_repository
    
    async def execute(self, user_id: int, dto: UpdateUserDTO):
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise NotFoundError("User not found")
        
        # Check for duplicate username
        if dto.username and dto.username != user.username:
            existing_user = await self.user_repository.get_by_username(dto.username)
            if existing_user:
                raise ValidationError("Username already taken")
        
        # Check for duplicate email
        if dto.email and dto.email != user.email:
            existing_user = await self.user_repository.get_by_email(dto.email)
            if existing_user:
                raise ValidationError("Email already registered")
        
        # Update user
        updated_user = await self.user_repository.update(
            user_id=user_id,
            username=dto.username,
            email=dto.email
        )
        
        return UserViewModel(
            id=updated_user.id,
            username=updated_user.username,
            email=updated_user.email,
            created_at=updated_user.created_at,
            updated_at=updated_user.updated_at
        )