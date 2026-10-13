import { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_TOTAL_LENGTH = 12000;
const SUPPORTED_LANGUAGES = new Set(['en', 'hi', 'te', 'ta', 'kn', 'ml', 'mr', 'gu']);

function getProviderErrorMessage(status, code) {
  if (status === 401 || code === 'invalid_api_key') {
    return 'The OpenAI API key was rejected. Check the server API key configuration.';
  }
  if (status === 429 && (code === 'insufficient_quota' || code === 'billing_hard_limit_reached' || code === 'credit_balance_exhausted')) {
    return 'The OpenAI API account has no available credits or has reached its billing limit. Add API credits or check the project budget.';
  }
  if (status === 429) {
    return 'The OpenAI API is rate-limiting requests. Wait a moment and try again.';
  }
  if (status === 404 || code === 'model_not_found') {
    return 'The configured OpenAI model is unavailable. Check OPENAI_MODEL in the server environment.';
  }
  return 'The chat provider could not complete your request. Please try again.';
}

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
router.use(requireAuth);

router.post('/', async (req, res) => {
  const { messages, language = 'en' } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return res.status(400).json({ error: `Send between 1 and ${MAX_MESSAGES} chat messages.` });
  }
  if (!SUPPORTED_LANGUAGES.has(language)) {
    return res.status(400).json({ error: 'Select a supported chat language.' });
  }

  let totalLength = 0;
  const conversation = [];
  for (const message of messages) {
    if (!message || !['user', 'assistant'].includes(message.role) ||
        typeof message.content !== 'string' ||
        !message.content.trim() ||
        message.content.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: 'Each message must contain a valid role and text of at most 4,000 characters.' });
    }
    totalLength += message.content.length;
    if (totalLength > MAX_TOTAL_LENGTH) {
      return res.status(400).json({ error: 'The conversation is too long. Start a new chat and try again.' });
    }
    conversation.push({ role: message.role, content: message.content.trim() });
  }
  if (conversation.at(-1).role !== 'user') {
    return res.status(400).json({ error: 'The latest chat message must be from the user.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'The chat assistant is not configured on this server.' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        max_completion_tokens: 600,
        messages: [
          {
            role: 'system',
            content: `You are MedCheck, an informational health-literacy assistant. The user is chatting in language code "${language}"; respond in that language. Do not diagnose, prescribe, recommend starting/stopping/changing medication, or claim access to health records. Clearly distinguish general information from personal medical advice and encourage the user to consult a qualified clinician or pharmacist. For urgent or life-threatening symptoms, advise seeking emergency care immediately.`
          },
          ...conversation
        ]
      })
    });

    if (!openAIResponse.ok) {
      let providerCode = '';
      try {
        const providerError = await openAIResponse.json();
        providerCode = providerError?.error?.code || '';
      } catch {
        // Use the HTTP status when the provider error body is not valid JSON.
      }
      console.error(`[MedCheck] OpenAI chat returned HTTP ${openAIResponse.status}${providerCode ? ` (${providerCode})` : ''}.`);
      return res.status(502).json({ error: getProviderErrorMessage(openAIResponse.status, providerCode) });
    }

    let result;
    try {
      result = await openAIResponse.json();
    } catch (error) {
      console.error('[MedCheck] OpenAI chat returned invalid JSON:', error.message);
      return res.status(502).json({ error: 'The chat provider returned an invalid response. Please try again.' });
    }

    const reply = result.choices?.[0]?.message?.content;
    if (typeof reply !== 'string' || !reply.trim()) {
      console.error('[MedCheck] OpenAI chat response did not contain a reply.');
      return res.status(502).json({ error: 'The chat provider returned an empty response. Please try again.' });
    }
    return res.json({ reply: reply.trim() });
  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'The chat provider took too long to respond. Please try again.' });
    }
    console.error('[MedCheck] OpenAI chat request failed:', error.message);
    return res.status(502).json({ error: 'The chat provider is unavailable. Please try again.' });
  } finally {
    clearTimeout(timeout);
  }
});

export default router;
