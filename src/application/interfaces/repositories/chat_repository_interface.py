from abc import ABC, abstractmethod
from typing import List, Optional
from src.domain.entities.chat import Chat

class ChatRepositoryInterface(ABC):
    @abstractmethod
    async def create(self, user_id: int, title: Optional[str] = None) -> Chat:
        pass
    
    @abstractmethod
    async def get_by_id(self, chat_id: int) -> Optional[Chat]:
        pass
    
    @abstractmethod
    async def get_by_user_id(self, user_id: int) -> List[Chat]:
        pass
    
    @abstractmethod
    async def update_title(self, chat_id: int, title: str) -> Chat:
        pass
    
    @abstractmethod
    async def delete(self, chat_id: int) -> None:
        pass
    
    @abstractmethod
    async def get_message_count(self, chat_id: int) -> int:
        pass