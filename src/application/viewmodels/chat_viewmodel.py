from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class MessageViewModel(BaseModel):
    id: int
    content: str
    role: str  # 'user' or 'assistant'
    created_at: datetime

class ChatViewModel(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int

class ChatDetailViewModel(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageViewModel]