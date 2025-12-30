import httpx
import json
from typing import List, Dict, AsyncGenerator
from src.application.interfaces.services.ai_service_interface import AIServiceInterface
from src.config import settings

class AIService(AIServiceInterface):
    def __init__(self, api_url: str, api_key: str):
        self.api_url = api_url
        self.api_key = api_key
        self.timeout = 60.0
    
    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        model: str,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        top_p: float = 0.9,
        stream: bool = True
    ) -> AsyncGenerator[str, None]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        data = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "top_p": top_p,
            "stream": stream
        }
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            async with client.stream(
                "POST",
                self.api_url,
                headers=headers,
                json=data
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line:
                        line = line.strip()
                        if line.startswith("data: "):
                            json_str = line[6:]
                            if json_str.strip() == "[DONE]":
                                break
                            try:
                                chunk = json.loads(json_str)
                                content = chunk.get("choices", [{}])[0].get("delta", {}).get("content", "")
                                if content:
                                    yield content
                            except (json.JSONDecodeError, KeyError, IndexError):
                                continue

    async def generate_chat_title(self, messages: List[Dict[str, str]]) -> str:
    # Use a shorter version of the conversation for title generation
        conversation_summary = "\n".join([
            f"{msg['role'].upper()}: {msg['content'][:100]}" 
            for msg in messages[-3:]  # Last 3 messages
        ])
        
        title_prompt = f"Generate a concise, descriptive title (max 5 words) for this conversation:\n\n{conversation_summary}"
        
        title_messages = [{"role": "user", "content": title_prompt}]
        
        full_title = ""
        async for chunk in self.generate_response(
            messages=title_messages,
            model="nemotron-3-nano-30b-a3b:free",
            temperature=0.3,
            max_tokens=20,
            stream=True
        ):
            full_title += chunk
        
        # Clean up the title
        title = full_title.strip().strip('"').strip("'").strip()
        return title[:100]  # Limit to 100 characters