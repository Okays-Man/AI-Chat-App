from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class LoginDTO(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

class RegisterDTO(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    username: str = Field(..., min_length=3, max_length=50)