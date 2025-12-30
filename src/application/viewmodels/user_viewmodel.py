from pydantic import BaseModel
from datetime import datetime

class UserViewModel(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime
    updated_at: datetime