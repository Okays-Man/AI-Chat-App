// types/types.ts

export const AI_MODELS = [
  "nemotron-3-nano-30b-a3b:free",
  "devstral-2512:free",
  "kimi-k2-0905:free",
  "minimax-m2:free",
  "longcat-flash-chat:free",
  "glm-4.6:free",
  "deepseek-v3.1-terminus:free",
  "gpt-oss-120b:free",
  "deepseek-r1-0528:free"
] as const;

export type AIModel = typeof AI_MODELS[number];

export interface ChatConfig {
  model: AIModel;
  temperature: number;
  max_tokens: number;
  top_p: number;
  stream: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Chat {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface ChatMessage {
  id: number;
  content: string;
  role: 'user' | 'ai';
  created_at: string;
  chat_id: number;
}