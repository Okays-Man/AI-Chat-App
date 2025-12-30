from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from src.application.dtos.chat_dto import ChatRequestDTO, CreateChatDTO, UpdateChatDTO
from src.application.use_cases.chat_use_cases import (
    CreateChatUseCase,
    GetChatUseCase,
    ListChatsUseCase,
    DeleteChatUseCase,
    SendMessageUseCase,
    GetChatHistoryUseCase
)
from src.application.viewmodels.chat_viewmodel import ChatViewModel
from src.dependencies import get_chat_repository, get_message_repository, get_ai_service, get_db
from src.config import settings
from typing import AsyncGenerator

router = APIRouter(prefix="/chats", tags=["Chats"])


@router.post("/", response_model=ChatViewModel)
async def create_chat(
    request: Request,
    dto: CreateChatDTO,  
    db_session: AsyncSession = Depends(get_db)
):
    user_id = request.state.user.id
    chat_repo = await get_chat_repository(db_session)
    use_case = CreateChatUseCase(chat_repo)
    try:
        chat = await use_case.execute(user_id, dto.title)
        
        return {
            "id": chat.id,
            "title": chat.title,
            "created_at": chat.created_at,
            "updated_at": chat.updated_at,
            "message_count": 0 
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{chat_id}", response_model=ChatViewModel)
async def get_chat(
    request: Request, 
    chat_id: int,
    db_session: AsyncSession = Depends(get_db)
):
    user_id = request.state.user.id
    chat_repo = await get_chat_repository(db_session)
    use_case = GetChatUseCase(chat_repo)
    
    try:
        chat = await use_case.execute(user_id, chat_id)
        return chat
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.get("/", response_model=list[ChatViewModel])
async def list_chats(
    request: Request,
    db_session: AsyncSession = Depends(get_db)
):
    user_id = request.state.user.id
    chat_repo = await get_chat_repository(db_session)
    use_case = ListChatsUseCase(chat_repo)
    
    chats = await use_case.execute(user_id)
    return chats

@router.delete("/{chat_id}")
async def delete_chat(
    request: Request, 
    chat_id: int,
    db_session: AsyncSession = Depends(get_db)
):
    user_id = request.state.user.id
    chat_repo = await get_chat_repository(db_session)
    use_case = DeleteChatUseCase(chat_repo)
    
    try:
        await use_case.execute(user_id, chat_id)
        return {"message": "Chat deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("/{chat_id}/messages/stream")
async def stream_message(
    request: Request, 
    chat_id: int, 
    dto: ChatRequestDTO,
    db_session: AsyncSession = Depends(get_db)
):
    user_id = request.state.user.id
    chat_repo = await get_chat_repository(db_session)
    message_repo = await get_message_repository(db_session)
    ai_service = await get_ai_service()
    
    use_case = SendMessageUseCase(chat_repo, message_repo, ai_service)
    
    async def message_stream():
        try:
            async for chunk in use_case.execute_stream(user_id, chat_id, dto):
                yield f"data: {chunk}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: Error: {str(e)}\n\n"
            yield "data: [DONE]\n\n"
    
    return StreamingResponse(
        message_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )

@router.get("/{chat_id}/history")
async def get_chat_history(
    request: Request, 
    chat_id: int,
    db_session: AsyncSession = Depends(get_db)
):
    user_id = request.state.user.id
    
    message_repo = await get_message_repository(db_session)
    chat_repo = await get_chat_repository(db_session) 
    
    use_case = GetChatHistoryUseCase(message_repo, chat_repo)
    
    try:
        messages = await use_case.execute(user_id, chat_id)
        return messages
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))