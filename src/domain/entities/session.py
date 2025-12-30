from dataclasses import dataclass
from datetime import datetime
from src.domain.entities.user import User

@dataclass
class Session:
    id: str
    user_id: int
    user: User
    created_at: datetime
    last_activity: datetime
    expiry: datetime