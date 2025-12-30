from abc import ABC, abstractmethod
from typing import Optional, List
from datetime import datetime
from src.domain.entities.user import User
from src.domain.entities.session import Session

class UserRepositoryInterface(ABC):
    @abstractmethod
    async def get_by_id(self, user_id: int) -> Optional[User]:
        pass
    
    @abstractmethod
    async def get_by_email(self, email: str) -> Optional[User]:
        pass
    
    @abstractmethod
    async def get_by_username(self, username: str) -> Optional[User]:
        pass
    
    @abstractmethod
    async def create(self, email: str, username: str, hashed_password: str) -> User:
        pass
    
    @abstractmethod
    async def update(self, user_id: int, username: Optional[str] = None, email: Optional[str] = None) -> User:
        pass
    
    @abstractmethod
    async def create_session(self, user_id: int, session_id: str, expiry: datetime) -> Session:
        pass
    
    @abstractmethod
    async def get_session_by_id(self, session_id: str) -> Optional[Session]:
        pass
    
    @abstractmethod
    async def update_session_activity(self, session_id: str) -> None:
        pass
    
    @abstractmethod
    async def delete_session(self, session_id: str) -> None:
        pass
    
    @abstractmethod
    async def get_active_sessions(self, user_id: int) -> List[Session]:
        pass