from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from src.application.interfaces.repositories.message_repository_interface import MessageRepositoryInterface
from src.domain.entities.message import Message
from src.infrastructure.database.models.message_model import MessageModel
from datetime import datetime
from typing import List, Optional

class MessageRepository(MessageRepositoryInterface):
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session
    
    async def create(self, chat_id: int, content: str, role: str) -> Message:
        message_model = MessageModel(
            chat_id=chat_id,
            content=content,
            role=role
        )
        self.db_session.add(message_model)
        await self.db_session.commit()
        await self.db_session.refresh(message_model)
        
        return Message(
            id=message_model.id,
            chat_id=message_model.chat_id,
            content=message_model.content,
            role=message_model.role,
            created_at=message_model.created_at
        )
    
    async def get_by_chat_id(self, chat_id: int) -> List[Message]:
        result = await self.db_session.execute(
            select(MessageModel)
            .where(MessageModel.chat_id == chat_id)
            .order_by(MessageModel.created_at.asc())
        )
        message_models = result.scalars().all()
        
        return [
            Message(
                id=message_model.id,
                chat_id=message_model.chat_id,
                content=message_model.content,
                role=message_model.role,
                created_at=message_model.created_at
            )
            for message_model in message_models
        ]
    
    async def get_recent_messages(self, chat_id: int, limit: int = 10) -> List[Message]:
        result = await self.db_session.execute(
            select(MessageModel)
            .where(MessageModel.chat_id == chat_id)
            .order_by(MessageModel.created_at.desc())
            .limit(limit)
        )
        message_models = result.scalars().all()
        
        # Reverse to get chronological order
        message_models.reverse()
        
        return [
            Message(
                id=message_model.id,
                chat_id=message_model.chat_id,
                content=message_model.content,
                role=message_model.role,
                created_at=message_model.created_at
            )
            for message_model in message_models
        ]
    
    async def get_by_id(self, message_id: int) -> Optional[Message]:
        result = await self.db_session.execute(
            select(MessageModel).where(MessageModel.id == message_id)
        )
        message_model = result.scalar_one_or_none()
        if not message_model:
            return None
        
        return Message(
            id=message_model.id,
            chat_id=message_model.chat_id,
            content=message_model.content,
            role=message_model.role,
            created_at=message_model.created_at
        )