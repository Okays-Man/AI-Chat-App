from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Chat:
    id: int
    user_id: int
    title: Optional[str]
    created_at: datetime
    updated_at: datetime