from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, update, delete
from src.application.interfaces.repositories.chat_repository_interface import ChatRepositoryInterface
from src.domain.entities.chat import Chat
from src.infrastructure.database.models.chat_model import ChatModel
from src.infrastructure.database.models.message_model import MessageModel
from datetime import datetime
from typing import List, Optional

class ChatRepository(ChatRepositoryInterface):
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session
    
    async def create(self, user_id: int, title: Optional[str] = None) -> Chat:
        chat_model = ChatModel(
            user_id=user_id,
            title=title
        )
        self.db_session.add(chat_model)
        await self.db_session.commit()
        await self.db_session.refresh(chat_model)
        
        return Chat(
            id=chat_model.id,
            user_id=chat_model.user_id,
            title=chat_model.title,
            created_at=chat_model.created_at,
            updated_at=chat_model.updated_at
        )
    
    async def get_by_id(self, chat_id: int) -> Optional[Chat]:
        result = await self.db_session.execute(
            select(ChatModel).where(ChatModel.id == chat_id)
        )
        chat_model = result.scalar_one_or_none()
        if not chat_model:
            return None
        
        return Chat(
            id=chat_model.id,
            user_id=chat_model.user_id,
            title=chat_model.title,
            created_at=chat_model.created_at,
            updated_at=chat_model.updated_at
        )
    
    async def get_by_user_id(self, user_id: int) -> List[Chat]:
        result = await self.db_session.execute(
            select(ChatModel)
            .where(ChatModel.user_id == user_id)
            .order_by(ChatModel.updated_at.desc())
        )
        chat_models = result.scalars().all()
        
        return [
            Chat(
                id=chat_model.id,
                user_id=chat_model.user_id,
                title=chat_model.title,
                created_at=chat_model.created_at,
                updated_at=chat_model.updated_at
            )
            for chat_model in chat_models
        ]
    
    async def update_title(self, chat_id: int, title: str) -> Chat:
        await self.db_session.execute(
            update(ChatModel)
            .where(ChatModel.id == chat_id)
            .values(title=title, updated_at=datetime.utcnow())
        )
        await self.db_session.commit()
        
        return await self.get_by_id(chat_id)
    
    async def delete(self, chat_id: int) -> None:
        await self.db_session.execute(
            delete(ChatModel).where(ChatModel.id == chat_id)
        )
        await self.db_session.commit()
    
    async def get_message_count(self, chat_id: int) -> int:
        result = await self.db_session.execute(
            select(func.count(MessageModel.id))
            .where(MessageModel.chat_id == chat_id)
        )
        return result.scalar_one() or 0