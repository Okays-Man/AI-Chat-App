from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import joinedload  
from src.application.interfaces.repositories.user_repository_interface import UserRepositoryInterface
from src.domain.entities.user import User
from src.domain.entities.session import Session
from src.infrastructure.database.models.user_model import UserModel
from src.infrastructure.database.models.session_model import SessionModel
from datetime import datetime, timezone
from typing import Optional, List

class UserRepository(UserRepositoryInterface):
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session
    
    async def get_by_id(self, user_id: int) -> Optional[User]:
        result = await self.db_session.execute(
            select(UserModel).where(UserModel.id == user_id)
        )
        user_model = result.scalar_one_or_none()
        if not user_model:
            return None
        return self._model_to_entity(user_model)
    
    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.db_session.execute(
            select(UserModel).where(UserModel.email == email)
        )
        user_model = result.scalar_one_or_none()
        if not user_model:
            return None
        return self._model_to_entity(user_model)
    
    async def get_by_username(self, username: str) -> Optional[User]:
        result = await self.db_session.execute(
            select(UserModel).where(UserModel.username == username)
        )
        user_model = result.scalar_one_or_none()
        if not user_model:
            return None
        return self._model_to_entity(user_model)
    
    async def create(self, email: str, username: str, hashed_password: str) -> User:
        user_model = UserModel(
            email=email,
            username=username,
            hashed_password=hashed_password
        )
        self.db_session.add(user_model)
        await self.db_session.commit()
        await self.db_session.refresh(user_model)
        return self._model_to_entity(user_model)
    
    async def update(self, user_id: int, username: Optional[str] = None, email: Optional[str] = None) -> User:
        update_data = {}
        if username:
            update_data["username"] = username
        if email:
            update_data["email"] = email
        
        if not update_data:
            raise ValueError("No fields to update")
        
        await self.db_session.execute(
            update(UserModel)
            .where(UserModel.id == user_id)
            .values(**update_data)
        )
        await self.db_session.commit()
        return await self.get_by_id(user_id)
    
    async def create_session(self, user_id: int, session_id: str, expiry: datetime) -> Session:
        session_model = SessionModel(
            id=session_id,
            user_id=user_id,
            expiry=expiry,
            last_activity=datetime.now(timezone.utc)
        )
        self.db_session.add(session_model)
        await self.db_session.commit()
        
        result = await self.db_session.execute(
            select(UserModel).where(UserModel.id == user_id)
        )
        user_model = result.scalar_one()
        user = self._model_to_entity(user_model)
        
        return Session(
            id=session_id,
            user_id=user_id,
            user=user,
            created_at=session_model.created_at,
            last_activity=session_model.last_activity,
            expiry=session_model.expiry
        )
    
    async def get_session_by_id(self, session_id: str) -> Optional[Session]:
        result = await self.db_session.execute(
            select(SessionModel)
            .where(SessionModel.id == session_id)
            .options(joinedload(SessionModel.user)) 
        )
        session_model = result.scalar_one_or_none()
        if not session_model:
            return None
        
        user = self._model_to_entity(session_model.user)
        
        return Session(
            id=session_model.id,
            user_id=session_model.user_id,
            user=user,
            created_at=session_model.created_at,
            last_activity=session_model.last_activity,
            expiry=session_model.expiry
        )
    
    async def update_session_activity(self, session_id: str) -> None:
        await self.db_session.execute(
            update(SessionModel)
            .where(SessionModel.id == session_id)
            .values(last_activity=datetime.now(timezone.utc))
        )
        
    async def delete_session(self, session_id: str) -> None:
        await self.db_session.execute(
            delete(SessionModel).where(SessionModel.id == session_id)
        )
        await self.db_session.commit()
    
    async def get_active_sessions(self, user_id: int) -> List[Session]:
        result = await self.db_session.execute(
            select(SessionModel)
            .where(
                SessionModel.user_id == user_id,
                SessionModel.expiry > datetime.now(timezone.utc)
            )
            .order_by(SessionModel.last_activity.desc())
            .options(joinedload(SessionModel.user))
        )
        session_models = result.scalars().all()
        sessions = []
        for session_model in session_models:
            user = self._model_to_entity(session_model.user)
            sessions.append(Session(
                id=session_model.id,
                user_id=session_model.user_id,
                user=user,
                created_at=session_model.created_at,
                last_activity=session_model.last_activity,
                expiry=session_model.expiry
            ))
        return sessions
    
    def _model_to_entity(self, model: UserModel) -> User:
        return User(
            id=model.id,
            email=model.email,
            username=model.username,
            hashed_password=model.hashed_password,
            created_at=model.created_at,
            updated_at=model.updated_at
        )