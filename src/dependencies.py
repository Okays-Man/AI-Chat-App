from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from typing import AsyncGenerator, Optional
from src.infrastructure.repositories.chat_repository import ChatRepository
from src.infrastructure.repositories.message_repository import MessageRepository
from src.infrastructure.repositories.user_repository import UserRepository
from src.config import settings
from src.infrastructure.services.ai_service import AIService

engine = create_async_engine(settings.DATABASE_URL, echo=settings.DEBUG)
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def get_ai_service() -> AIService:
    return AIService(settings.API_URL, settings.API_KEY)

async def get_user_repository(db_session: Optional[AsyncSession] = None):
    if db_session is None:
        async with AsyncSessionLocal() as session:
            return UserRepository(session)
    return UserRepository(db_session)

async def get_chat_repository(db_session: Optional[AsyncSession] = None):
    if db_session is None:
        async with AsyncSessionLocal() as session:
            return ChatRepository(session)
    return ChatRepository(db_session)

async def get_message_repository(db_session: Optional[AsyncSession] = None):
    if db_session is None:
        async with AsyncSessionLocal() as session:
            return MessageRepository(session)
    return MessageRepository(db_session)