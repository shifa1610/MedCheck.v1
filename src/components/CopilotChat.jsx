import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  User, 
  Bot, 
  Lightbulb, 
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { sendChatMessages } from '../services/chatService';
import { TRANSLATIONS } from '../data/translations';

const WELCOME_MESSAGES = {
  en: 'Hello! I am the MedCheck AI Health Copilot. I can share general health information and help you prepare questions for a healthcare professional.',
  hi: 'नमस्ते! मैं मेडचेक AI स्वास्थ्य सहायक हूँ। मैं सामान्य स्वास्थ्य जानकारी दे सकता हूँ और स्वास्थ्य पेशेवर से पूछने के लिए सवाल तैयार करने में मदद कर सकता हूँ।',
  te: 'నమస్కారం! నేను మెడ్‌చెక్ AI ఆరోగ్య సహాయకుడిని. సాధారణ ఆరోగ్య సమాచారాన్ని అందించి, ఆరోగ్య నిపుణులను అడగాల్సిన ప్రశ్నలను సిద్ధం చేయడంలో సహాయపడగలను.',
  ta: 'வணக்கம்! நான் மெட்செக் AI சுகாதார உதவியாளர். பொதுவான சுகாதாரத் தகவல்களைப் பகிர்ந்து, சுகாதார நிபுணரிடம் கேட்க வேண்டிய கேள்விகளைத் தயாரிக்க உதவுவேன்.',
  kn: 'ನಮಸ್ಕಾರ! ನಾನು ಮೆಡ್‌ಚೆಕ್ AI ಆರೋಗ್ಯ ಸಹಾಯಕ. ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಮಾಹಿತಿಯನ್ನು ಹಂಚಿಕೊಂಡು, ಆರೋಗ್ಯ ತಜ್ಞರನ್ನು ಕೇಳಲು ಪ್ರಶ್ನೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.',
  ml: 'നമസ്കാരം! ഞാൻ മെഡ്‌ചെക്ക് AI ആരോഗ്യ സഹായി. പൊതുവായ ആരോഗ്യ വിവരങ്ങൾ പങ്കുവെക്കാനും ആരോഗ്യ വിദഗ്ധരോട് ചോദിക്കാനുള്ള ചോദ്യങ്ങൾ തയ്യാറാക്കാനും സഹായിക്കും.',
  mr: 'नमस्कार! मी मेडचेक AI आरोग्य सहाय्यक आहे. मी सामान्य आरोग्यविषयक माहिती देऊ शकतो आणि आरोग्यतज्ज्ञांना विचारण्यासाठी प्रश्न तयार करण्यात मदत करू शकतो.',
  gu: 'નમસ્તે! હું મેડચેક AI આરોગ્ય સહાયક છું. હું સામાન્ય આરોગ્ય માહિતી આપી શકું છું અને આરોગ્ય નિષ્ણાતને પૂછવા માટેના પ્રશ્નો તૈયાર કરવામાં મદદ કરી શકું છું.'
};

export default function CopilotChat({ language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [messages, setMessages] = useState(() => [{
    sender: 'assistant',
    text: WELCOME_MESSAGES[language] || WELCOME_MESSAGES.en
  }]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const query = (typeof textToSend === 'string' ? textToSend : inputText).trim();
    if (!query || isTyping) return;

    const userMessage = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setError('');
    setIsTyping(true);

    try {
      const history = [...messages, userMessage];
      const requestMessages = [];
      let totalLength = 0;
      for (const message of history.slice(-20).reverse()) {
        if (message.text.length + totalLength > 12000) break;
        requestMessages.push({
          role: message.sender === 'user' ? 'user' : 'assistant',
          content: message.text
        });
        totalLength += message.text.length;
      }
      const response = await sendChatMessages(requestMessages.reverse(), language);
      setMessages(prev => [...prev, { sender: 'assistant', text: response }]);
    } catch (sendError) {
      setError(sendError.message || 'The chat request failed. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[min(720px,calc(100dvh-10rem))] min-h-[360px] overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-sky-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {t.copilot.title}
              <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                OpenAI
              </span>
            </h2>
              <p className="text-xs text-slate-500">
                General health information, not a diagnosis
              </p>
          </div>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="bg-slate-100/60 p-3 border-b border-slate-200/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1 pl-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Suggestions:
        </span>
        {[
          t.copilot.quickPrompt1,
          t.copilot.quickPrompt2,
          t.copilot.quickPrompt3,
          t.copilot.quickPrompt4
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={isTyping}
            className="text-xs bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-200 px-3 py-1 rounded-full whitespace-nowrap transition-colors shadow-2xs font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" aria-live="polite">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white shadow-xs ${
                isUser ? 'bg-slate-800' : 'bg-gradient-to-br from-teal-500 to-sky-600'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                isUser 
                  ? 'bg-slate-900 text-white rounded-tr-xs' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/80 shadow-2xs'
              }`}>
                <div className="whitespace-pre-line">
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3" role="status" aria-label="Assistant is typing">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-sky-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-xs p-3.5 border border-slate-200 flex items-center gap-1.5">
              {[0, 1, 2].map(dot => (
                <span key={dot} className="h-2 w-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: `${dot * 150}ms` }} />
              ))}
            </div>
          </div>
        )}
        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <p className="mb-3 text-center text-[10px] text-slate-500">
          Chat text is sent to OpenAI. Your patient records are not shared with the chat assistant.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.copilot.placeholder}
            maxLength={4000}
            aria-label="Message the health copilot"
            className="flex-1 bg-slate-50 border border-slate-200 text-xs px-4 py-2.5 rounded-xl focus:bg-white focus:outline-hidden focus:border-teal-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>{t.copilot.send}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <ShieldAlert className="w-3 h-3 text-amber-500" />
          <span>For information only. Do not use this chat to diagnose or change medication; consult a qualified healthcare professional.</span>
        </div>
      </div>
    </div>
  );
}
