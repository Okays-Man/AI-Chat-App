from abc import ABC, abstractmethod
from typing import List, Optional
from src.domain.entities.message import Message

class MessageRepositoryInterface(ABC):
    @abstractmethod
    async def create(self, chat_id: int, content: str, role: str) -> Message:
        pass
    
    @abstractmethod
    async def get_by_chat_id(self, chat_id: int) -> List[Message]:
        pass
    
    @abstractmethod
    async def get_recent_messages(self, chat_id: int, limit: int = 10) -> List[Message]:
        pass
    
    @abstractmethod
    async def get_by_id(self, message_id: int) -> Optional[Message]:
        pass