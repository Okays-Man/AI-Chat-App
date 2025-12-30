from src.application.interfaces.repositories.user_repository_interface import UserRepositoryInterface
from src.application.dtos.auth_dto import LoginDTO, RegisterDTO
from src.infrastructure.helpers.password_helper import hash_password, verify_password

class RegisterUseCase:
    def __init__(self, user_repository: UserRepositoryInterface):
        self.user_repository = user_repository
    
    async def execute(self, dto: RegisterDTO):
        # Check if user already exists
        existing_user = await self.user_repository.get_by_email(dto.email)
        if existing_user:
            raise ValueError("Email already registered")
        
        existing_username = await self.user_repository.get_by_username(dto.username)
        if existing_username:
            raise ValueError("Username already taken")

        hashed_password = hash_password(dto.password)
        # Create user - this is async
        user = await self.user_repository.create(
            email=dto.email,
            username=dto.username,
            hashed_password=hashed_password
        )
        return user

class LoginUseCase:
    def __init__(self, user_repository: UserRepositoryInterface):
        self.user_repository = user_repository
    
    async def execute(self, dto: LoginDTO):
        user = await self.user_repository.get_by_email(dto.email)
        if not user:
            raise ValueError("Invalid email or password")
        
        if not verify_password(dto.password, user.hashed_password):
            raise ValueError("Invalid email or password")
        
        return user

class LogoutUseCase:
    def __init__(self, user_repository: UserRepositoryInterface):
        self.user_repository = user_repository
    
    async def execute(self, session_id: str):
        await self.user_repository.delete_session(session_id)