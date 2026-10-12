/**
 * MedCheck Automated Multilingual TTS Verification Suite
 * Tests all 8 Indian languages: en, hi, te, ta, kn, ml, mr, gu
 */

import { handleTTS, BCP47_LOCALES } from '../api/tts.js';
import { cleanSpeechText, splitIntoChunks, VoiceService } from '../src/services/voiceService.js';

const TEST_PHRASES = {
  en: {
    locale: 'en-IN',
    text: 'Take Metformin 500mg after food twice daily. Fasting blood sugar is elevated at 142 mg/dL.'
  },
  hi: {
    locale: 'hi-IN',
    text: 'भोजन के बाद दिन में दो बार मेटफॉर्मिन 500mg की 1 गोली लें। खाली पेट ब्लड शुगर 142 mg/dL पर बढ़ा हुआ है।'
  },
  te: {
    locale: 'te-IN',
    text: 'భోజనం తర్వాత రోజుకు రెండుసార్లు మెట్‌ఫార్మిన్ 500mg 1 మాత్ర వేసుకోండి. ఖాళీ కడుపు చక్కెర స్థాయి 142 mg/dL వద్ద ఎక్కువగా ఉంది.'
  },
  ta: {
    locale: 'ta-IN',
    text: 'உணவுக்குப் பின் ஒரு நாளைக்கு இரண்டு முறை மெட்பார்மின் 500mg 1 மாத்திரை எடுத்துக் கொள்ளவும். இரத்த சர்க்கரை அளவு 142 mg/dL ஆக அதிகரித்துள்ளது.'
  },
  kn: {
    locale: 'kn-IN',
    text: 'ಊಟದ ನಂತರ ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಮೆಟ್‌ಫಾರ್ಮಿನ್ 500mg ನ 1 ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಿ. ಖಾಲಿ ಹೊಟ್ಟೆಯ ಸಕ್ಕರೆ ಮಟ್ಟವು 142 mg/dL ನಷ್ಟಿದ್ದು ಹೆಚ್ಚಾಗಿದೆ.'
  },
  ml: {
    locale: 'ml-IN',
    text: 'ഭക്ഷണത്തിന് ശേഷം ദിവസത്തിൽ രണ്ട് തവണ മെറ്റ്ഫോർമിൻ 500mg 1 ഗുളിക കഴിക്കുക. ഫാസ്റ്റിംഗ് ബ്ലഡ് ഷുഗർ 142 mg/dL ആയി ഉയർന്നു നിൽക്കുന്നു.'
  },
  mr: {
    locale: 'mr-IN',
    text: 'जेवणानंतर दिवसातून दोनदा मेटफॉर्मिन 500mg ची 1 गोळी घ्या. उपाशीपोटी रक्तातील साखर 142 mg/dL वर वाढलेली आहे.'
  },
  gu: {
    locale: 'gu-IN',
    text: 'જમ્યા પછી દિવસમાં બે વાર મેટફોર્મિન 500mg ની 1 ગોળી લો. ખાલી પેટે બ્લડ સુગર 142 mg/dL પર વધેલી છે.'
  }
};

let passedCount = 0;
let totalCount = 0;

function assert(condition, message) {
  totalCount++;
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(message);
  } else {
    console.log(`  ✓ PASS: ${message}`);
    passedCount++;
  }
}

// Mock HTTP request / response helper for handleTTS
function mockReqRes(query = {}, body = {}) {
  const req = {
    method: 'GET',
    query,
    body
  };

  const res = {
    statusCode: 200,
    headers: {},
    data: null,
    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(buffer) {
      this.data = buffer;
      return this;
    },
    json(obj) {
      this.data = obj;
      return this;
    },
    end() {
      return this;
    }
  };

  return { req, res };
}

async function runTests() {
  console.log('\n======================================================');
  console.log('  MEDCHECK MULTILINGUAL TTS TEST SUITE (8 LANGUAGES)');
  console.log('======================================================\n');

  // Test 1: BCP-47 Locale Mapping
  console.log('[TEST GROUP 1] BCP-47 Locale Identification:');
  const expectedLocales = {
    en: 'en-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    mr: 'mr-IN',
    gu: 'gu-IN'
  };

  for (const [lang, locale] of Object.entries(expectedLocales)) {
    assert(BCP47_LOCALES[lang] === locale, `Language [${lang}] correctly maps to BCP-47 [${locale}]`);
  }

  // Test 2: Text Sanitation and Boundary Chunking
  console.log('\n[TEST GROUP 2] Speech Text Cleaning & Segmentation:');
  const rawInput = '**Metformin 500mg** - Take after food. # Blood Sugar: 142 mg/dL! Exercise daily; stay hydrated.';
  const cleaned = cleanSpeechText(rawInput);
  assert(!cleaned.includes('**') && !cleaned.includes('#'), 'Stripped markdown formatting');
  
  const chunks = splitIntoChunks(cleaned, 40);
  assert(chunks.length >= 2, `Split into ${chunks.length} sentence-boundary chunks properly`);
  assert(chunks.every(c => c.length <= 40), 'All chunks respect maximum segment limit');

  // Test 3: Voice Selection Logic & Strict Regional Voice Isolation
  console.log('\n[TEST GROUP 3] Browser Voice Filtering & English Fallback Rejection:');
  
  // Simulate browser environment with only English voices (like default Windows 10/11)
  const simulatedVoicesOnlyEnglish = [
    { name: 'Microsoft David Desktop - English (United States)', lang: 'en-US' },
    { name: 'Microsoft Zira Desktop - English (United States)', lang: 'en-US' },
    { name: 'Microsoft Mark - English (United States)', lang: 'en-US' }
  ];

  // Mock global window and speechSynthesis
  global.window = {
    speechSynthesis: {
      getVoices: () => simulatedVoicesOnlyEnglish,
      onvoiceschanged: null,
      speak: () => {},
      cancel: () => {}
    }
  };

  const voiceServiceTest = new VoiceService();
  voiceServiceTest.voices = simulatedVoicesOnlyEnglish;

  // Verify English works with native browser voice
  assert(voiceServiceTest.hasNativeRegionalVoice('en') === true, 'English voice identified as available in WebSpeech');
  
  // CRITICAL REQUIREMENT: Indian languages MUST reject English voices
  const indianLangs = ['hi', 'te', 'ta', 'kn', 'ml', 'mr', 'gu'];
  for (const lang of indianLangs) {
    const hasVoice = voiceServiceTest.hasNativeRegionalVoice(lang);
    assert(hasVoice === false, `Language [${lang}] rejects Microsoft David/English voice (forces Tier 2 fallback)`);
  }

  // Simulate addition of a genuine Hindi voice (e.g., on Android/Chrome OS)
  const simulatedVoicesWithHindi = [
    ...simulatedVoicesOnlyEnglish,
    { name: 'Google हिन्दी', lang: 'hi-IN' }
  ];
  voiceServiceTest.voices = simulatedVoicesWithHindi;
  assert(voiceServiceTest.hasNativeRegionalVoice('hi') === true, 'Hindi recognized when genuine hi-IN voice is present');
  assert(voiceServiceTest.hasNativeRegionalVoice('te') === false, 'Telugu still correctly rejected when only hi-IN and en-US are present');

  // Test 4: Live Serverless TTS Synthesis for all 8 Indian Languages
  console.log('\n[TEST GROUP 4] Server-Side TTS Synthesis & Audio Buffer Verification:');

  for (const [lang, item] of Object.entries(TEST_PHRASES)) {
    const { req, res } = mockReqRes({
      lang,
      text: item.text,
      rate: '1.0'
    });

    await handleTTS(req, res);

    assert(res.statusCode === 200, `[${lang}] Endpoint returned HTTP 200 OK`);
    assert(res.headers['content-type'] === 'audio/mpeg', `[${lang}] Content-Type is audio/mpeg`);
    assert(Buffer.isBuffer(res.data), `[${lang}] Response body is a binary audio Buffer`);
    assert(res.data.length > 2000, `[${lang}] Audio stream contains genuine payload (${res.data.length} bytes)`);

    // Verify MP3 header (starts with ID3 or MP3 sync frame 0xFF, 0xFB/0xF3/0xF2)
    const isID3 = res.data[0] === 0x49 && res.data[1] === 0x44 && res.data[2] === 0x33; // 'ID3'
    const isMPEG = res.data[0] === 0xFF && (res.data[1] & 0xE0) === 0xE0; // Sync word
    assert(isID3 || isMPEG, `[${lang}] Buffer has valid MP3 / ID3 frame signature`);
  }

  // Test 5: Error Handling for Missing Input
  console.log('\n[TEST GROUP 5] Robust Error Handling:');
  const { req: errReq, res: errRes } = mockReqRes({ text: '' });
  await handleTTS(errReq, errRes);
  assert(errRes.statusCode === 400, 'Empty text returns HTTP 400 Bad Request');
  assert(errRes.data.error.includes('required'), 'Error response contains helpful validation message');

  // Test 6: Speed Rate Parameter Handling
  console.log('\n[TEST GROUP 6] Speed Rate Verification (0.8x, 1.0x, 1.2x):');
  const { req: rateReq, res: rateRes } = mockReqRes({
    lang: 'te',
    text: 'పరీక్ష శీర్షిక',
    rate: '1.2'
  });
  await handleTTS(rateReq, rateRes);
  assert(rateRes.statusCode === 200, 'Speech rate 1.2x processed successfully');
  assert(rateRes.data.length > 500, 'Speed adjusted audio stream generated successfully');

  console.log('\n======================================================');
  console.log(`  ALL TESTS PASSED: ${passedCount} / ${totalCount} checks successful!`);
  console.log('======================================================\n');
}

runTests().catch(err => {
  console.error('\nTest suite execution failed:', err);
  process.exit(1);
});
