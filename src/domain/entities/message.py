from dataclasses import dataclass
from datetime import datetime

@dataclass
class Message:
    id: int
    chat_id: int
    content: str
    role: str  
    created_at: datetime