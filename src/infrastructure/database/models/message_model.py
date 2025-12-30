from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.infrastructure.database.base import Base
from datetime import datetime

class MessageModel(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id"), nullable=False)
    content = Column(Text, nullable=False)
    role = Column(String(20), nullable=False)  # 'user' or 'assistant'
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    
    chat = relationship("ChatModel", back_populates="messages")