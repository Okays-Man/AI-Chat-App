import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql+asyncpg://postgres:Admin@localhost:5432/ai_chat_db"
    )
    API_KEY: str = os.getenv("API_KEY")
    API_URL: str = os.getenv("API_URL", "https://api.routeway.ai/v1/chat/completions")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key")
    SESSION_EXPIRY_DAYS: int = int(os.getenv("SESSION_EXPIRY_DAYS", "7"))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

settings = Settings()