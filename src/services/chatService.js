import { getAuthToken } from '../utils/auth.js';

const API_BASE_URL = `${import.meta.env?.VITE_API_URL || ''}/api`;

export async function sendChatMessages(messages, language = 'en') {
  const token = getAuthToken();
  if (!token) {
    throw new Error('A server-authenticated account is required to use the AI chat. Please sign in while the backend is available.');
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages, language })
    });
  } catch {
    throw new Error('Could not reach the chat service. Check your connection and try again.');
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error(`The chat service returned an invalid response (HTTP ${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(result.error || `The chat request failed (HTTP ${response.status}).`);
  }
  if (typeof result.reply !== 'string' || !result.reply.trim()) {
    throw new Error('The chat service returned an empty response. Please try again.');
  }
  return result.reply.trim();
}
