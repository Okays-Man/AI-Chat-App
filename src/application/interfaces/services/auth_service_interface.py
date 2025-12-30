from abc import ABC, abstractmethod
from typing import Optional
from src.domain.entities.user import User

class AuthServiceInterface(ABC):
    @abstractmethod
    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        pass
    
    @abstractmethod
    async def create_session(self, user_id: int) -> str:
        pass
    
    @abstractmethod
    async def validate_session(self, session_id: str) -> Optional[User]:
        pass
    
    @abstractmethod
    async def invalidate_session(self, session_id: str) -> None:
        pass