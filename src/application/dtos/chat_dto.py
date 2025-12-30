from pydantic import BaseModel
from typing import List, Optional, Literal

AI_MODELS = Literal[
    "nemotron-3-nano-30b-a3b:free",
    "devstral-2512:free",
    "kimi-k2-0905:free",
    "minimax-m2:free",
    "longcat-flash-chat:free",
    "glm-4.6:free",
    "deepseek-v3.1-terminus:free",
    "gpt-oss-120b:free",
    "deepseek-r1-0528:free"
]

class ChatRequestDTO(BaseModel):
    message: str
    model: AI_MODELS = "nemotron-3-nano-30b-a3b:free"
    temperature: float = 0.7
    max_tokens: int = 1000
    top_p: float = 0.9
    stream: bool = True

class CreateChatDTO(BaseModel):
    title: Optional[str] = None

class UpdateChatDTO(BaseModel):
    title: str