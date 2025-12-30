from abc import ABC, abstractmethod
from typing import List, Dict, AsyncGenerator

class AIServiceInterface(ABC):
    @abstractmethod
    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        top_p: float = 0.9,
        stream: bool = True
    ) -> AsyncGenerator[str, None]:
        pass
    
    @abstractmethod
    async def generate_chat_title(self, messages: List[Dict[str, str]]) -> str:
        pass