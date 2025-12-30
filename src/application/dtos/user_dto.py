from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UpdateUserDTO(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None