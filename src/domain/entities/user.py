from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class User:
    id: int
    email: str
    username: str
    hashed_password: str
    created_at: datetime
    updated_at: datetime
    
    def verify_password(self, password: str, password_helper) -> bool:
        return password_helper.verify_password(password, self.hashed_password)