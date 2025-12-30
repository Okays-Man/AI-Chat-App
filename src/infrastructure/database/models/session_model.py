from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.infrastructure.database.base import Base
from datetime import datetime

class SessionModel(Base):
    __tablename__ = "sessions"
    
    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    last_activity = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    expiry = Column(DateTime(timezone=True), nullable=False)
    
    user = relationship("UserModel", back_populates="sessions")