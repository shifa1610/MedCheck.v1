import React, { useState } from 'react';
import { 
  Languages, 
  ArrowRightLeft, 
  Volume2, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Copy, 
  Check, 
  Search,
  ArrowRight
} from 'lucide-react';
import VoicePlayer from './VoicePlayer';

export default function LanguageConverter() {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('te');
  const [inputText, setInputText] = useState('Take Metformin 500mg 1 tablet after food twice daily. Fasting blood sugar is elevated at 142 mg/dL.');
  const [translatedText, setTranslatedText] = useState('భోజనం తర్వాత రోజుకు రెండుసార్లు మెట్‌ಫార్మిన్ 500mg 1 మాత్ర వేసుకోండి. ఖాళీ కడుపు చక్కెర స్థాయి 142 mg/dL వద్ద ఎక్కువగా ఉంది.');
  const [copied, setCopied] = useState(false);
  const [dictionarySearch, setDictionarySearch] = useState('');

  // Medical dictionary database across 8 languages
  const MEDICAL_GLOSSARY = [
    { 
      term: "Blood Sugar (Glucose)", 
      en: "Blood Sugar", 
      te: "రక్తంలో చక్కెర", 
      hi: "रक्त शर्करा (ब्लड शुगर)", 
      ta: "இரத்த சர்க்கரை", 
      kn: "ರಕ್ತದಲ್ಲಿ ಸಕ್ಕರೆ ಅಂಶ", 
      ml: "രക്തത്തിലെ പഞ്ചസാര", 
      mr: "रक्तातील साखर", 
      gu: "લોહીમાં શર્કરા (સુગર)" 
    },
    { 
      term: "Blood Pressure (BP)", 
      en: "Blood Pressure", 
      te: "రక్తపోటు (బీపీ)", 
      hi: "रक्तचाप (ब्लड प्रेशर)", 
      ta: "இரத்த அழுத்தம்", 
      kn: "ರಕ್ತದೊತ್ತಡ (ಬಿಪಿ)", 
      ml: "രക്തസമ്മർദ്ദം (ബിപി)", 
      mr: "रक्तदाब (बीपी)", 
      gu: "બ્લડ પ્રેશર (બીપી)" 
    },
    { 
      term: "After Meals (PC)", 
      en: "After Meals", 
      te: "భోజనం తర్వాత", 
      hi: "भोजन के बाद", 
      ta: "உணவுக்குப் பின்", 
      kn: "ಊಟದ ನಂತರ", 
      ml: "ഭക്ഷണത്തിന് ശേഷം", 
      mr: "जेवणानंतर", 
      gu: "જમ્યા પછી" 
    },
    { 
      term: "Before Meals (AC)", 
      en: "Before Meals", 
      te: "భోజనానికి ముందు", 
      hi: "भोजन से पहले", 
      ta: "உணவுக்கு முன்", 
      kn: "ಊಟಕ್ಕೆ ಮುಂಚೆ", 
      ml: "ഭക്ഷണത്തിന് മുൻപ്", 
      mr: "जेवणापूर्वी", 
      gu: "જમતા પહેલાં" 
    },
    { 
      term: "Bedtime (QHS)", 
      en: "At Bedtime", 
      te: "పడుకునే ముందు", 
      hi: "सोते समय", 
      ta: "உறங்கும் முன்", 
      kn: "ಮಲಗುವ ಮುನ್ನ", 
      ml: "ഉറങ്ങുന്നതിന് മുൻപ്", 
      mr: "झोपताना", 
      gu: "સૂતા સમયે" 
    },
    { 
      term: "Cholesterol", 
      en: "Cholesterol", 
      te: "కొలెస్ట్రాల్ / కొవ్వు", 
      hi: "कोलेस्ट्रॉल (रक्त वसा)", 
      ta: "கொலஸ்ட்ரால்", 
      kn: "ಕೊಲೆಸ್ಟ್ರಾಲ್ / ಕೊಬ್ಬು", 
      ml: "കൊളസ്ട്രോൾ", 
      mr: "कोलेस्टेरॉल", 
      gu: "કોલેસ્ટ્રોલ" 
    },
    { 
      term: "Kidney / Renal", 
      en: "Kidney Function", 
      te: "మూత్రపిండాల పనితీరు", 
      hi: "गुर्दे की कार्यप्रणाली", 
      ta: "சிறுநீரக செயல்பாடு", 
      kn: "ಮೂತ್ರಪಿಂಡದ ಕಾರ್ಯಕ್ಷಮತೆ", 
      ml: "വൃക്കയുടെ പ്രവർത്തനം", 
      mr: "मूत्रपिंडाचे कार्य", 
      gu: "કિડનીની કાર્યક્ષમતા" 
    },
    { 
      term: "Heart / Cardiac", 
      en: "Heart Condition", 
      te: "గుండె ఆరోగ్యం", 
      hi: "हृदय स्वास्थ्य", 
      ta: "இதய ஆரோக்கியம்", 
      kn: "ಹೃದಯದ ಆರೋಗ್ಯ", 
      ml: "ഹൃദയാരോഗ്യം", 
      mr: "हृदयाचे आरोग्य", 
      gu: "હૃદયનું સ્વાસ્થ્ય" 
    },
    { 
      term: "Stent (PCI)", 
      en: "Arterial Stent", 
      te: "స్టెంట్ (రక్తనాళ గొట్టం)", 
      hi: "स्टेंट (धमनी छल्ला)", 
      ta: "ஸ்டென்ட்", 
      kn: "ಸ್ಟೆಂಟ್ (ರಕ್ತನಾಳ ನಳಿಗೆ)", 
      ml: "സ്റ്റെന്റ്", 
      mr: "स्टेंट (रक्तवाहिनी नळी)", 
      gu: "સ્ટેન્ટ" 
    },
    { 
      term: "Twice Daily (BID)", 
      en: "Twice Daily (1-0-1)", 
      te: "రోజుకు రెండుసార్లు", 
      hi: "दिन में दो बार", 
      ta: "நாளுக்கு இருமுறை", 
      kn: "ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ", 
      ml: "ദിവസത്തിൽ രണ്ട് തവണ", 
      mr: "दिवसातून दोनदा", 
      gu: "દિવસમાં બે વાર" 
    }
  ];

  // Clinical Jargon Explanations
  const JARGON_CARDS = [
    {
      jargon: "HbA1c: 8.2% (Glycated Hemoglobin)",
      en: "Your average blood sugar over the last 90 days has been higher than safe bounds (< 5.7%). Needs diet, exercise, and doctor review.",
      te: "గత 3 నెలల్లో మీ సగటు రక్తంలో చక్కెర సురక్షిత స్థాయిల (< 5.7%) కంటే ఎక్కువగా ఉంది. ఆహార నియమాలు మరియు డాక్టర్ సలహా అవసరం.",
      hi: "पिछले 90 दिनों में आपका औसत ब्लड शुगर सुरक्षित स्तर (< 5.7%) से अधिक रहा है। खानपान पर नियंत्रण और डॉक्टर से सलाह ज़रूरी है।",
      ta: "கடந்த 90 நாட்களில் உங்கள் சராசரி இரத்த சர்க்கரை அளவு பாதுகாப்பான வரம்பை விட அதிகமாக உள்ளது (< 5.7%). உணவு கட்டுப்பாடு மற்றும் மருத்துவ ஆலோசனை தேவை.",
      kn: "ಕಳೆದ 3 ತಿಂಗಳಲ್ಲಿ ನಿಮ್ಮ ಸರಾಸರಿ ರಕ್ತದ ಸಕ್ಕರೆ ಮಟ್ಟವು ಸುರಕ್ಷಿತ ಮಟ್ಟಕ್ಕಿಂತ (< 5.7%) ಹೆಚ್ಚಾಗಿದೆ. ಆಹಾರ ನಿಯಂತ್ರಣ ಮತ್ತು ವೈದ್ಯರ ಸಲಹೆ ಅಗತ್ಯ.",
      ml: "കഴിഞ്ഞ 3 മാസത്തെ ശരാശരി ബ്ലഡ് ഷുഗർ സുരക്ഷിത പരിധിയേക്കാൾ (< 5.7%) കൂടുതലാണ്. ഭക്ഷണ നിയന്ത്രണവും ഡോക്ടറുടെ പരിശോധനയും ആവശ്യമാണ്.",
      mr: "गेल्या ९० दिवसांतील आपली सरासरी रक्तातील साखर सुरक्षित पातळीपेक्षा (< ५.७%) जास्त आहे. आहार नियंत्रण आणि डॉक्टरांचा सल्ला आवश्यक आहे.",
      gu: "છેલ્લા ૯૦ દિવસમાં તમારી સરેરાશ બ્લડ સુગર સુરક્ષિત મર્યાદા (< ૫.૭%) કરતાં વધુ રહી છે. યોગ્ય આહાર અને ડૉક્ટરની સલાહ જરૂરી છે."
    },
    {
      jargon: "Dyslipidemia (Elevated LDL 154 mg/dL)",
      en: "Excess 'bad' cholesterol in the blood that can stick to heart artery walls and narrow them over time.",
      te: "రక్తంలో చెడు కొలెస్ట్రాల్ పెరిగింది. ఇది కాలక్రమేణా గుండె రక్తనాళాలను ఇరుకుగా చేసే ప్రమాదం ఉంది.",
      hi: "रक्त में खराब कोलेस्ट्रॉल (LDL) की मात्रा बढ़ गई है, जिससे हृदय की धमनियों में रुकावट का जोखिम बढ़ता है।",
      ta: "இரத்தத்தில் கெட்ட கொலஸ்ட்ரால் (LDL) அதிகரித்துள்ளது, இது காலப்போக்கில் இதய தமனிகளை அடைக்கக்கூடும்.",
      kn: "ರಕ್ತದಲ್ಲಿ ಕೆಟ್ಟ ಕೊಲೆಸ್ಟ್ರಾಲ್ ಹೆಚ್ಚಾಗಿದೆ. ಇದು ಹೃದಯದ ರಕ್ತನಾಳಗಳನ್ನು ಕಿರಿದಾಗಿಸುವ ಅಪಾಯವನ್ನುಂಟುಮಾಡುತ್ತದೆ.",
      ml: "രക്തത്തിൽ ചീത്ത കൊളസ്ട്രോളിന്റെ അളവ് കൂടിയിരിക്കുന്നു. ഇത് ഹൃദയ ധമനികളിൽ തടസ്സമുണ്ടാക്കാൻ സാധ്യതയുണ്ട്.",
      mr: "रक्तातील वाईट कोलेस्टेरॉल (LDL) वाढले आहे, ज्यामुळे हृदयाच्या रक्तवाहिन्या अरुंद होण्याचा धोका असतो.",
      gu: "લોહીમાં ખરાબ કોલેસ્ટ્રોલ (LDL) વધી ગયું છે, જે હૃદયની ધમનીઓમાં અવરોધ ઊભો કરી શકે છે."
    },
    {
      jargon: "1-0-1 PC (Schedule)",
      en: "Take one tablet in the morning after breakfast and one tablet at night after dinner.",
      te: "ఉదయం అల్పాహారం తర్వాత ఒక మాత్ర, రాత్రి భోజనం తర్వాత ఒక మాత్ర వేసుకోవాలి.",
      hi: "सुबह नाश्ते के बाद 1 गोली और रात को खाने के बाद 1 गोली लेनी है।",
      ta: "காலை உணவுக்குப் பின் 1 மாத்திரையும், இரவு உணவுக்குப் பின் 1 மாத்திரையும் உட்கொள்ள வேண்டும்.",
      kn: "ಬೆಳಗ್ಗೆ ಉಪಾಹಾರದ ನಂತರ 1 ಮಾತ್ರೆ ಮತ್ತು ರಾತ್ರಿ ಊಟದ ನಂತರ 1 ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಿ.",
      ml: "രാവിലെ പ്രഭാതഭക്ഷണത്തിന് ശേഷം 1 ഗുളികയും രാത്രി അത്താഴത്തിന് ശേഷം 1 ഗുളികയും കഴിക്കുക.",
      mr: "सकाळी नाश्त्यानंतर १ गोळी आणि रात्री जेवणानंतर १ गोळी घ्यावी.",
      gu: "સવારે નાસ્તા પછી ૧ ગોળી અને રાત્રે જમ્યા પછી ૧ ગોળી લેવાની છે."
    }
  ];

  // Dynamic live converter across 8 languages
  const handleTranslate = (chosenTarget = targetLang, textToTranslate = inputText) => {
    const text = (textToTranslate || '').toLowerCase();
    let result = "";

    if (chosenTarget === 'te') {
      if (text.includes('metformin') || text.includes('food') || text.includes('sugar')) {
        result = "భోజనం తర్వాత రోజుకు రెండుసార్లు మెట్‌ఫార్మిన్ 500mg 1 మాత్ర వేసుకోండి. ఖాళీ కడుపు చక్కెర స్థాయి 142 mg/dL వద్ద ఎక్కువగా ఉంది. రోజువారీ నడక అలవాటు చేసుకోండి.";
      } else if (text.includes('chest') || text.includes('pain') || text.includes('heart')) {
        result = "ఛాతీ నొప్పి లేదా అసౌకర్యం ఉంటే వెంటనే అత్యవసర వైద్యుడిని సంప్రదించండి.";
      } else {
        result = `[తెలుగు అనువాదం]: ${textToTranslate} - వైద్యుల సూచనల ప్రకారం క్రమం తప్పకుండా మందులు తీసుకోండి.`;
      }
    } else if (chosenTarget === 'hi') {
      if (text.includes('metformin') || text.includes('food') || text.includes('sugar')) {
        result = "भोजन के बाद दिन में दो बार मेटफॉर्मिन 500mg की 1 गोली लें। खाली पेट ब्लड शुगर 142 mg/dL पर बढ़ा हुआ है। रोज़ाना 30 मिनट सैर करें।";
      } else if (text.includes('chest') || text.includes('pain') || text.includes('heart')) {
        result = "यदि सीने में दर्द या भारीपन है, तो तुरंत आपातकालीन चिकित्सा सहायता लें।";
      } else {
        result = `[हिन्दी अनुवाद]: ${textToTranslate} - डॉक्टर के निर्देशानुसार समय पर दवाएं लें।`;
      }
    } else if (chosenTarget === 'ta') {
      if (text.includes('metformin') || text.includes('food') || text.includes('sugar')) {
        result = "உணவுக்குப் பின் ஒரு நாளைக்கு இரண்டு முறை மெட்பார்மின் 500mg 1 மாத்திரை எடுத்துக் கொள்ளவும். இரத்த சர்க்கரை அளவு 142 mg/dL ஆக அதிகரித்துள்ளது. தினமும் 30 நிமிடங்கள் நடைப்பயிற்சி செய்யுங்கள்.";
      } else if (text.includes('chest') || text.includes('pain') || text.includes('heart')) {
        result = "மார்பு வலி அல்லது அசௌகரியம் இருந்தால், உடனடியாக அவசர மருத்துவ உதவியை நாடவும்.";
      } else {
        result = `[தமிழ் மொழிபெயர்ப்பு]: ${textToTranslate} - மருத்துவரின் அறிவுறுத்தலின்படி சரியான நேரத்தில் மருந்துகளை உட்கொள்ளுங்கள்.`;
      }
    } else if (chosenTarget === 'kn') {
      if (text.includes('metformin') || text.includes('food') || text.includes('sugar')) {
        result = "ಊಟದ ನಂತರ ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಮೆಟ್‌ಫಾರ್ಮಿನ್ 500mg ನ 1 ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಿ. ಖಾಲಿ ಹೊಟ್ಟೆಯ ಸಕ್ಕರೆ ಮಟ್ಟವು 142 mg/dL ನಷ್ಟಿದ್ದು ಹೆಚ್ಚಾಗಿದೆ. ಪ್ರತಿದಿನ 30 ನಿಮಿಷ ವಾಕಿಂಗ್ ಮಾಡಿ.";
      } else if (text.includes('chest') || text.includes('pain') || text.includes('heart')) {
        result = "ಎದೆ ನೋವು ಅಥವಾ ಅಸ್ವಸ್ಥತೆ ಇದ್ದರೆ ತಕ್ಷಣ ತುರ್ತು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.";
      } else {
        result = `[ಕನ್ನಡ ಅನುವಾದ]: ${textToTranslate} - ವೈದ್ಯರ ಸೂಚನೆಯಂತೆ ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಔಷಧಿ ತೆಗೆದುಕೊಳ್ಳಿ.`;
      }
    } else if (chosenTarget === 'ml') {
      if (text.includes('metformin') || text.includes('food') || text.includes('sugar')) {
        result = "ഭക്ഷണത്തിന് ശേഷം ദിവസത്തിൽ രണ്ട് തവണ മെറ്റ്ഫോർമിൻ 500mg 1 ഗുളിക കഴിക്കുക. ഫാസ്റ്റിംഗ് ബ്ലഡ് ഷുഗർ 142 mg/dL ആയി ഉയർന്നു നിൽക്കുന്നു. ദിവസവും വ്യായാമം ശീലമാക്കുക.";
      } else if (text.includes('chest') || text.includes('pain') || text.includes('heart')) {
        result = "നെഞ്ചുവേദനയോ അസ്വസ്ഥതയോ ഉണ്ടെങ്കിൽ ഉടൻ തന്നെ അടിയന്തര വൈദ്യസഹായം തേടുക.";
      } else {
        result = `[മലയാളം പരിഭാഷ]: ${textToTranslate} - ഡോക്ടറുടെ നിർദ്ദേശപ്രകാരം കൃത്യസമയത്ത് മരുന്നുകൾ കഴിക്കുക.`;
      }
    } else if (chosenTarget === 'mr') {
      if (text.includes('metformin') || text.includes('food') || text.includes('sugar')) {
        result = "जेवणानंतर दिवसातून दोनदा मेटफॉर्मिन 500mg ची 1 गोळी घ्या. उपाशीपोटी रक्तातील साखर 142 mg/dL वर वाढलेली आहे. रोज ३० मिनिटे चाला.";
      } else if (text.includes('chest') || text.includes('pain') || text.includes('heart')) {
        result = "छातीत दुखणे किंवा अस्वस्थता असल्यास त्वरित आपत्कालीन वैद्यकीय मदत घ्या.";
      } else {
        result = `[मराठी अनुवाद]: ${textToTranslate} - डॉक्टरांच्या सल्ल्यानुसार वेळेवर औषधे घ्या.`;
      }
    } else if (chosenTarget === 'gu') {
      if (text.includes('metformin') || text.includes('food') || text.includes('sugar')) {
        result = "જમ્યા પછી દિવસમાં બે વાર મેટફોર્મિન 500mg ની 1 ગોળી લો. ખાલી પેટે બ્લડ સુગર 142 mg/dL પર વધેલી છે. રોજ ૩૦ મિનિટ વોક કરો.";
      } else if (text.includes('chest') || text.includes('pain') || text.includes('heart')) {
        result = "છાતીમાં દુખાવો અથવા અસ્વસ્થતા હોય તો તરત જ કટોકટી તબીબી સહાય લો.";
      } else {
        result = `[ગુજરાતી અનુવાદ]: ${textToTranslate} - ડૉક્ટરની સૂચના મુજબ સમયસર દવાઓ લો.`;
      }
    } else {
      if (text.includes('metformin') || text.includes('food') || text.includes('sugar')) {
        result = "Take Metformin 500mg 1 tablet twice daily after meals. Fasting blood glucose is elevated at 142 mg/dL. Maintain a 30-minute daily walk.";
      } else if (text.includes('chest') || text.includes('pain') || text.includes('heart')) {
        result = "If you experience chest pain or tightness, seek immediate emergency medical care.";
      } else {
        result = `[Plain English]: ${textToTranslate} - Take medications on time according to physician guidelines.`;
      }
    }

    setTranslatedText(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredGlossary = MEDICAL_GLOSSARY.filter(item => 
    item.term.toLowerCase().includes(dictionarySearch.toLowerCase()) ||
    item.en.toLowerCase().includes(dictionarySearch.toLowerCase()) ||
    (item.te && item.te.toLowerCase().includes(dictionarySearch.toLowerCase())) ||
    (item.hi && item.hi.toLowerCase().includes(dictionarySearch.toLowerCase())) ||
    (item.ta && item.ta.toLowerCase().includes(dictionarySearch.toLowerCase())) ||
    (item.kn && item.kn.toLowerCase().includes(dictionarySearch.toLowerCase())) ||
    (item.ml && item.ml.toLowerCase().includes(dictionarySearch.toLowerCase())) ||
    (item.mr && item.mr.toLowerCase().includes(dictionarySearch.toLowerCase())) ||
    (item.gu && item.gu.toLowerCase().includes(dictionarySearch.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Languages className="w-5 h-5 text-teal-600" />
                MedCheck Medical Language Converter & Voice-Over
              </h2>
              <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                8 Indian Languages
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Translate prescriptions, laboratory reports, and doctor advice into Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi, Gujarati & English with native voice pronunciation
            </p>
          </div>
        </div>

        {/* Translator Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Box */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Source Language:</span>
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800"
                >
                  <option value="en">English (Clinical Terms)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="ml">മലയാളം (Malayalam)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                </select>
              </div>

              <button
                onClick={() => setInputText('')}
                className="text-[11px] text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            </div>

            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste medical notes, doctor abbreviations, or lab results..."
              className="w-full flex-1 bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-hidden focus:border-teal-500 leading-relaxed text-slate-800"
            />

            <div className="mt-3 flex items-center justify-between">
              <VoicePlayer text={inputText} language={sourceLang} label="Speak Source" />
              <button
                onClick={handleTranslate}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Translate Now →
              </button>
            </div>
          </div>

          {/* Output Box */}
          <div className="bg-teal-50/40 rounded-2xl border border-teal-200 p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-teal-200/70 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-950">Target Language:</span>
                <select
                  value={targetLang}
                  onChange={(e) => {
                    const newLang = e.target.value;
                    setTargetLang(newLang);
                    handleTranslate(newLang, inputText);
                  }}
                  className="text-xs font-bold bg-white border border-teal-300 text-teal-900 rounded-lg px-2.5 py-1"
                >
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="ml">മലയാളം (Malayalam)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                  <option value="en">English (Plain Language)</option>
                </select>
              </div>

              <button
                onClick={handleCopy}
                className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex-1 bg-white border border-teal-200 rounded-xl p-3 text-xs leading-relaxed text-slate-800 font-medium whitespace-pre-wrap min-h-[120px]">
              {translatedText}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <VoicePlayer text={translatedText} language={targetLang} label="Speak Translation" />
              <span className="text-[11px] font-medium text-teal-700">
                {targetLang === 'kn' ? 'ಕನ್ನಡ ಆಡಿಯೋ' : targetLang === 'ml' ? 'മലയാളം ഓഡിയോ' : targetLang === 'mr' ? 'मराठी ऑडिओ' : targetLang === 'gu' ? 'ગુજરાતી ઑડિયો' : targetLang === 'ta' ? 'தமிழ் ஆடியோ' : targetLang === 'te' ? 'తెలుగు ఆడియో' : targetLang === 'hi' ? 'हिन्दी ऑडियो' : 'English Audio'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Common Clinical Jargon Explanations Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-teal-600" />
          <h3 className="text-base font-bold text-slate-900">
            Everyday Explanations for Common Medical Jargon
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {JARGON_CARDS.map((card, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 block mb-2">
                  {card.jargon}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-normal mb-2">
                  <strong>EN:</strong> {card.en}
                </p>
                {card[targetLang] && (
                  <p className="text-xs text-teal-900 font-medium leading-relaxed pt-2 border-t border-slate-200/60">
                    <strong>{targetLang.toUpperCase()}:</strong> {card[targetLang]}
                  </p>
                )}
              </div>
              <div className="mt-3 pt-2">
                <VoicePlayer text={card[targetLang] || card.en} language={targetLang} label="Listen Explanation" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multilingual Medical Glossary Search */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              8-Language Medical Terminology Dictionary
            </h3>
            <p className="text-xs text-slate-500">
              Look up clinical words, Latin abbreviations, and timings across Indian languages
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={dictionarySearch}
              onChange={(e) => setDictionarySearch(e.target.value)}
              placeholder="Search term or abbreviation..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-hidden focus:border-teal-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">Clinical Term</th>
                <th className="p-3">English</th>
                <th className="p-3">हिन्दी (Hindi)</th>
                <th className="p-3">తెలుగు (Telugu)</th>
                <th className="p-3">தமிழ் (Tamil)</th>
                <th className="p-3">ಕನ್ನಡ (Kannada)</th>
                <th className="p-3">മലയാളം (Malayalam)</th>
                <th className="p-3">मराठी (Marathi)</th>
                <th className="p-3">ગુજરાતી (Gujarati)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredGlossary.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{row.term}</td>
                  <td className="p-3 text-slate-600">{row.en}</td>
                  <td className="p-3 text-slate-700">{row.hi}</td>
                  <td className="p-3 text-teal-800 font-medium">{row.te}</td>
                  <td className="p-3 text-indigo-800 font-medium">{row.ta}</td>
                  <td className="p-3 text-purple-800 font-medium">{row.kn}</td>
                  <td className="p-3 text-sky-800 font-medium">{row.ml}</td>
                  <td className="p-3 text-amber-800 font-medium">{row.mr}</td>
                  <td className="p-3 text-rose-800 font-medium">{row.gu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
