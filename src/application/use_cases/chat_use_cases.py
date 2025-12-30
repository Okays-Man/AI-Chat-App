from src.domain.entities.chat import Chat
from src.application.interfaces.repositories.chat_repository_interface import ChatRepositoryInterface
from src.application.interfaces.repositories.message_repository_interface import MessageRepositoryInterface
from src.application.interfaces.services.ai_service_interface import AIServiceInterface
from src.application.dtos.chat_dto import ChatRequestDTO, CreateChatDTO, UpdateChatDTO
from src.application.viewmodels.chat_viewmodel import ChatViewModel, ChatDetailViewModel, MessageViewModel
from src.domain.exceptions.permission_error import PermissionError
from src.domain.exceptions.not_found_error import NotFoundError
from typing import List, AsyncGenerator, Optional
import json

class CreateChatUseCase:
    def __init__(self, chat_repository: ChatRepositoryInterface):
        self.chat_repository = chat_repository
    
    async def execute(self, user_id: int, title: str) -> Chat:
        return await self.chat_repository.create(user_id, title)
class GetChatUseCase:
    def __init__(self, chat_repository: ChatRepositoryInterface):
        self.chat_repository = chat_repository
    
    async def execute(self, user_id: int, chat_id: int):
        chat = await self.chat_repository.get_by_id(chat_id)
        if not chat:
            raise NotFoundError("Chat not found")
        
        if chat.user_id != user_id:
            raise PermissionError("You don't have permission to access this chat")
        
        message_count = await self.chat_repository.get_message_count(chat_id)
        
        return ChatViewModel(
            id=chat.id,
            title=chat.title or "New Chat",
            created_at=chat.created_at,
            updated_at=chat.updated_at,
            message_count=message_count
        )

class ListChatsUseCase:
    def __init__(self, chat_repository: ChatRepositoryInterface):
        self.chat_repository = chat_repository
    
    async def execute(self, user_id: int) -> List[ChatViewModel]:
        chats = await self.chat_repository.get_by_user_id(user_id)
        result = []
        
        for chat in chats:
            message_count = await self.chat_repository.get_message_count(chat.id)
            result.append(ChatViewModel(
                id=chat.id,
                title=chat.title or "New Chat",
                created_at=chat.created_at,
                updated_at=chat.updated_at,
                message_count=message_count
            ))
        
        return result

class DeleteChatUseCase:
    def __init__(self, chat_repository: ChatRepositoryInterface):
        self.chat_repository = chat_repository
    
    async def execute(self, user_id: int, chat_id: int):
        chat = await self.chat_repository.get_by_id(chat_id)
        if not chat:
            raise NotFoundError("Chat not found")
        
        if chat.user_id != user_id:
            raise PermissionError("You don't have permission to delete this chat")
        
        await self.chat_repository.delete(chat_id)

class SendMessageUseCase:
    def __init__(self, chat_repository: ChatRepositoryInterface, 
                 message_repository: MessageRepositoryInterface,
                 ai_service: AIServiceInterface):
        self.chat_repository = chat_repository
        self.message_repository = message_repository
        self.ai_service = ai_service
    
    async def execute_stream(self, user_id: int, chat_id: int, dto: ChatRequestDTO) -> AsyncGenerator[str, None]:
        chat = await self.chat_repository.get_by_id(chat_id)
        if not chat:
            raise NotFoundError("Chat not found")
        
        if chat.user_id != user_id:
            raise PermissionError("You don't have permission to send messages to this chat")
        
        await self.message_repository.create(
            chat_id=chat_id,
            content=dto.message,
            role="user"
        )
        
        messages = await self.message_repository.get_recent_messages(chat_id, limit=10)
        api_messages = [{"role": msg.role, "content": msg.content} for msg in messages]
        
        full_response = ""
        async for chunk in self.ai_service.generate_response(
            messages=api_messages,
            model=dto.model,
            temperature=dto.temperature,
            max_tokens=dto.max_tokens,
            top_p=dto.top_p
        ):
            if chunk:  
                full_response += chunk
                yield json.dumps({"content": chunk, "type": "chunk"})
        
        await self.message_repository.create(
            chat_id=chat_id,
            content=full_response,
            role="assistant"
        )

        if chat.title == "New Chat" and len(messages) == 1:
            title_prompt = (
                f"Generate a short, descriptive title (max 5 words) for this conversation "
                f"based on this input: '{dto.message[:100]}'. Do not use quotes."
            )
            title_messages = [{"role": "user", "content": title_prompt}]
            
            title = ""
            try:
                async for chunk in self.ai_service.generate_response(
                    messages=title_messages,
                    model=dto.model,
                    temperature=0.7,  
                    max_tokens=30,    
                    top_p=dto.top_p if hasattr(dto, 'top_p') and dto.top_p is not None else 0.9
                ):
                    if chunk:
                        title += chunk
            except Exception as e:
                print(f"Failed to generate title: {str(e)}")

            title = title.strip().strip('"').strip("'")
            if title:
                await self.chat_repository.update_title(chat_id, title)
                # Optional: You might want to yield the title to the frontend
                # yield json.dumps({"content": title, "type": "title_update"})

class GetChatHistoryUseCase:
    def __init__(self, message_repository: MessageRepositoryInterface, chat_repository: ChatRepositoryInterface):
        self.message_repository = message_repository
        self.chat_repository = chat_repository  # 2. Store it
    
    async def execute(self, user_id: int, chat_id: int):
        chat = await self.chat_repository.get_by_id(chat_id)
        
        if not chat:
            raise ValueError("Chat not found") 
        
        if chat.user_id != user_id:
            raise PermissionError("You don't have permission to access this chat history")
        
        messages = await self.message_repository.get_by_chat_id(chat_id)
        
        return [
            MessageViewModel(
                id=msg.id,
                content=msg.content,
                role=msg.role,
                created_at=msg.created_at
            )
            for msg in messages
        ]