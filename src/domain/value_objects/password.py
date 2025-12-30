from dataclasses import dataclass
from src.domain.exceptions import ValidationError

@dataclass(frozen=True)
class Password:
    value: str
    
    def __post_init__(self):
        if len(self.value) < 8:
            raise ValidationError("Password must be at least 8 characters long")
        
        if not any(c.isupper() for c in self.value):
            raise ValidationError("Password must contain at least one uppercase letter")
        
        if not any(c.islower() for c in self.value):
            raise ValidationError("Password must contain at least one lowercase letter")
        
        if not any(c.isdigit() for c in self.value):
            raise ValidationError("Password must contain at least one digit")