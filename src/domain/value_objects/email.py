from dataclasses import dataclass
import re
from src.domain.exceptions import ValidationError

@dataclass(frozen=True)
class Email:
    value: str
    
    def __post_init__(self):
        if not self._is_valid_email(self.value):
            raise ValidationError("Invalid email format")
    
    @staticmethod
    def _is_valid_email(email: str) -> bool:
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def __str__(self) -> str:
        return self.value