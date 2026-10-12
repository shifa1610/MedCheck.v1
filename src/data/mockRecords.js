/**
 * MedCheck Family Caregiver Health Records & Clinical Data Store
 * Supports multi-profile family management: Papa, Maa, Self (Caregiver)
 * Includes Document Comparison datasets for Medicine Conflict Detection
 */

export const FAMILY_MEMBERS = {
  papa: {
    id: "FAM-PAPA-62",
    relation: "Papa (Father)",
    relationKey: "papa",
    avatarIcon: "👨‍🦳",
    name: "Ramesh Sharma",
    age: 62,
    gender: "Male",
    dob: "1964-05-12",
    bloodGroup: "B+",
    abhaId: "91-4589-2314-8702",
    abhaAddress: "ramesh.sharma@abdm",
    phone: "+91 98451 23456",
    preferredLanguage: "te", // Telugu / Hindi
    primaryCaregiver: "Rahul Sharma (Son)",
    activeConditions: [
      "Type 2 Diabetes Mellitus (E11.9)",
      "Essential Hypertension (I10)",
      "CAD - Status Post PCI Stent to LAD (Z95.5)",
      "Mixed Dyslipidemia (E78.5)"
    ],
    allergies: ["Penicillin", "Sulfa Drugs"],
    vitals: {
      height: "172 cm",
      weight: "76 kg",
      bmi: "25.7 (Overweight)",
      bp: "138/88 mmHg",
      pulse: "72 bpm"
    },
    caregiverSummary: "Managing Papa's post-stent cardiac rehab and blood sugar. Prescriptions exist on paper across Fortis and Max Hospital. Audio explanations in Telugu/Hindi needed."
  },
  maa: {
    id: "FAM-MAA-58",
    relation: "Maa (Mother)",
    relationKey: "maa",
    avatarIcon: "👵",
    name: "Sunita Sharma",
    age: 58,
    gender: "Female",
    dob: "1968-11-23",
    bloodGroup: "O+",
    abhaId: "91-3829-1049-5519",
    abhaAddress: "sunita.sharma@abdm",
    phone: "+91 98451 98765",
    preferredLanguage: "hi", // Hindi
    primaryCaregiver: "Rahul Sharma (Son)",
    activeConditions: [
      "Primary Hypothyroidism (E03.9)",
      "Bilateral Osteoarthritis Knee (M17.0)",
      "Stage 1 Essential Hypertension (I10)"
    ],
    allergies: ["Ciprofloxacin"],
    vitals: {
      height: "158 cm",
      weight: "67 kg",
      bmi: "26.8 (Overweight)",
      bp: "130/84 mmHg",
      pulse: "76 bpm"
    },
    caregiverSummary: "Maa needs empty-stomach morning thyroid medication tracking. TSH was recently elevated; dose increased from 25mcg to 50mcg. Hindi voice guidance preferred."
  },
  self: {
    id: "FAM-SELF-32",
    relation: "Self (Caregiver)",
    relationKey: "self",
    avatarIcon: "👤",
    name: "Rahul Sharma",
    age: 32,
    gender: "Male",
    dob: "1994-08-14",
    bloodGroup: "B+",
    abhaId: "91-7291-8843-1204",
    abhaAddress: "rahul.sharma@abdm",
    phone: "+91 98451 11223",
    preferredLanguage: "en",
    primaryCaregiver: "Self (Family Health Manager)",
    activeConditions: [
      "No Chronic Illness",
      "Mild Vitamin D Deficiency (E55.9)",
      "Annual Preventive Care"
    ],
    allergies: ["None Known"],
    vitals: {
      height: "176 cm",
      weight: "73 kg",
      bmi: "23.6 (Normal)",
      bp: "118/76 mmHg",
      pulse: "68 bpm"
    },
    caregiverSummary: "Active family caregiver managing all paper records, doctor appointments, and prescription reconciliation for parents."
  }
};

export const INITIAL_PATIENT = FAMILY_MEMBERS.papa;

// --- PAPA'S CLINICAL RECORDS ---
export const PAPA_RECORDS = [
  {
    id: "REC-PAPA-2026-10-02",
    title: "Comprehensive Metabolic & Lipid Profile",
    type: "lab",
    date: "2026-10-02",
    facility: "Apollo Diagnostics, Indiranagar",
    doctor: "Dr. K. S. Rao, MD (Pathology)",
    category: "Laboratory Report",
    summary: {
      plainText: "Papa's latest blood test shows his average 3-month blood sugar (HbA1c: 8.2%) and fasting sugar (142 mg/dL) are significantly above target. Bad LDL cholesterol (154 mg/dL) is elevated, placing extra strain on his cardiac stent. Kidney filtration (Creatinine 1.05 mg/dL) is normal.",
      hi: "पापा की ताज़ा खून जांच में 3 महीने का औसत शुगर (HbA1c: 8.2%) और खाली पेट शुगर (142 mg/dL) सुरक्षित स्तर से अधिक है। खराब कोलेस्ट्रॉल (LDL: 154 mg/dL) भी बढ़ा हुआ है, जिस पर तुरंत ध्यान देना चाहिए। हालांकि किडनी की कार्यक्षमता (क्रिएटिनिन 1.05 mg/dL) सामान्य है।",
      te: "నాన్నగారి తాజా రక్త పరీక్షలో 3 నెలల సగటు చక్కెర (HbA1c: 8.2%) మరియు ఖాళీ కడుపు చక్కెర (142 mg/dL) ఎక్కువగా ఉన్నాయి. చెడు కొలెస్ట్రాల్ (LDL: 154 mg/dL) కూడా పెరిగింది, గుండె స్టెంట్ దృష్ట్యా ఇది తగ్గించాలి. కిడ్నీ పనితీరు (క్రియాటినిన్ 1.05 mg/dL) సాధారణంగానే ఉంది.",
      ta: "சமீபத்திய இரத்தப் பரிசோதனையில் 3 மாத சராசரி சர்க்கரை (HbA1c: 8.2%) மற்றும் வெறும் வயிற்று சர்க்கரை (142 mg/dL) அதிகமாக உள்ளது. கெட்ட கொலஸ்ட்ரால் (LDL: 154 mg/dL) அதிகரித்துள்ளது. சிறுநீரகம் சாதாரணமாக உள்ளது.",
      kn: "ಅಪ್ಪನ ಇತ್ತೀಚಿನ ರಕ್ತ ಪರೀಕ್ಷೆಯಲ್ಲಿ 3 ತಿಂಗಳ ಸರಾಸರಿ ಸಕ್ಕರೆ (HbA1c: 8.2%) ಮತ್ತು ಖಾಲಿ ಹೊಟ್ಟೆಯ ಸಕ್ಕರೆ (142 mg/dL) ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚಾಗಿದೆ. ಕೆಟ್ಟ ಕೊಲೆಸ್ಟ್ರಾಲ್ (LDL: 154 mg/dL) ಕೂಡ ಹೆಚ್ಚಿದ್ದು, ಹೃದಯದ ಸ್ಟೆಂಟ್ ದೃಷ್ಟಿಯಿಂದ ನಿಯಂತ್ರಿಸಬೇಕಾಗಿದೆ. ಮೂತ್ರಪಿಂಡದ ಕ್ರಿಯಾಟಿನಿನ್ (1.05 mg/dL) ಸಹಜವಾಗಿದೆ.",
      ml: "അച്ഛന്റെ ഏറ്റവും പുതിയ രക്തപരിശോധനയിൽ 3 മാസത്തെ ശരാശരി ഷുഗറും (HbA1c: 8.2%) ഫാസ്റ്റിംഗ് ഷുഗറും (142 mg/dL) കൂടുതലാണ്. ചീത്ത കൊളസ്ട്രോളും (LDL: 154 mg/dL) ഉയർന്നതാണ്, ഹൃദയത്തിലെ സ്റ്റെന്റ് ഉള്ളതിനാൽ ഇത് ശ്രദ്ധിക്കണം. വൃക്കകളുടെ പ്രവർത്തനം (ക്രിയാറ്റിനിൻ 1.05 mg/dL) സാധാരണ നിലയിലാണ്.",
      mr: "बाबांच्या ताज्या रक्त तपासणीत ३ महिन्यांची सरासरी साखर (HbA1c: 8.2%) आणि उपाशीपोटी साखर (142 mg/dL) प्रमाणापेक्षा जास्त आहे. वाईट कोलेस्ट्रॉल (LDL: 154 mg/dL) देखील वाढले आहे, ज्यावर हृदयाच्या स्टेंटमुळे लक्ष देणे गरजेचे आहे. किडनीची कार्यक्षमता (क्रिएटिनिन 1.05 mg/dL) सामान्य आहे.",
      gu: "પપ્પાના તાજેતરના બ્લડ ટેસ્ટમાં 3 મહિનાની સરેરાશ સુગર (HbA1c: 8.2%) અને ભૂખ્યા પેટે સુગર (142 mg/dL) સામાન્ય કરતાં વધુ છે. ખરાબ કોલેસ્ટ્રોલ (LDL: 154 mg/dL) પણ વધેલું છે, જે હાર્ટ સ્ટેન્ટને કારણે નિયંત્રિત કરવું જરૂરી છે. કિડનીની કામગીરી (ક્રિએટિનાઇન 1.05 mg/dL) નોર્મલ છે."
    },
    abnormalExplanations: [
      {
        marker: "HbA1c (Glycated Hemoglobin)",
        value: "8.2 %",
        ref: "< 5.7 % (Normal), 5.7 - 6.4 % (Prediabetes), >= 6.5 % (Diabetic)",
        status: "High",
        explanation: "Reflects average blood sugar over the last 90 days. An 8.2% level indicates suboptimal control, increasing microvascular risk.",
        lifestyleAdvice: "Reduce refined carbohydrates and evening rice; take brisk 30-min morning walks; verify medication dose."
      },
      {
        marker: "Fasting Blood Sugar",
        value: "142 mg/dL",
        ref: "70 - 99 mg/dL",
        status: "High",
        explanation: "Morning glucose before meals is elevated, indicating overnight liver glucose release or insulin resistance.",
        lifestyleAdvice: "Eat light dinners before 8 PM; avoid late-night snacks."
      },
      {
        marker: "LDL Cholesterol ('Bad' Cholesterol)",
        value: "154 mg/dL",
        ref: "< 100 mg/dL (Target < 70 mg/dL post-cardiac stent)",
        status: "High",
        explanation: "Elevated LDL can deposit inside arteries and narrow stents. Needs intensive statin therapy under cardiology guidance.",
        lifestyleAdvice: "Eliminate deep-fried snacks, samosas, and palm oil; increase walnuts and soluble fiber."
      },
      {
        marker: "Total Cholesterol",
        value: "228 mg/dL",
        ref: "< 200 mg/dL",
        status: "Borderline",
        explanation: "Overall circulating cholesterol elevated, driven by high LDL fraction.",
        lifestyleAdvice: "Shift to heart-healthy fats (olive or mustard oil in moderation)."
      }
    ],
    normalMarkers: [
      { name: "Serum Creatinine", value: "1.05 mg/dL", ref: "0.7 - 1.3 mg/dL", interpretation: "Kidneys filtering waste adequately" },
      { name: "Blood Urea Nitrogen (BUN)", value: "16 mg/dL", ref: "7 - 20 mg/dL", interpretation: "Normal nitrogen clearance" },
      { name: "Serum Potassium", value: "4.3 mEq/L", ref: "3.5 - 5.0 mEq/L", interpretation: "Normal electrolyte balance" },
      { name: "Hemoglobin (Hb)", value: "14.2 g/dL", ref: "13.0 - 17.0 g/dL", interpretation: "No sign of anemia" }
    ],
    biomarkers: [
      { name: "HbA1c", value: "8.2", unit: "%", status: "High", referenceRange: "< 5.7 %" },
      { name: "Glucose Fasting", value: "142", unit: "mg/dL", status: "High", referenceRange: "70 - 100 mg/dL" },
      { name: "Cholesterol Total", value: "228", unit: "mg/dL", status: "Borderline", referenceRange: "< 200 mg/dL" },
      { name: "Cholesterol LDL", value: "154", unit: "mg/dL", status: "High", referenceRange: "< 100 mg/dL" },
      { name: "Cholesterol HDL", value: "42", unit: "mg/dL", status: "Normal", referenceRange: "> 40 mg/dL" },
      { name: "Triglycerides", value: "168", unit: "mg/dL", status: "Borderline", referenceRange: "< 150 mg/dL" },
      { name: "Creatinine", value: "1.05", unit: "mg/dL", status: "Normal", referenceRange: "0.7 - 1.3 mg/dL" },
      { name: "Hemoglobin", value: "14.2", unit: "g/dL", status: "Normal", referenceRange: "13.0 - 17.0 g/dL" }
    ],
    doctorQuestions: [
      "Should we adjust Papa's Metformin dose or add an SGLT2 inhibitor given his HbA1c is 8.2%?",
      "Do we need to step up his statin to Atorvastatin 40mg given LDL is 154 mg/dL with a stent?",
      "When should we repeat the fasting lipid panel?"
    ]
  },
  {
    id: "REC-PAPA-2026-09-28",
    title: "Hospital Discharge Summary & Updated Regimen",
    type: "discharge",
    date: "2026-09-28",
    facility: "Max Super Speciality Hospital, Saket",
    doctor: "Dr. Arvind Chawla, MS, MCh (Cardiothoracic)",
    category: "Discharge Summary",
    summary: {
      plainText: "Papa was discharged with updated cardiology and diabetic prescriptions. Doses were stepped up: Metformin increased to 1000mg BID, Telmisartan increased to 80mg OD, Atorvastatin increased to 40mg QHS, and Clopidogrel 75mg prescribed for stent protection. Aspirin stopped.",
      hi: "अस्पताल से छुट्टी के समय पापा की दवाओं की डोज़ बढ़ाई गई: मेटफॉर्मिन 1000mg (दिन में 2 बार), टेल्मीसार्टन 80mg (सुबह), एटोरवास्टेटिन 40mg (रात) और स्टेंट की सुरक्षा के लिए क्लोपिडोग्रेल 75mg शुरू की गई। एस्पिरिन बंद की गई।",
      te: "హాస్పిటల్ డిశ్చార్జ్ సమయంలో నాన్నగారి మందుల డోస్ పెంచారు: మెట్‌ఫార్మిన్ 1000mg (రోజుకు 2 సార్లు), టెల్మిసార్టన్ 80mg (ఉదయం), అటోర్వాస్టాటిన్ 40mg (రాత్రి), మరియు క్లోపిడోగ్రెల్ 75mg ప్రారంభించారు. ఆస్ప్రిన్ నిలిపివేశారు.",
      ta: "மருத்துவமனையிலிருந்து விடுவிக்கப்பட்டபோது மருந்தளவுகள் அதிகரிக்கப்பட்டன: மெட்பார்மின் 1000mg, டெல்மிசார்டன் 80mg, அடோர்வாஸ்டாடின் 40mg மற்றும் குளோபிடோக்ரல் 75mg பரிந்துரைக்கப்பட்டது.",
      kn: "ಆಸ್ಪತ್ರೆಯಿಂದ ಡಿಸ್ಚಾರ್ಜ್ ಆದಾಗ ಅಪ್ಪನ ಔಷಧಿಗಳ ಪ್ರಮಾಣವನ್ನು ಹೆಚ್ಚಿಸಲಾಗಿದೆ: ಮೆಟ್‌ಫಾರ್ಮಿನ್ 1000mg (ದಿನಕ್ಕೆ 2 ಬಾರಿ), ಟೆಲ್ಮಿಸಾರ್ಟನ್ 80mg (ಬೆಳಿಗ್ಗೆ), ಅಟೋರ್ವಾಸ್ಟಾಟಿನ್ 40mg (ರಾತ್ರಿ) ಮತ್ತು ಸ್ಟೆಂಟ್ ರಕ್ಷಣೆಗಾಗಿ ಕ್ಲೋಪಿಡೋಗ್ರೆಲ್ 75mg ನೀಡಲಾಗಿದೆ. ಆಸ್ಪಿರಿನ್ ನಿಲ್ಲಿಸಲಾಗಿದೆ.",
      ml: "ആശുപത്രിയിൽ നിന്ന് ഡിസ്ചാർജ് ചെയ്തപ്പോൾ മരുന്നുകളുടെ അളവ് വർദ്ധിപ്പിച്ചു: മെറ്റ്ഫോർമിൻ 1000mg (ദിവസത്തിൽ 2 തവണ), ടെൽമിസാർട്ടൻ 80mg (രാവിലെ), അറ്റോർവാസ്റ്റാറ്റിൻ 40mg (രാത്രി), കൂടാതെ സ്റ്റെന്റ് സംരക്ഷണത്തിനായി ക്ലോപിഡോഗ്രൽ 75mg നൽകി. ആസ്പിരിൻ നിർത്തി.",
      mr: "हॉस्पिटलमधून डिस्चार्ज देताना बाबांच्या औषधांचा डोस वाढवण्यात आला: मेटफॉर्मिन 1000mg (दिवसातून २ वेळा), टेल्मीसार्टन 80mg (सकाळी), अ‍ॅटोरव्हास्टॅटिन 40mg (रात्री) आणि स्टेंटच्या संरक्षणासाठी क्लोपिडोग्रेल 75mg सुरू केले. अ‍ॅस्पिरिन बंद करण्यात आले.",
      gu: "હોસ્પિટલ ડિસ્ચાર્જ સમયે પપ્પાની દવાઓના ડોઝ વધારવામાં આવ્યા: મેટફોર્મિન 1000mg (દિવસમાં 2 વાર), ટેલ્મિસાર્ટન 80mg (સવારે), એટોરવાસ્ટેટિન 40mg (રાત્રે) અને સ્ટેન્ટની સુરક્ષા માટે ક્લોપિડોગ્રેલ 75mg શરૂ કરાઈ. એસ્પિરિન બંધ કરાઈ."
    },
    diagnoses: [
      "CAD - Status Post PCI Stent to Mid-LAD",
      "Uncontrolled Type 2 Diabetes Mellitus",
      "Essential Hypertension - Stage 2 (Controlled on titrations)"
    ],
    medications: [
      {
        name: "Tab Metformin HCl",
        dosage: "1000 mg",
        frequency: "1-0-1 (Twice daily)",
        timing: "After Meals (भोजन के बाद)",
        duration: "90 days",
        refillDueDays: 14,
        purpose: "Intensive glucose control in T2D",
        instructions: "Take with meals. Do not take on empty stomach.",
        precautions: "Stay hydrated; do not combine with old 500mg pills."
      },
      {
        name: "Tab Telmisartan",
        dosage: "80 mg",
        frequency: "1-0-0 (Once daily)",
        timing: "Morning after breakfast",
        duration: "90 days",
        refillDueDays: 14,
        purpose: "High blood pressure control & cardiac afterload reduction",
        instructions: "Take every morning at 8 AM. Monitor BP weekly.",
        precautions: "Report lightheadedness or dizziness on standing."
      },
      {
        name: "Tab Atorvastatin",
        dosage: "40 mg",
        frequency: "0-0-1 (Once daily)",
        timing: "Bedtime (रात को सोने से पहले)",
        duration: "90 days",
        refillDueDays: 14,
        purpose: "High-intensity plaque stabilization post-stent",
        instructions: "Take nightly with water.",
        precautions: "Avoid excessive grapefruit. Report muscle cramps."
      },
      {
        name: "Tab Clopidogrel (Plavix)",
        dosage: "75 mg",
        frequency: "1-0-0 (Once daily)",
        timing: "After breakfast",
        duration: "365 days (1 year mandatory post-stent)",
        refillDueDays: 21,
        purpose: "Antiplatelet blood thinner to prevent stent thrombosis",
        instructions: "MUST NOT BE STOPPED WITHOUT CARDIOLOGIST CONSENT.",
        precautions: "Do NOT take Aspirin simultaneously unless explicitly instructed."
      }
    ],
    doctorQuestions: [
      "Can we confirm Papa should completely discard his older 500mg Metformin tablets?",
      "For how many months is Clopidogrel 75mg mandatory before stepping down?",
      "What is Papa's target sitting blood pressure on 80mg Telmisartan?"
    ]
  },
  {
    id: "REC-PAPA-2026-08-15",
    title: "Fortis Clinic Outpatient Prescription (Previous Visit)",
    type: "prescription",
    date: "2026-08-15",
    facility: "Fortis Escorts Heart & Diabetes Clinic",
    doctor: "Dr. Rajesh Sharma, MD, DM (Cardiology)",
    category: "Prescription",
    bilingualText: "डॉक्टर सलाह: भोजन के बाद 1 गोली (Tab Metformin 500mg) दो बार लें। सुबह Tab Telmisartan 40mg लें। दोपहर में Tab Aspirin 75mg लें।",
    summary: {
      plainText: "Dr. Rajesh Sharma's earlier clinic prescription. Prescribed lower dosages: Metformin 500mg BID, Telmisartan 40mg OD, Atorvastatin 20mg QHS, and Aspirin 75mg OD. (Note: These dosages are different from the subsequent Max Hospital discharge summary).",
      hi: "डॉ. राजेश शर्मा का पुराना क्लीनिक पर्चा। इसमें कम डोज़ लिखी थी: मेटफॉर्मिन 500mg (2 बार), टेल्मीसार्टन 40mg (सुबह), एटोरवास्टेटिन 20mg (रात) और एस्पिरिन 75mg (दोपहर)। (नोट: यह डोज़ अस्पताल की ताज़ा डिस्चार्ज रिपोर्ट से भिन्न है)।",
      te: "డాక్టర్ రాజేష్ శర్మ గారి మునుపటి క్లినిక్ ప్రిస్క్రిప్షన్. ఇందులో తక్కువ డోస్ ఉంది: మెట్‌ఫార్మిన్ 500mg, టెల్మిసార్టన్ 40mg, అటోర్వాస్టాటిన్ 20mg, ఆస్ప్రిన్ 75mg.",
      ta: "டாக்டர் ராஜேஷ் சர்மாவின் முந்தைய மருந்துச்சீட்டு. குறைந்த மருந்தளவுகள்: மெட்பார்மின் 500mg, டெல்மிசார்டன் 40mg, அடோர்வாஸ்டாடின் 20mg, ஆஸ்பிரின் 75mg.",
      kn: "ಡಾ. ರಾಜೇಶ್ ಶರ್ಮಾ ಅವರ ಹಿಂದಿನ ಕ್ಲಿನಿಕ್ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್. ಇದರಲ್ಲಿ ಕಡಿಮೆ ಪ್ರಮಾಣದ ಔಷಧಿಗಳಿದ್ದವು: ಮೆಟ್‌ಫಾರ್ಮಿನ್ 500mg, ಟೆಲ್ಮಿಸಾರ್ಟನ್ 40mg, ಅಟೋರ್ವಾಸ್ಟಾಟಿನ್ 20mg ಮತ್ತು ಆಸ್ಪಿರಿನ್ 75mg.",
      ml: "ഡോ. രാജേഷ് ശർമ്മയുടെ മുൻ ക്ലിനിക്ക് കുറിപ്പടി. കുറഞ്ഞ ഡോസുകളായിരുന്നു: മെറ്റ്ഫോർമിൻ 500mg, ടെൽമിസാർട്ടൻ 40mg, അറ്റോർവാസ്റ്റാറ്റിൻ 20mg, ആസ്പിരിൻ 75mg.",
      mr: "डॉ. राजेश शर्मा यांची जुनी क्लिनिक चिठ्ठी. यात कमी डोस होता: मेटफॉर्मिन 500mg, टेल्मीसार्टन 40mg, अ‍ॅटोरव्हास्टॅटिन 20mg आणि अ‍ॅस्पिरिन 75mg.",
      gu: "ડો. રાજેશ શર્માનું અગાઉનું ક્લિનિક પ્રિસ્ક્રિપ્શન. જેમાં ઓછા ડોઝ હતા: મેટફોર્મિન 500mg, ટેલ્મિસાર્ટન 40mg, એટોરવાસ્ટેટિન 20mg અને એસ્પિરિન 75mg."
    },
    diagnoses: ["Type 2 Diabetes", "Essential Hypertension", "Mild Hyperlipidemia"],
    medications: [
      {
        name: "Tab Metformin HCl",
        dosage: "500 mg",
        frequency: "1-0-1 (Twice daily)",
        timing: "After Meals (भोजन के बाद)",
        duration: "90 days",
        refillDueDays: 0,
        purpose: "Blood sugar reduction",
        instructions: "Take with food.",
        precautions: "Hydrate properly."
      },
      {
        name: "Tab Telmisartan",
        dosage: "40 mg",
        frequency: "1-0-0 (Once daily)",
        timing: "Morning after breakfast",
        duration: "90 days",
        refillDueDays: 0,
        purpose: "Blood pressure regulation",
        instructions: "Take every morning.",
        precautions: "Monitor home BP."
      },
      {
        name: "Tab Atorvastatin",
        dosage: "20 mg",
        frequency: "0-0-1 (Once daily)",
        timing: "Bedtime (रात को सोने से पहले)",
        duration: "90 days",
        refillDueDays: 0,
        purpose: "Lipid reduction",
        instructions: "Take at night.",
        precautions: "Report muscle aches."
      },
      {
        name: "Tab Aspirin (Ecosprin)",
        dosage: "75 mg",
        frequency: "0-1-0 (Once daily)",
        timing: "After Lunch",
        duration: "90 days",
        refillDueDays: 0,
        purpose: "Antiplatelet",
        instructions: "Take after lunch with water.",
        precautions: "Take with food to protect stomach lining."
      }
    ]
  },
  {
    id: "REC-PAPA-2026-04-10",
    title: "Quarterly Metabolic Checkup (Historical Comparison)",
    type: "lab",
    date: "2026-04-10",
    facility: "Suburban Diagnostics Lab",
    doctor: "Dr. P. Nair, MD",
    category: "Laboratory Report",
    summary: {
      plainText: "Six months ago, Papa's HbA1c was 8.8% and Fasting Blood Sugar was 160 mg/dL. His current reading (8.2% and 142 mg/dL) shows positive downward improvement, though still above target (< 7.0%).",
      hi: "छह महीने पहले पापा का HbA1c 8.8% और फास्टिंग शुगर 160 mg/dL था। ताज़ा रिपोर्ट (8.2% और 142 mg/dL) सुधार दिखाती है।",
      te: "ఆరు నెలల క్రితం నాన్నగారి HbA1c 8.8% మరియు చక్కెర 160 mg/dL. ప్రస్తుత రిపోర్టులో (8.2% & 142 mg/dL) మెరుగుదల కనిపిస్తోంది.",
      ta: "ஆறு மாதங்களுக்கு முன்பு HbA1c 8.8% மற்றும் சர்க்கரை 160 mg/dL ஆக இருந்தது. தற்போது முன்னேற்றம் தெரிகிறது.",
      kn: "ಆರು ತಿಂಗಳ ಹಿಂದೆ ಅಪ್ಪನ HbA1c 8.8% ಮತ್ತು ಸಕ್ಕರೆ 160 mg/dL ಇತ್ತು. ಇತ್ತೀಚಿನ ವರದಿ (8.2% ಮತ್ತು 142 mg/dL) ಸುಧಾರಣೆ ತೋರಿಸುತ್ತಿದೆ.",
      ml: "ആറുമാസം മുമ്പ് HbA1c 8.8% ഉം ഷുഗർ 160 mg/dL ഉം ആയിരുന്നു. ഇപ്പോഴത്തെ റിപ്പോർട്ട് (8.2% ഉം 142 mg/dL ഉം) പുരോഗതി കാണിക്കുന്നു.",
      mr: "सहा महिन्यांपूर्वी HbA1c 8.8% आणि साखर 160 mg/dL होती. सध्याच्या अहवालात (8.2% आणि 142 mg/dL) सुधारणा दिसून येत आहे.",
      gu: "છ મહિના પહેલાં HbA1c 8.8% અને સુગર 160 mg/dL હતી. હાલના રિપોર્ટમાં (8.2% અને 142 mg/dL) સુધારો દેખાય છે."
    },
    biomarkers: [
      { name: "HbA1c", value: "8.8", unit: "%", status: "High", referenceRange: "< 5.7 %" },
      { name: "Glucose Fasting", value: "160", unit: "mg/dL", status: "High", referenceRange: "70 - 100 mg/dL" },
      { name: "Cholesterol Total", value: "245", unit: "mg/dL", status: "High", referenceRange: "< 200 mg/dL" },
      { name: "Cholesterol LDL", value: "168", unit: "mg/dL", status: "High", referenceRange: "< 100 mg/dL" },
      { name: "Creatinine", value: "1.08", unit: "mg/dL", status: "Normal", referenceRange: "0.7 - 1.3 mg/dL" }
    ]
  }
];

// --- MAA'S CLINICAL RECORDS ---
export const MAA_RECORDS = [
  {
    id: "REC-MAA-2026-09-20",
    title: "Thyroid Function & 25-OH Vitamin D Panel",
    type: "lab",
    date: "2026-09-20",
    facility: "Dr Lal PathLabs, Delhi",
    doctor: "Dr. Neha Goel, MD (Biochemistry)",
    category: "Laboratory Report",
    summary: {
      plainText: "Maa's thyroid stimulating hormone (TSH: 7.8 uIU/mL) remains elevated above the upper normal limit (4.2 uIU/mL), indicating underactive thyroid (hypothyroidism). Her Vitamin D (14.2 ng/mL) is deficient, contributing to her knee osteoarthritis stiffness. Kidney and liver tests are normal.",
      hi: "माँ का थायराइड स्टिम्युलेटिंग हार्मोन (TSH: 7.8 uIU/mL) सामान्य सीमा (4.2 uIU/mL) से अधिक है, जो हाइपोथायरायडिज्म का संकेत है। उनका विटामिन डी (14.2 ng/mL) भी काफी कम है, जिससे घुटनों के दर्द और अकड़न में वृद्धि होती है।",
      te: "అమ్మగారి థైరాయిడ్ హార్మోన్ (TSH: 7.8 uIU/mL) సాధారణం కంటే ఎక్కువగా ఉంది (హైపోథైరాయిడిజం). విటమిన్ డి (14.2 ng/mL) కూడా తక్కువగా ఉండటం వల్ల మోకాళ్ళ నొప్పులు ఎక్కువవుతున్నాయి.",
      ta: "தாயாரின் தைராய்டு அளவு (TSH: 7.8 uIU/mL) அதிகமாக உள்ளது. வைட்டமின் டி (14.2 ng/mL) குறைவாக இருப்பதால் மூட்டு வலி ஏற்பட வாய்ப்புள்ளது.",
      kn: "ಅಮ್ಮನ ಥೈರಾಯ್ಡ್ ಹಾರ್ಮೋನ್ (TSH: 7.8 uIU/mL) ಹೆಚ್ಚಾಗಿದ್ದು, ಹೈಪೋಥೈರಾಯ್ಡಿಸಮ್ ಅನ್ನು ಸೂಚಿಸುತ್ತದೆ. ವಿಟಮಿನ್ ಡಿ (14.2 ng/mL) ತೀರ ಕಡಿಮೆಯಾಗಿದ್ದು, ಮೊಣಕಾಲು ನೋವು ಮತ್ತು ಬಿಗಿತಕ್ಕೆ ಕಾರಣವಾಗುತ್ತಿದೆ.",
      ml: "അമ്മയുടെ തൈറോയ്ഡ് ഹോർമോൺ (TSH: 7.8 uIU/mL) സാധാരണ പരിധിയേക്കാൾ കൂടുതലാണ് (ഹൈപ്പോതൈറോയിഡിസം). വിറ്റാമിൻ ഡി (14.2 ng/mL) വളരെ കുറവായതിനാൽ കാൽമുട്ട് വേദന കൂടാൻ സാധ്യതയുണ്ട്.",
      mr: "आईंचे थायरॉईड संप्रेरक (TSH: 7.8 uIU/mL) सामान्य मर्यादेपेक्षा जास्त आहे (हायपोथायरॉईडीझम). व्हिटॅमिन डी (14.2 ng/mL) खूप कमी असल्याने गुडघेदुखी आणि कडकपणा वाढतो आहे.",
      gu: "મમ્મીનું થાઇરોઇડ હોર્મોન (TSH: 7.8 uIU/mL) સામાન્ય મર્યાદા કરતાં વધુ છે (હાઈપોથાઇરોઇડિઝમ). વિટામિન ડી (14.2 ng/mL) ઘણું ઓછું હોવાથી ઘૂંટણના દુખાવામાં વધારો થાય છે."
    },
    abnormalExplanations: [
      {
        marker: "TSH (Thyroid Stimulating Hormone)",
        value: "7.8 uIU/mL",
        ref: "0.4 - 4.2 uIU/mL",
        status: "High",
        explanation: "Pituitary gland is producing excess TSH because the thyroid gland is not making enough thyroid hormone. Causes fatigue, cold sensitivity, and weight gain.",
        lifestyleAdvice: "Ensure Thyronorm is taken strictly on an empty stomach with plain water at least 45 minutes before tea or breakfast."
      },
      {
        marker: "25-OH Vitamin D Total",
        value: "14.2 ng/mL",
        ref: "30.0 - 100.0 ng/mL (Deficiency < 20)",
        status: "Low",
        explanation: "Severe Vitamin D deficiency reduces calcium absorption and accelerates knee osteoarthritis cartilage wear.",
        lifestyleAdvice: "Weekly 60,000 IU Cholecalciferol supplement as prescribed; 20 minutes of morning sunlight."
      }
    ],
    normalMarkers: [
      { name: "Free T4 (Thyroxine)", value: "1.02 ng/dL", ref: "0.8 - 1.8 ng/dL", interpretation: "Borderline low-normal" },
      { name: "Serum Calcium", value: "9.2 mg/dL", ref: "8.5 - 10.5 mg/dL", interpretation: "Normal circulating calcium" },
      { name: "Serum Creatinine", value: "0.82 mg/dL", ref: "0.6 - 1.1 mg/dL", interpretation: "Healthy kidney filtration" }
    ],
    biomarkers: [
      { name: "TSH", value: "7.8", unit: "uIU/mL", status: "High", referenceRange: "0.4 - 4.2 uIU/mL" },
      { name: "Vitamin D", value: "14.2", unit: "ng/mL", status: "Low", referenceRange: "30.0 - 100.0 ng/mL" },
      { name: "Free T4", value: "1.02", unit: "ng/dL", status: "Normal", referenceRange: "0.8 - 1.8 ng/dL" },
      { name: "Calcium", value: "9.2", unit: "mg/dL", status: "Normal", referenceRange: "8.5 - 10.5 mg/dL" },
      { name: "Creatinine", value: "0.82", unit: "mg/dL", status: "Normal", referenceRange: "0.6 - 1.1 mg/dL" }
    ],
    doctorQuestions: [
      "Should we increase Maa's Thyronorm from 25mcg to 50mcg since TSH is 7.8 uIU/mL?",
      "Can we start a 60,000 IU weekly Vitamin D sachet course for 8 weeks?",
      "What exercises are safe for her bilateral knee osteoarthritis?"
    ]
  },
  {
    id: "REC-MAA-2026-09-22",
    title: "Endocrinology & Rheumatology Prescription",
    type: "prescription",
    date: "2026-09-22",
    facility: "Apollo Cradle & Specialty Clinic",
    doctor: "Dr. Meenakshi Sundaram, MD, DM (Endocrinology)",
    category: "Prescription",
    bilingualText: "डॉक्टर निर्देश: सुबह खाली पेट 1 गोली (Tab Thyronorm 50mcg) पानी के साथ लें। चाय या नाश्ता 45 मिनट बाद ही लें।",
    summary: {
      plainText: "Dr. Meenakshi titrated Maa's Thyronorm dose up to 50mcg (from 25mcg) due to elevated TSH. Added weekly Cholecalciferol (Vitamin D3 60K) and daily Calcium. Advised strict morning fasting rule.",
      hi: "डॉ. मीनाक्षी ने माँ की थायरोनॉर्म डोज़ 25mcg से बढ़ाकर 50mcg कर दी है। साथ ही हफ्ते में एक बार विटामिन डी पाउच और रोज़ाना कैल्शियम गोली लेने की सलाह दी है।",
      te: "డాక్టర్ మీనాక్షి గారు థైరోనార్మ్ డోస్‌ను 25mcg నుండి 50mcg కి పెంచారు. వారానికి ఒకసారి విటమిన్ డి3 మరియు రోజూ కాల్షియం మాత్రలు సూచించారు.",
      ta: "தைராய்டு மருந்து 25mcg இலிருந்து 50mcg ஆக அதிகரிக்கப்பட்டது. வாராந்திர வைட்டமின் டி3 மற்றும் தினசரி கால்சியம் மாத்திரைகள் பரிந்துரைக்கப்பட்டன.",
      kn: "ಡಾ. ಮೀನಾಕ್ಷಿ ಅವರು ಥೈರೋನಾರ್ಮ್ ಡೋಸ್ ಅನ್ನು 25mcg ನಿಂದ 50mcg ಗೆ ಹೆಚ್ಚಿಸಿದ್ದಾರೆ. ವಾರಕ್ಕೊಮ್ಮೆ ವಿಟಮಿನ್ ಡಿ3 ಮತ್ತು ಪ್ರತಿದಿನ ಕ್ಯಾಲ್ಸಿಯಂ ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಲು ಸಲಹೆ ನೀಡಿದ್ದಾರೆ.",
      ml: "ഡോ. മീനാക്ഷി തൈറോനോർം ഡോസ് 25mcg-ൽ നിന്ന് 50mcg ആയി വർദ്ധിപ്പിച്ചു. ആഴ്ചയിലൊരിക്കൽ വിറ്റാമിൻ ഡി3-യും ദിവസവും കാൽസ്യവും കഴിക്കാൻ നിർദ്ദേശിച്ചു.",
      mr: "डॉ. मीनाक्षी यांनी थायरॉनॉर्मचा डोस 25mcg वरून 50mcg केला आहे. आठवड्यातून एकदा व्हिटॅमिन डी3 पाऊच आणि दररोज कॅल्शियम गोळी घेण्याचा सल्ला दिला आहे.",
      gu: "ડો. મીનાક્ષીએ થાઇરોનોર્મનો ડોઝ 25mcg થી વધારીને 50mcg કર્યો છે. અઠવાડિયે એક વાર વિટામિન ડી3 અને દરરોજ કેલ્શિયમની ગોળી લેવાની સલાહ આપી છે."
    },
    diagnoses: ["Primary Hypothyroidism - Inadequate Replacement", "Hypovitaminosis D", "Knee Osteoarthritis"],
    medications: [
      {
        name: "Tab Thyronorm (Levothyroxine)",
        dosage: "50 mcg",
        frequency: "1-0-0 (Once daily)",
        timing: "Empty Stomach Early Morning (खाली पेट)",
        duration: "90 days",
        refillDueDays: 18,
        purpose: "Thyroid hormone replacement",
        instructions: "Take with 1 glass of plain water immediately upon waking. Wait 45-60 mins before having tea, coffee, or milk.",
        precautions: "Do NOT take Calcium or iron supplements at the same time; space them at least 4 hours apart."
      },
      {
        name: "Sachet Calcirol (Cholecalciferol)",
        dosage: "60,000 IU",
        frequency: "Once Weekly (Every Sunday)",
        timing: "After breakfast with milk",
        duration: "8 weeks",
        refillDueDays: 24,
        purpose: "Rapid replenishment of bone Vitamin D stores",
        instructions: "Dissolve 1 sachet in half cup of lukewarm milk every Sunday morning.",
        precautions: "Do not exceed weekly frequency without repeat blood test."
      },
      {
        name: "Tab Shelcal 500 (Calcium + Vit D3)",
        dosage: "500 mg",
        frequency: "0-1-0 (Once daily)",
        timing: "After Lunch (दोपहर भोजन के बाद)",
        duration: "90 days",
        refillDueDays: 20,
        purpose: "Bone and joint cartilage support",
        instructions: "Take with water after lunch. Keep 4-hour gap from Thyronorm.",
        precautions: "Ensure adequate daily water intake."
      },
      {
        name: "Tab Dolo 650 (Paracetamol)",
        dosage: "650 mg",
        frequency: "SOS (As needed for severe knee pain)",
        timing: "After meals (Max 2 tabs / day)",
        duration: "As needed",
        refillDueDays: 60,
        purpose: "Mild pain relief for knee flare-ups",
        instructions: "Take only during acute joint stiffness or pain.",
        precautions: "Do not take more than 2 tablets in 24 hours."
      }
    ],
    doctorQuestions: [
      "Can Maa take her blood pressure medication at the same time as Thyronorm?",
      "When should we recheck her TSH after the 50mcg titration (6 weeks or 8 weeks)?",
      "Is physical therapy recommended for her knees?"
    ]
  }
];

// --- SELF'S (CAREGIVER) RECORDS ---
export const SELF_RECORDS = [
  {
    id: "REC-SELF-2026-08-05",
    title: "Executive Preventive Health Checkup",
    type: "lab",
    date: "2026-08-05",
    facility: "Manipal Hospital Executive Health Centre",
    doctor: "Dr. Ananya Sen, MD (Internal Medicine)",
    category: "Laboratory Report",
    summary: {
      plainText: "Rahul's annual checkup indicates excellent cardiovascular health, normal fasting glucose (88 mg/dL), normal HbA1c (5.2%), and optimal blood pressure (118/76 mmHg). Mild Vitamin D insufficiency (22.4 ng/mL) noted.",
      hi: "राहुल का वार्षिक स्वास्थ्य चेकअप पूरी तरह सामान्य है। ब्लड शुगर (88 mg/dL) और बीपी (118/76 mmHg) बिल्कुल फिट हैं। केवल हल्का विटामिन डी कम (22.4 ng/mL) है।",
      te: "రాహుల్ వార్షిక ఆరోగ్య పరీక్ష చాలా బాగుంది. రక్తంలో చక్కెర మరియు రక్తపోటు సాధారణంగా ఉన్నాయి. స్వల్పంగా విటమిన్ డి లోపం ఉంది.",
      ta: "ராகுலின் வருடாந்திர முழு உடல் பரிசோதனை முடிவுகள் ஆரோக்கியமாக உள்ளன. லேசான வைட்டமின் டி குறைபாடு மட்டுமே உள்ளது.",
      kn: "ರಾಹುಲ್ ಅವರ ವಾರ್ಷಿಕ ಆರೋಗ್ಯ ತಪಾಸಣೆ ಅತ್ಯುತ್ತಮವಾಗಿದೆ. ರಕ್ತದ ಸಕ್ಕರೆ (88 mg/dL) ಮತ್ತು ರಕ್ತದೊತ್ತಡ (118/76 mmHg) ಸಹಜವಾಗಿದೆ. ಸ್ವಲ್ಪ ವಿಟಮಿನ್ ಡಿ ಕೊರತೆ (22.4 ng/mL) ಕಂಡುಬಂದಿದೆ.",
      ml: "രാഹുലിന്റെ വാർഷിക ആരോഗ്യ പരിശോധനാ ഫലങ്ങൾ മികച്ചതാണ്. രക്തത്തിലെ പഞ്ചസാരയും രക്തസമ്മർദ്ദവും സാധാരണ നിലയിലാണ്. നേരിയ വിറ്റാമിൻ ഡി കുറവുണ്ട്.",
      mr: "राहुल यांची वार्षिक आरोग्य तपासणी उत्तम आहे. रक्तातील साखर (88 mg/dL) आणि रक्तदाब (118/76 mmHg) सामान्य आहेत. फक्त व्हिटॅमिन डी ची किंचित कमतरता (22.4 ng/mL) आहे.",
      gu: "રાહુલનું વાર્ષિક હેલ્થ ચેકઅપ ઉત્તમ છે. બ્લડ સુગર (88 mg/dL) અને બ્લડ પ્રેશર (118/76 mmHg) સામાન્ય છે. માત્ર સામાન્ય વિટામિન ડીની ઉણપ (22.4 ng/mL) છે."
    },
    biomarkers: [
      { name: "HbA1c", value: "5.2", unit: "%", status: "Normal", referenceRange: "< 5.7 %" },
      { name: "Glucose Fasting", value: "88", unit: "mg/dL", status: "Normal", referenceRange: "70 - 100 mg/dL" },
      { name: "Cholesterol Total", value: "172", unit: "mg/dL", status: "Normal", referenceRange: "< 200 mg/dL" },
      { name: "Cholesterol LDL", value: "94", unit: "mg/dL", status: "Normal", referenceRange: "< 100 mg/dL" },
      { name: "Cholesterol HDL", value: "54", unit: "mg/dL", status: "Normal", referenceRange: "> 40 mg/dL" },
      { name: "Creatinine", value: "0.95", unit: "mg/dL", status: "Normal", referenceRange: "0.7 - 1.3 mg/dL" },
      { name: "Vitamin D", value: "22.4", unit: "ng/mL", status: "Borderline", referenceRange: "30.0 - 100.0 ng/mL" }
    ],
    medications: []
  }
];

// Map records to patient
export const INITIAL_RECORDS = PAPA_RECORDS;

// --- BIOMARKER TREND SERIES ---
export const PAPA_TREND_SERIES = [
  { date: "2025-11-15", label: "Nov 2025", hba1c: 9.1, fastingGlucose: 178, cholesterolTotal: 252, cholesterolLdl: 172, bpSystolic: 148, bpDiastolic: 94, creatinine: 1.12 },
  { date: "2026-04-10", label: "Apr 2026", hba1c: 8.8, fastingGlucose: 160, cholesterolTotal: 245, cholesterolLdl: 168, bpSystolic: 142, bpDiastolic: 90, creatinine: 1.08 },
  { date: "2026-06-12", label: "Jun 2026 (Stent)", hba1c: 8.5, fastingGlucose: 151, cholesterolTotal: 234, cholesterolLdl: 160, bpSystolic: 126, bpDiastolic: 80, creatinine: 1.04 },
  { date: "2026-10-02", label: "Oct 2026 (Latest)", hba1c: 8.2, fastingGlucose: 142, cholesterolTotal: 228, cholesterolLdl: 154, bpSystolic: 138, bpDiastolic: 88, creatinine: 1.05 }
];

export const MAA_TREND_SERIES = [
  { date: "2025-08-10", label: "Aug 2025", tsh: 12.4, vitD: 10.5, bpSystolic: 136, bpDiastolic: 86, calcium: 8.9 },
  { date: "2026-03-15", label: "Mar 2026", tsh: 10.1, vitD: 12.0, bpSystolic: 132, bpDiastolic: 84, calcium: 9.0 },
  { date: "2026-09-20", label: "Sep 2026 (Latest)", tsh: 7.8, vitD: 14.2, bpSystolic: 130, bpDiastolic: 84, calcium: 9.2 }
];

export const SELF_TREND_SERIES = [
  { date: "2025-07-20", label: "Jul 2025", hba1c: 5.3, fastingGlucose: 92, cholesterolTotal: 178, bpSystolic: 120, bpDiastolic: 78 },
  { date: "2026-08-05", label: "Aug 2026 (Latest)", hba1c: 5.2, fastingGlucose: 88, cholesterolTotal: 172, bpSystolic: 118, bpDiastolic: 76 }
];

export const BIOMARKER_TREND_SERIES = PAPA_TREND_SERIES;

// --- PRE-LOADED DOCUMENT COMPARISON SCENARIOS ---
export const PRELOADED_COMPARISONS = [
  {
    id: "COMP-PAPA-DISCHARGE-VS-CLINIC",
    familyMember: "papa",
    title: "Papa's Hospital Discharge (Max Hospital) vs Previous Clinic Rx (Fortis Clinic)",
    docA: {
      id: "DOC-A-DISCHARGE",
      title: "Max Hospital Cardiac Discharge Summary",
      date: "2026-09-28",
      facility: "Max Super Speciality Hospital, Saket",
      doctor: "Dr. Arvind Chawla, MS, MCh",
      type: "Hospital Discharge"
    },
    docB: {
      id: "DOC-B-CLINIC",
      title: "Fortis Escorts Clinic Prescription",
      date: "2026-08-15",
      facility: "Fortis Escorts Clinic",
      doctor: "Dr. Rajesh Sharma, MD, DM",
      type: "Outpatient Clinic Rx"
    },
    conflictSummary: {
      en: "4 key differences identified between Papa's hospital discharge and clinic note. The hospital increased Metformin (+500mg), Telmisartan (+40mg), and Atorvastatin (+20mg). Aspirin was replaced with Clopidogrel (blood thinner). Verify which dose to follow before opening new strips.",
      hi: "पापा के अस्पताल डिस्चार्ज और पुराने क्लीनिक पर्चे में 4 महत्वपूर्ण अंतर पाए गए हैं। अस्पताल ने मेटफॉर्मिन (+500mg), टेल्मीसार्टन (+40mg) और एटोरवास्टेटिन (+20mg) की डोज़ बढ़ा दी है। एस्पिरिन की जगह क्लोपिडोग्रेल शुरू की गई है। पुरानी और नई गोलियां एक साथ न लें।",
      te: "నాన్నగారి హాస్పిటల్ డిశ్చార్జ్ మరియు పాత క్లినిక్ ప్రిస్క్రిప్షన్ మధ్య 4 ముఖ్యమైన తేడాలు గుర్తించబడ్డాయి. మెట్‌ఫార్మిన్ (+500mg), టెల్మిసార్టన్ (+40mg), అటోర్వాస్టాటిన్ (+20mg) డోసులు పెంచారు. ఆస్ప్రిన్ స్థానంలో క్లోపిడోగ్రెల్ వచ్చింది.",
      ta: "மருத்துவமனை டிஸ்சார்ஜ் மற்றும் கிளினிக் சீட்டுக்கு இடையே 4 முக்கிய வேறுபாடுகள் கண்டறியப்பட்டுள்ளன. மெட்பார்மின், டெல்மிசார்டன் மற்றும் அடோர்வாஸ்டாடின் அளவுகள் அதிகரிக்கப்பட்டுள்ளன. ஆஸ்பிரினுக்கு பதிலாக குளோபிடோக்ரல் சேர்க்கப்பட்டுள்ளது.",
      kn: "ಆಸ್ಪತ್ರೆ ಡಿಸ್ಚಾರ್ಜ್ ಮತ್ತು ಕ್ಲಿನಿಕ್ ಚೀಟಿಯ ನಡುವೆ 4 ಪ್ರಮುಖ ವ್ಯತ್ಯಾಸಗಳು ಕಂಡುಬಂದಿವೆ. ಮೆಟ್‌ಫಾರ್ಮಿನ್ (+500mg), ಟೆಲ್ಮಿಸಾರ್ಟನ್ (+40mg), ಅಟೋರ್ವಾಸ್ಟಾಟಿನ್ (+20mg) ಪ್ರಮಾಣ ಹೆಚ್ಚಿಸಲಾಗಿದೆ. ಆಸ್ಪಿರಿನ್ ಬದಲಿಗೆ ಕ್ಲೋಪಿಡೋಗ್ರೆಲ್ ನೀಡಲಾಗಿದೆ.",
      ml: "ആശുപത്രി ഡിസ്ചാർജും പഴയ ക്ലിനിക്ക് കുറിപ്പടിയും തമ്മിൽ 4 പ്രധാന വ്യത്യാസങ്ങൾ കണ്ടെത്തി. മെറ്റ്ഫോർമിൻ, ടെൽമിസാർട്ടൻ, അറ്റോർവാസ്റ്റാറ്റിൻ ഡോസുകൾ വർദ്ധിപ്പിച്ചു. ആസ്പിരിന് പകരം ക്ലോപിഡോഗ്രൽ നൽകിയിട്ടുണ്ട്.",
      mr: "हॉस्पिटल डिस्चार्ज आणि जुन्या क्लिनिक चिठ्ठीमध्ये ४ महत्त्वाचे फरक आढळले आहेत. मेटफॉर्मिन (+500mg), टेल्मीसार्टन (+40mg) आणि अ‍ॅटोरव्हास्टॅटिन (+20mg) चे डोस वाढवले आहेत. अ‍ॅस्पिरिनच्या जागी क्लोपिडोग्रेल सुरू केले आहे.",
      gu: "હોસ્પિટલ ડિસ્ચાર્જ અને જૂના ક્લિનિક પ્રિસ્ક્રિપ્શન વચ્ચે 4 મહત્વના તફાવતો જોવા મળ્યા છે. મેટફોર્મિન (+500mg), ટેલ્મિસાર્ટન (+40mg) અને એટોરવાસ્ટેટિન (+20mg) વધારવામાં આવ્યા છે. એસ્પિરિનની જગ્યાએ ક્લોપિડોગ્રેલ શરૂ કરાઈ છે."
    },
    conflicts: [
      {
        drugName: "Metformin HCl",
        category: "dose_mismatch",
        severity: "high",
        docAValue: "1000 mg (1-0-1 Twice Daily After Food)",
        docBValue: "500 mg (1-0-1 Twice Daily After Food)",
        differenceDescription: "Dose Escalation: Document A specifies 1000mg per dose (2000mg/day total), whereas Document B specifies 500mg per dose (1000mg/day total). This is a 100% dose increase.",
        caregiverWarning: "Confusing these two papers could lead to accidental double-dosing (taking both 500mg and 1000mg strips) or under-dosing. Keep older 500mg strips separated.",
        doctorQuestionEn: "Doctor/Pharmacist: Hospital discharge prescribed Metformin 1000mg BID, while clinic had 500mg BID. Should Papa strictly continue 1000mg and discard the 500mg strips?",
        doctorQuestionHi: "डॉक्टर साहब: अस्पताल डिस्चार्ज में मेटफॉर्मिन 1000mg (दिन में 2 बार) है जबकि क्लीनिक पर्चे में 500mg थी। क्या हम पुरानी 500mg दवा हटाकर केवल 1000mg ही दें?",
        doctorQuestionTe: "డాక్టర్ గారు: హాస్పిటల్ వారు మెట్‌ఫార్మిన్ 1000mg ఇచ్చారు, మునుపటి క్లినిక్‌లో 500mg ఉంది. మేము పాత 500mg మాత్రలు ఆపేసి 1000mg మాత్రమే కొనసాగించాలా?",
        doctorQuestionTa: "மருத்துவர்: டிஸ்சார்ஜில் மெட்பார்மின் 1000mg உள்ளது, ஆனால் பழைய கிளினிக்கில் 500mg இருந்தது. 1000mg மட்டுமே தொடர வேண்டுமா?",
        doctorQuestionKn: "ವೈದ್ಯರೇ: ಆಸ್ಪತ್ರೆಯಲ್ಲಿ ಮೆಟ್‌ಫಾರ್ಮಿನ್ 1000mg ನೀಡಿದ್ದಾರೆ, ಕ್ಲಿನಿಕ್‌ನಲ್ಲಿ 500mg ಇತ್ತು. ನಾವು ಹಳೆಯ 500mg ಮಾತ್ರೆಗಳನ್ನು ನಿಲ್ಲಿಸಿ 1000mg ಮಾತ್ರ ಮುಂದುವರಿಸಬೇಕೇ?",
        doctorQuestionMl: "ഡോക്ടർ: ആശുപത്രിയിൽ മെറ്റ്ഫോർമിൻ 1000mg ആണ് നൽകിയത്, എന്നാൽ ക്ലിനിക്കിൽ 500mg ആയിരുന്നു. ഞങ്ങൾ പഴയ 500mg നിർത്തി 1000mg മാത്രം തുടരണോ?",
        doctorQuestionMr: "डॉक्टर: हॉस्पिटल डिस्चार्जमध्ये मेटफॉर्मिन 1000mg आहे तर जुन्या चिठ्ठीत 500mg होते. जुनी 500mg बंद करून फक्त 1000mg सुरू ठेवायची का?",
        doctorQuestionGu: "ડોક્ટર: હોસ્પિટલમાંથી મેટફોર્મિન 1000mg લખી છે, જ્યારે ક્લિનિકમાં 500mg હતી. શું જૂની 500mg બંધ કરીને માત્ર 1000mg જ ચાલુ રાખવી?"
      },
      {
        drugName: "Telmisartan (Blood Pressure)",
        category: "dose_mismatch",
        severity: "medium",
        docAValue: "80 mg (1-0-0 Morning)",
        docBValue: "40 mg (1-0-0 Morning)",
        differenceDescription: "Dose Doubled: Blood pressure medicine was stepped up from 40mg to 80mg in the hospital.",
        caregiverWarning: "Monitor morning sitting blood pressure. If BP drops below 110/70 mmHg or Papa feels lightheaded, inform the doctor immediately.",
        doctorQuestionEn: "Is Telmisartan 80mg Papa's permanent daily BP dose now, or was it a temporary hospital adjustment?",
        doctorQuestionHi: "क्या टेल्मीसार्टन 80mg स्थायी डोज़ है, या अस्पताल में अस्थाई रूप से बढ़ाई गई थी?",
        doctorQuestionTe: "టెల్మిసార్టన్ 80mg శాశ్వత డోస్ ఆ, లేక బీపీ తనిఖీ చేసి 40mg కి తగ్గించాలా?",
        doctorQuestionTa: "டெல்மிசார்டன் 80mg நிரந்தர அளவா அல்லது இரத்த அழுத்தத்தை பரிசோதித்து குறைக்க வேண்டுமா?",
        doctorQuestionKn: "ಟೆಲ್ಮಿಸಾರ್ಟನ್ 80mg ಕಾಯಂ ಪ್ರಮಾಣವೇ ಅಥವಾ ರಕ್ತದೊತ್ತಡ ಪರಿಶೀಲಿಸಿ 40mg ಗೆ ಇಳಿಸಬೇಕೇ?",
        doctorQuestionMl: "ടെൽമിസാർട്ടൻ 80mg സ്ഥിരമായ ഡോസാണോ, അതോ പ്രഷർ പരിശോധിച്ച് 40mg ആക്കണമോ?",
        doctorQuestionMr: "टेल्मीसार्टन 80mg हा कायमचा डोस आहे की बीपी तपासून 40mg करायचा?",
        doctorQuestionGu: "ટેલ્મિસાર્ટન 80mg કાયમી ડોઝ છે કે પછી બ્લડ પ્રેશર તપાસીને 40mg કરવો?"
      },
      {
        drugName: "Atorvastatin (Cholesterol / Plaque)",
        category: "dose_mismatch",
        severity: "medium",
        docAValue: "40 mg (0-0-1 Bedtime)",
        docBValue: "20 mg (0-0-1 Bedtime)",
        differenceDescription: "High-Intensity Statin: Dose stepped up from 20mg to 40mg to protect the newly inserted drug-eluting cardiac stent.",
        caregiverWarning: "Atorvastatin 40mg is standard post-stenting therapy. Give at bedtime with water.",
        doctorQuestionEn: "Should Papa continue Atorvastatin 40mg for intensive stent protection, and when should liver enzymes (SGOT/SGPT) be checked?",
        doctorQuestionHi: "क्या स्टेंट की सुरक्षा के लिए एटोरवास्टेटिन 40mg ही चालू रखनी है?",
        doctorQuestionTe: "గుండె స్టెంట్ రక్షణ కోసం అటోర్వాస్టాటిన్ 40mg కొనసాగించాలా?",
        doctorQuestionTa: "இதய ஸ்டென்ட் பாதுகாப்பிற்காக அடோர்வாஸ்டாடின் 40mg தொடர வேண்டுமா?",
        doctorQuestionKn: "ಹೃದಯದ ಸ್ಟೆಂಟ್ ರಕ್ಷಣೆಗಾಗಿ ಅಟೋರ್ವಾಸ್ಟಾಟಿನ್ 40mg ಮುಂದುವರಿಸಬೇಕೇ?",
        doctorQuestionMl: "ഹൃദയത്തിലെ സ്റ്റെന്റ് സംരക്ഷണത്തിനായി അറ്റോർവാസ്റ്റാറ്റിൻ 40mg തുടരണോ?",
        doctorQuestionMr: "हार्ट स्टेंटच्या सुरक्षेसाठी अ‍ॅटोरव्हास्टॅटिन 40mg चालू ठेवायची का?",
        doctorQuestionGu: "હાર્ટ સ્ટેન્ટની સુરક્ષા માટે એટોરવાસ્ટેટિન 40mg ચાલુ રાખવી?"
      },
      {
        drugName: "Blood Thinner: Clopidogrel vs Aspirin",
        category: "substitution_risk",
        severity: "critical",
        docAValue: "Tab Clopidogrel 75 mg (Added post-stent)",
        docBValue: "Tab Aspirin 75 mg (Prescribed in clinic)",
        differenceDescription: "Antiplatelet Substitution: Document A introduced Clopidogrel 75mg. Document B contained Aspirin 75mg.",
        caregiverWarning: "CRITICAL SAFETY GUARD: Do NOT allow Papa to take both Aspirin and Clopidogrel together unless the cardiologist has explicitly written a Dual Antiplatelet (DAPT) protocol. Taking duplicate blood thinners without instruction risks internal bleeding.",
        doctorQuestionEn: "Cardiologist Verification: Papa was given Clopidogrel 75mg post-stent. Should he stop his old Aspirin 75mg completely, or is he on dual antiplatelet therapy?",
        doctorQuestionHi: "अस्पताल ने क्लोपिडोग्रेल 75mg दी है। क्या पुराना एस्पिरिन 75mg पूरी तरह बंद कर दें, या दोनों साथ लेनी हैं?",
        doctorQuestionTe: "స్టెంట్ తర్వాత క్లోపిడోగ్రెల్ 75mg ఇచ్చారు. పాత ఆస్ప్రిన్ పూర్తిగా ఆపేయాలా?",
        doctorQuestionTa: "ஸ்டென்ட் வைக்கப்பட்ட பிறகு குளோபிடோக்ரல் 75mg தரப்பட்டுள்ளது. பழைய ஆஸ்பிரினை முழுமையாக நிறுத்த வேண்டுமா?",
        doctorQuestionKn: "ಸ್ಟೆಂಟ್ ನಂತರ ಕ್ಲೋಪಿಡೋಗ್ರೆಲ್ 75mg ನೀಡಲಾಗಿದೆ. ಹಳೆಯ ಆಸ್ಪಿರಿನ್ ಅನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ನಿಲ್ಲಿಸಬೇಕೇ?",
        doctorQuestionMl: "സ്റ്റെന്റിന് ശേഷം ക്ലോപിഡോഗ്രൽ 75mg നൽകി. പഴയ ആസ്പിരിൻ പൂർണ്ണമായും നിർത്തണമോ?",
        doctorQuestionMr: "स्टेंटनंतर क्लोपिडोग्रेल 75mg दिले आहे. जुने अ‍ॅस्पिरिन पूर्णपणे बंद करायचे का?",
        doctorQuestionGu: "સ્ટેન્ટ પછી ક્લોપિડોગ્રેલ 75mg આપી છે. શું જૂની એસ્પિરિન સંપૂર્ણ બંધ કરી દેવી?"
      }
    ]
  },
  {
    id: "COMP-MAA-THYROID-ADJUSTMENT",
    familyMember: "maa",
    title: "Maa's Recent Endocrinology Rx vs Previous General Physician Slip",
    docA: {
      id: "DOC-A-ENDO",
      title: "Apollo Endocrinology Prescription",
      date: "2026-09-22",
      facility: "Apollo Specialty Clinic",
      doctor: "Dr. Meenakshi Sundaram, MD",
      type: "Specialist Rx"
    },
    docB: {
      id: "DOC-B-GP",
      title: "Family Clinic Prescription Slip",
      date: "2026-03-15",
      facility: "Sector 14 Family Clinic",
      doctor: "Dr. Alok Verma, MBBS",
      type: "Clinic Rx"
    },
    conflictSummary: {
      en: "Thyronorm dosage doubled from 25mcg to 50mcg because Maa's TSH remained elevated at 7.8 uIU/mL. Weekly Vitamin D3 60,000 IU was newly added.",
      hi: "माँ की थायरोनॉर्म डोज़ 25mcg से बढ़ाकर 50mcg कर दी गई है क्योंकि उनका TSH 7.8 uIU/mL पर बढ़ा हुआ था। साथ ही हफ्ते में एक बार विटामिन डी का पाउच जोड़ा गया है।",
      te: "అమ్మగారి TSH 7.8 ఉండటం వల్ల థైరోనార్మ్ డోస్ 25mcg నుండి 50mcg కి పెంచారు. వారానికి ఒకసారి విటమిన్ డి3 చేర్చారు.",
      ta: "TSH 7.8 uIU/mL ஆக இருந்ததால் தைரோநார்ம் 25mcg லிருந்து 50mcg ஆக அதிகரிக்கப்பட்டது. வாராந்திர வைட்டமின் டி3 60,000 IU சேர்க்கப்பட்டது.",
      kn: "ಅಮ್ಮನ TSH 7.8 ಇರುವುದರಿಂದ ಥೈರೋನಾರ್ಮ್ ಡೋಸ್ 25mcg ನಿಂದ 50mcg ಗೆ ಹೆಚ್ಚಿಸಲಾಗಿದೆ. ವಾರಕ್ಕೊಮ್ಮೆ ವಿಟಮಿನ್ ಡಿ3 60,000 IU ಸೇರಿಸಲಾಗಿದೆ.",
      ml: "അമ്മയുടെ TSH 7.8 ആയതിനാൽ തൈറോനോർം 25mcg-ൽ നിന്ന് 50mcg ആയി കൂട്ടി. ആഴ്ചയിലൊരിക്കൽ വിറ്റാമിൻ ഡി3 60,000 IU നൽകി.",
      mr: "आईंचे TSH 7.8 असल्याने थायरॉनॉर्मचा डोस 25mcg वरून 50mcg करण्यात आला. आठवड्यातून एकदा व्हिटॅमिन डी3 60,000 IU सुरू केले आहे.",
      gu: "મમ્મીનું TSH 7.8 હોવાથી થાઇરોનોર્મનો ડોઝ 25mcg થી વધારીને 50mcg કરાયો છે. અઠવાડિયે એક વાર વિટામિન ડી3 60,000 IU ઉમેરાયું છે."
    },
    conflicts: [
      {
        drugName: "Tab Thyronorm (Levothyroxine)",
        category: "dose_mismatch",
        severity: "high",
        docAValue: "50 mcg (Empty Stomach Morning)",
        docBValue: "25 mcg (Empty Stomach Morning)",
        differenceDescription: "Dose Titration: 25mcg stepped up to 50mcg to control elevated TSH (7.8 uIU/mL).",
        caregiverWarning: "Ensure Maa stops taking any leftover 25mcg strips so she does not accidentally take 25mcg instead of 50mcg.",
        doctorQuestionEn: "Doctor: Maa is now starting 50mcg Thyronorm. Should we schedule a repeat TSH test in 6 weeks?",
        doctorQuestionHi: "डॉक्टर: माँ को अब 50mcg ही देनी है? 6 हफ्ते बाद TSH दोबारा कब चेक कराएं?",
        doctorQuestionTe: "డాక్టర్: అమ్మకి ఇప్పుడు 50mcg మొదలుపెట్టాం. 6 వారాల తర్వాత మళ్ళీ TSH పరీక్ష చేయించాలా?",
        doctorQuestionTa: "மருத்துவர்: இப்போது 50mcg தைரோநார்ம் தொடங்குகிறோம். 6 வாரங்களுக்குப் பிறகு TSH மீண்டும் பரிசோதிக்க வேண்டுமா?",
        doctorQuestionKn: "ವೈದ್ಯರೇ: ಅಮ್ಮನಿಗೆ ಈಗ 50mcg ನೀಡುತ್ತಿದ್ದೇವೆ. 6 ವಾರಗಳ ನಂತರ ಮತ್ತೆ TSH ಪರೀಕ್ಷೆ ಮಾಡಿಸಬೇಕೇ?",
        doctorQuestionMl: "ഡോക്ടർ: അമ്മയ്ക്ക് ഇപ്പോൾ 50mcg ആണ് നൽകുന്നത്. 6 ആഴ്ചയ്ക്ക് ശേഷം TSH വീണ്ടും പരിശോധിക്കണോ?",
        doctorQuestionMr: "डॉक्टर: आईंना आता 50mcg सुरू केले आहे. ६ आठवड्यांनंतर पुन्हा TSH तपासणी करायची का?",
        doctorQuestionGu: "ડોક્ટર: મમ્મીને હવે 50mcg શરૂ કરી છે. 6 અઠવાડિયા પછી ફરી TSH ટેસ્ટ કરાવવો?"
      },
      {
        drugName: "Vitamin D3 (Cholecalciferol)",
        category: "new_medication",
        severity: "medium",
        docAValue: "60,000 IU Sachet (Once Weekly)",
        docBValue: "Not prescribed in older slip",
        differenceDescription: "New Medicine Added: High-dose weekly Vitamin D3 prescribed for bone and knee osteoarthritis support.",
        caregiverWarning: "Give only ONCE a week (every Sunday), dissolved in lukewarm milk. Do NOT take daily.",
        doctorQuestionEn: "For how many weeks should Maa take the weekly 60,000 IU sachet before switching to a daily maintenance dose?",
        doctorQuestionHi: "विटामिन डी का यह 60,000 IU पाउच कितने हफ़्तों तक देना है?",
        doctorQuestionTe: "ఈ 60,000 IU విటమిన్ డి ఎన్ని వారాలు ఇవ్వాలి?",
        doctorQuestionTa: "இந்த 60,000 IU வைட்டமின் டி சாச்செட்டை எத்தனை வாரங்கள் எடுக்க வேண்டும்?",
        doctorQuestionKn: "ಈ 60,000 IU ವಿಟಮಿನ್ ಡಿ ಸಾಚೆಯನ್ನು ಎಷ್ಟು ವಾರಗಳವರೆಗೆ ತೆಗೆದುಕೊಳ್ಳಬೇಕು?",
        doctorQuestionMl: "ഈ 60,000 IU വിറ്റാമിൻ ഡി എത്ര ആഴ്ചകൾ കഴിക്കണം?",
        doctorQuestionMr: "हे 60,000 IU व्हिटॅमिन डी पाऊच किती आठवडे घ्यायचे आहे?",
        doctorQuestionGu: "આ 60,000 IU વિટામિન ડી પાઉચ કેટલા અઠવાડિયા સુધી લેવું?"
      }
    ]
  }
];
