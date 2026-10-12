import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  User, 
  Bot, 
  HeartPulse, 
  RefreshCw, 
  Lightbulb, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { askCopilot } from '../services/aiService';
import { TRANSLATIONS } from '../data/translations';

export default function CopilotChat({ records, patient, language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: language === 'hi' 
        ? `नमस्ते ${patient?.name || ''}! मैं आपका मेडचेक (MedCheck) AI स्वास्थ्य साथी हूँ। मैंने आपके हालिया मेडिकल रिकॉर्ड्स, पर्चों और लैब टेस्ट का अध्ययन कर लिया है। आप अपनी सेहत, दवाओं के अंतर, या डॉक्टर से पूछे जाने वाले सवालों के बारे में कोई भी सवाल पूछ सकते हैं!`
        : language === 'te'
          ? `నమస్కారం ${patient?.name || ''} గారు! నేను మీ మెడ్‌చెక్ (MedCheck) AI హెల్త్ కోపైలట్‌ని. మీ ఇటీవలి ల్యాబ్ పరీక్షలు మరియు మందుల వివరాలను నేను పరిశీలించాను. మీ ఆరోగ్యం గురించి ఏదైనా అడగవచ్చు!`
          : language === 'ta'
            ? `வணக்கம் ${patient?.name || ''}! நான் உங்கள் மெட்செக் (MedCheck) AI சுகாதார வழிகாட்டி. உங்கள் சமீபத்திய ஆய்வக அறிக்கைகள் மற்றும் மருந்துச் சீட்டுகளை நான் பகுப்பாய்வு செய்துள்ளேன். உங்கள் உடல்நலம் குறித்து எது வேண்டுமானாலும் கேளுங்கள்!`
            : language === 'kn'
              ? `ನಮಸ್ಕಾರ ${patient?.name || ''}! ನಾನು ನಿಮ್ಮ ಮೆಡ್‌ಚೆಕ್ (MedCheck) AI ಆರೋಗ್ಯ ಸಹಾಯಕ. ನಿಮ್ಮ ಇತ್ತೀಚಿನ ವೈದ್ಯಕೀಯ ವರದಿಗಳು, ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳು ಮತ್ತು ಲ್ಯಾಬ್ ಪರೀಕ್ಷೆಗಳನ್ನು ನಾನು ಪರಿಶೀಲಿಸಿದ್ದೇನೆ. ನಿಮ್ಮ ಆರೋಗ್ಯ ಅಥವಾ ಔಷಧಿಗಳ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು!`
              : language === 'ml'
                ? `നമസ്കാരം ${patient?.name || ''}! ഞാൻ നിങ്ങളുടെ മെഡ്ചെക്ക് (MedCheck) AI ആരോഗ്യ സഹായിയാണ്. നിങ്ങളുടെ ഏറ്റവും പുതിയ മെഡിക്കൽ റിപ്പോർട്ടുകളും കുറിപ്പടികളും ഞാൻ വിശകലനം ചെയ്തിട്ടുണ്ട്. നിങ്ങളുടെ ആരോഗ്യത്തെക്കുറിച്ചുള്ള എന്തും ചോദിക്കാം!`
                : language === 'mr'
                  ? `नमस्कार ${patient?.name || ''}! मी आपला मेडचेक (MedCheck) AI आरोग्य साथीदार आहे. मी आपले नुकतेच वैद्यकीय रेकॉर्ड्स, औषधांच्या चिठ्ठ्या आणि लॅब चाचण्या तपासल्या आहेत. आपण आपल्या तब्येतीबद्दल किंवा औषधांबद्दल कोणताही प्रश्न विचारू शकता!`
                  : language === 'gu'
                    ? `નમસ્તે ${patient?.name || ''}! હું તમારો મેડચેક (MedCheck) AI હેલ્થ સાથી છું. મેં તમારા તાજેતરના મેડિકલ રિપોર્ટ્સ, પ્રિસ્ક્રિપ્શન્સ અને લેબ ટેસ્ટનો અભ્યાસ કર્યો છે. તમે તમારા સ્વાસ્થ્ય અથવા દવાઓ અંગે કોઈપણ પ્રશ્ન પૂછી શકો છો!`
                    : `Hello ${patient?.name || 'there'}! I am your MedCheck AI Health Copilot. I have analyzed your complete health timeline, active medications, and recent lab panels. How can I assist you or your family with your health today?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMessage = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const response = await askCopilot(query, records, patient, language);
      setMessages(prev => [...prev, { sender: 'assistant', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        sender: 'assistant', 
        text: 'I apologize, but I encountered a momentary connection issue. Please feel free to try again.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[750px] overflow-hidden">
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
                Context-Aware
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {t.copilot.subtitle}
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 hidden sm:block">
          Records in memory: <span className="font-semibold text-slate-800">{records.length} files</span>
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
            className="text-xs bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-200 px-3 py-1 rounded-full whitespace-nowrap transition-colors shadow-2xs font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-sky-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-xs p-3.5 border border-slate-200 flex items-center gap-2 text-xs text-slate-500">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
              <span>MedCheck Copilot is reviewing your records...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-200 bg-white">
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
          <span>Informational health companion. Always consult your doctor before modifying medication doses.</span>
        </div>
      </div>
    </div>
  );
}
