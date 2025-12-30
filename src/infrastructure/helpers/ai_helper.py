import json
from typing import List, Dict

def format_messages_for_api(messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
    """Format messages to match the API expected format"""
    formatted = []
    for msg in messages:
        formatted.append({
            "role": msg["role"],
            "content": msg["content"]
        })
    return formatted

def parse_ai_response_chunk(chunk: str) -> str:
    """Parse a single chunk from the AI response stream"""
    try:
        if chunk.startswith("data: "):
            json_str = chunk[6:].strip()
            if json_str == "[DONE]":
                return ""
            
            data = json.loads(json_str)
            return data.get("choices", [{}])[0].get("delta", {}).get("content", "")
    except (json.JSONDecodeError, KeyError, IndexError):
        return ""
    
    return ""