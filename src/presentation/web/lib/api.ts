import { ChatConfig } from "@/types/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const getFetchOptions = (method = 'GET', body?: any, customHeaders: Record<string, string> = {}) => {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders, 
    },
    credentials: 'include' as RequestCredentials, 
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    
    let errorData;
    try {
        errorData = await response.json();
    } catch (e) {
        errorData = { detail: response.statusText };
    }

    throw new Error(errorData.detail || errorData.message || 'An error occurred');
  }
  return response.json();
};

// --- Authentication API ---
export const auth = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, getFetchOptions('POST', { email, password }));
    return handleResponse(response);
  },

  async register(username: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/register`, getFetchOptions('POST', { username, email, password }));
    return handleResponse(response);
  },

  async checkAuth(headers: Record<string, string> = {}) {
    const response = await fetch(`${API_URL}/users/profile`, getFetchOptions('GET', undefined, headers));
    return handleResponse(response);
  },

  async logout() {
    try {
      await fetch(`${API_URL}/auth/logout`, getFetchOptions('POST'));
    } catch (error) {
      console.error("Logout failed", error);
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
};

export const chatApi = {
  async listChats(headers: Record<string, string> = {}) {
    const response = await fetch(`${API_URL}/chats/`, getFetchOptions('GET', undefined, headers));
    return handleResponse(response);
  },

  async createChat(chat: { title: string }) {
    const response = await fetch(`${API_URL}/chats/`, getFetchOptions('POST', chat));
    return handleResponse(response);
  },

  async getChatHistory(chatId: number, headers: Record<string, string> = {}) {
    if (!chatId || isNaN(chatId)) throw new Error('Invalid Chat ID');
    
    const response = await fetch(`${API_URL}/chats/${chatId}/history`, getFetchOptions('GET', undefined, headers));
    return handleResponse(response);
  },

  async deleteChat(chatId: number) {
    if (!chatId || isNaN(chatId)) throw new Error('Invalid Chat ID');

    const response = await fetch(`${API_URL}/chats/${chatId}`, getFetchOptions('DELETE'));
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to delete chat');
    }
    return true;
  },


  async sendMessageStream(chatId: number, content: string, currentConfig: ChatConfig) {
    if (!chatId || isNaN(chatId)) throw new Error('Invalid Chat ID');

    const body = {
      message: content,
      ...currentConfig 
    };

    const response = await fetch(
      `${API_URL}/chats/${chatId}/messages/stream`, 
      getFetchOptions('POST', body)
    );

    if (!response.ok) {
      if (response.status === 401) throw new Error('Unauthorized');
      throw new Error(response.statusText || 'Failed to send message');
    }

    return response;
  },
};