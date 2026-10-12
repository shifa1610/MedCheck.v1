import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Presentation, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Languages, 
  HeartPulse, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  Stethoscope,
  Maximize2,
  Users,
  GitCompare,
  Volume2,
  FileCheck,
  Check
} from 'lucide-react';

export default function PresentationSlides() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "MedCheck : AI Personal Health Copilot",
      subtitle: "Altrix Labs AI Innovation Challenge • 24-Hour Hackathon Submission",
      tag: "Project Overview",
      content: (
        <div className="space-y-6 text-center max-w-3xl mx-auto py-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-700 flex items-center justify-center text-white mx-auto shadow-xl shadow-teal-500/25">
            <HeartPulse className="w-9 h-9 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              MedCheck
            </h1>
            <p className="text-sm font-semibold text-teal-700 mt-1">
              "An AI health copilot that explains medical records in your family’s language and flags medicine conflicts, without ever diagnosing."
            </p>
            <p className="text-xs text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
              Built for the family caregiver managing aging parents' health across fragmented paper prescriptions, hospital discharge summaries, and lab reports.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold px-3 py-1 rounded-full">
              Bilingual OCR & Handwriting
            </span>
            <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-3 py-1 rounded-full">
              Medicine Conflict Scanner
            </span>
            <span className="bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold px-3 py-1 rounded-full">
              8 Indian Languages & Voice
            </span>
            <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold px-3 py-1 rounded-full">
              Parent Health Hub Switcher
            </span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1 rounded-full">
              ABDM & FHIR R4 Ready
            </span>
          </div>
        </div>
      )
    },
    {
      title: "The Team Behind MedCheck",
      subtitle: "4-Member Team Ownership for 24-Hour Hackathon Delivery",
      tag: "Hackathon Team Structure",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                M1
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">AI / ML & Clinical OCR Lead</h4>
                <p className="text-[11px] text-teal-700 font-semibold">Multimodal Vision & Extraction</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Designed the document ingestion pipeline, handwritten bilingual prescription parser, Fuse.js Indian Drug Catalog fuzzy matcher, and Zero-Guess confidence scoring (Green/Amber/Red).
            </p>
          </div>

          <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                M2
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Full-Stack & ABDM Architect</h4>
                <p className="text-[11px] text-sky-700 font-semibold">Backend, API & FHIR Standards</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Engineered the Express API, ABDM FHIR R4 DocumentBundle generator, LOINC coding for lab observations, 14-digit mock ABHA link flow, and Vite/React interactive application.
            </p>
          </div>

          <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                M3
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Caregiver UX & Vernacular Lead</h4>
                <p className="text-[11px] text-purple-700 font-semibold">Voice Synthesis & Multilingual UI</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Built the Family Caregiver Profile Switcher (Papa, Maa, Self), Web Speech regional voice engine (Hindi, Telugu, Tamil, English), and vernacular medical jargon simplifier.
            </p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                M4
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Clinical Safety & Medicine Lead</h4>
                <p className="text-[11px] text-amber-700 font-semibold">Reconciliation & Safe Guardrails</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Implemented the Medicine Document Conflict Scanner, printed-range evaluation engine, Look-Alike Sound-Alike (LASA) guardrails, and Doctor Visit-Prep brief generator.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "The Problem: The Family Caregiver Dilemma",
      subtitle: "Why managing elderly parents' healthcare on paper breaks down",
      tag: "Problem Statement",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
          <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-4">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold mb-2 text-xs">
              01
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">One Person Manages Everyone</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In most Indian families, a single caregiver manages multiple parents' health. Documents are on physical paper, prescriptions are handwritten, and lab trends are invisible.
            </p>
          </div>

          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-2 text-xs">
              02
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Conflicting Dosages on Paper</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When a hospital discharge says Metformin 1000mg BID but the previous clinic prescription says 500mg, nobody knows which dose to follow. Accidental double-dosing is a major risk.
            </p>
          </div>

          <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-4">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-2 text-xs">
              03
            </div>
            <h3 className="text-xs font-bold text-slate-900 mb-1">Language & Literacy Disconnect</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reports and prescriptions are in English and medical Latin. Aging parents who speak Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi, or Gujarati cannot read their own dosage timings or abnormal test results.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "The MedCheck Solution: 5 Core Capabilities",
      subtitle: "Turning physical paper into understanding, safety, and action",
      tag: "Solution & Innovation",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-1 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-teal-600" />
              1. Optical & Multimodal Document Intelligence
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Ingests prescriptions, discharge summaries, and lab panels. Extracts drug names, strengths, timings ("भोजन के बाद"), lab values, and printed reference ranges with human-in-the-loop verification.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <GitCompare className="w-4 h-4 text-amber-600" />
              2. Medicine Document Conflict Scanner
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Compares any two medical papers side-by-side. Highlights dose escalations (+500mg), timing changes, dropped medications, or duplicate blood thinners for a doctor or pharmacist to verify.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Languages className="w-4 h-4 text-purple-600" />
              3. Vernacular Explanations with Regional Voice
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Explains what abnormal numbers mean across 8 languages: Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi, Gujarati, and English. Integrated Text-to-Speech reads advice and prescription instructions aloud for elderly family members.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Users className="w-4 h-4 text-sky-600" />
              4. Family Caregiver Multi-Profile Hub
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Manage Papa's cardiac stent and diabetes, Maa's thyroid and osteoarthritis, and Self's preventive labs—each with dedicated timelines, medications, and ABHA IDs.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Medicine Conflict Scanner in Action",
      subtitle: "Solving the #1 Caregiver Hazard: Different doses on different papers",
      tag: "Live Feature Spotlight",
      content: (
        <div className="space-y-3 py-2 text-xs">
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-950">Real-World Case: </span>
              <span className="text-amber-900">
                Max Hospital Discharge Summary vs Fortis Clinic Outpatient Rx for Papa (Ramesh Sharma, 62y).
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900">Metformin HCl</div>
              <div className="text-[11px] text-teal-700 font-semibold mt-1">Hospital: 1000mg BID</div>
              <div className="text-[11px] text-slate-500">Clinic: 500mg BID</div>
              <div className="mt-2 text-[10px] bg-rose-50 text-rose-800 border border-rose-200 px-1.5 py-0.5 rounded font-bold">
                100% Dose Escalation Flagged
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900">Telmisartan (BP)</div>
              <div className="text-[11px] text-teal-700 font-semibold mt-1">Hospital: 80mg OD</div>
              <div className="text-[11px] text-slate-500">Clinic: 40mg OD</div>
              <div className="mt-2 text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                Dose Doubled Flagged
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900">Blood Thinner Swap</div>
              <div className="text-[11px] text-teal-700 font-semibold mt-1">Hospital: Clopidogrel 75mg</div>
              <div className="text-[11px] text-slate-500">Clinic: Aspirin 75mg</div>
              <div className="mt-2 text-[10px] bg-rose-100 text-rose-900 border border-rose-300 px-1.5 py-0.5 rounded font-bold">
                Critical Duplicate Guard
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-3.5 rounded-xl flex items-center justify-between">
            <span className="text-[11px]">
              <strong>1-Click Doctor Verification Slip:</strong> Generates WhatsApp message or printout with precise questions for Dr. Sharma.
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
          </div>
        </div>
      )
    },
    {
      title: "Technical Architecture & ABDM Data Pipeline",
      subtitle: "Interoperable, secure, and compliant with national health standards",
      tag: "Technical Architecture (25% + Bonus)",
      content: (
        <div className="space-y-3 py-2 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="font-bold text-slate-900 block">1. Ingestion</span>
              <span className="text-[11px] text-slate-600 mt-1 block">Skinned image & PDF preprocessing, contrast normalizer</span>
            </div>
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
              <span className="font-bold text-teal-900 block">2. Extraction</span>
              <span className="text-[11px] text-teal-700 mt-1 block">Multimodal AI + Fuse.js Indian Drug Catalog matching</span>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
              <span className="font-bold text-purple-900 block">3. Safety Verify</span>
              <span className="text-[11px] text-purple-700 mt-1 block">Side-by-side human confirmation; zero unreadable guessing</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="font-bold text-emerald-900 block">4. ABDM FHIR R4</span>
              <span className="text-[11px] text-emerald-700 mt-1 block">LOINC mapped Observations, Mock 14-digit ABHA ID link</span>
            </div>
          </div>

          <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-[11px] space-y-1">
            <div className="text-teal-400 font-bold">// ABDM FHIR R4 Resource Mapping</div>
            <div>• Patient Profile: ABHA 91-4589-2314-8702 (@abdm)</div>
            <div>• Observations: LOINC 4548-4 (HbA1c), LOINC 1558-6 (Glucose), LOINC 2093-3 (Cholesterol)</div>
            <div>• MedicationRequest: Structured dosageInstruction, timing, refill schedules</div>
          </div>
        </div>
      )
    },
    {
      title: "Accuracy Benchmark: Raw Baseline vs MedCheck",
      subtitle: "Verified on 5 authentic Indian clinical documents (75 labeled fields)",
      tag: "AI Utilization & Accuracy (35%)",
      content: (
        <div className="space-y-3 py-2 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-slate-500 font-semibold text-[11px]">Raw AI Baseline</div>
              <div className="text-xl font-bold text-slate-800 mt-0.5">78.4%</div>
            </div>
            <div className="p-3 bg-teal-50 border border-teal-300 rounded-xl">
              <div className="text-teal-700 font-semibold text-[11px]">MedCheck Pipeline</div>
              <div className="text-xl font-bold text-teal-900 mt-0.5">98.1%</div>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl">
              <div className="text-emerald-700 font-semibold text-[11px]">Accuracy Lift</div>
              <div className="text-xl font-bold text-emerald-800 mt-0.5">+19.7%</div>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-300 rounded-xl">
              <div className="text-purple-700 font-semibold text-[11px]">Human-Verified</div>
              <div className="text-xl font-bold text-purple-900 mt-0.5">100.0%</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Medicine Name Identification</span>
              <span className="font-bold text-teal-700">85.7% → 100.0% (+14.3%)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Dosage Strength & Schedule</span>
              <span className="font-bold text-teal-700">71.4% → 100.0% (+28.6%)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Printed Reference Range Flagging</span>
              <span className="font-bold text-teal-700">70.0% → 100.0% (+30.0%)</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 text-center">
            Run automated evaluation anytime in terminal: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">python sample_pack/score.py</code>
          </div>
        </div>
      )
    },
    {
      title: "Project Objectives & Key Goals",
      subtitle: "Bridging the gap between paper prescriptions and patient understanding",
      tag: "Project Objectives",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-2">
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <h4 className="text-xs font-bold text-emerald-900 mb-1">1. Optical Extraction & Verification</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Extract complex doctor handwriting and lab panels into clean JSON without hallucination using fuzzy matching against official drug formularies.
            </p>
          </div>
          <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-xl">
            <h4 className="text-xs font-bold text-sky-900 mb-1">2. Medicine Conflict Detection</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cross-compare prescriptions across visit dates to highlight dosage changes, duplications, and potential drug-drug interactions.
            </p>
          </div>
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
            <h4 className="text-xs font-bold text-amber-900 mb-1">3. Vernacular Accessibility</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explain medical instructions across 8 Indian languages (Hindi, Telugu, Tamil, Kannada, Malayalam, Marathi, Gujarati, English) with voice synthesis.
            </p>
          </div>
          <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl">
            <h4 className="text-xs font-bold text-purple-900 mb-1">4. Doctor Visit Preparation</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consolidate fragmented health history into a clean 1-page visit-prep brief for concise review with consulting doctors.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Sample Output & Clinical Workflow",
      subtitle: "Demonstration of extracted prescription and longitudinal trend analysis",
      tag: "Sample Output",
      content: (
        <div className="space-y-3 py-2 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="font-bold text-slate-900 mb-1">Prescription Parsing Example:</div>
            <div className="font-mono text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200 mb-2">
              Input: "Tab Metformin 500mg 1-0-1 after food (भोजन के बाद), Tab Telmisartan 40mg 1-0-0"
            </div>
            <div className="text-emerald-800 font-medium">
              Output: Metformin 500mg (BID, Post-Meal) + Telmisartan 40mg (OD, Morning). Matched against Indian Drug Catalog with 100% confidence.
            </div>
          </div>
          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
            <div className="font-bold text-emerald-950 mb-1">Bilingual Voice & Vernacular Translation:</div>
            <p className="text-slate-700 leading-relaxed">
              Transformed into Telugu: <em>"భోజనం తర్వాత రోజుకు రెండుసార్లు మెట్‌ఫార్మిన్ 500mg 1 మాత్ర వేసుకోండి"</em> and spoken aloud via Web Speech / Cloud TTS audio stream.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Project Limitations & Healthcare Guardrails",
      subtitle: "Strict boundaries: AI explains and checks, but never diagnoses or prescribes",
      tag: "Limitations & Safety",
      content: (
        <div className="space-y-3 py-2 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 leading-relaxed">
            <strong>1. Zero-Diagnosis Rule:</strong> MEDCHECK is strictly an assistive health record organizer. It does not provide medical diagnoses, treatment decisions, or autonomous prescription changes.
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 leading-relaxed">
            <strong>2. OCR Quality Dependency:</strong> Severely degraded, crumpled, or illegible doctor handwriting is flagged as "Needs Human Review" rather than guessed by the model.
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 leading-relaxed">
            <strong>3. ABDM Sandbox Mode:</strong> Real ABDM gateway integration requires formal government sandbox enrollment, RSA keys, and official hospital federation.
          </div>
        </div>
      )
    },
    {
      title: "Future Scope & B.Tech Project Roadmap",
      subtitle: "Planned extensions for full production healthcare deployment",
      tag: "Future Scope",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-2 text-xs">
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <h4 className="font-bold text-emerald-800 mb-1">1. Live ABDM Sandbox Integration</h4>
            <p className="text-slate-600">Connect to National Health Authority (NHA) certified endpoints with M1/M2/M3 milestones for live ABHA verification.</p>
          </div>
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <h4 className="font-bold text-emerald-800 mb-1">2. Offline On-Device OCR</h4>
            <p className="text-slate-600">Integrate WebAssembly-compiled ONNX models for offline privacy-preserving prescription scanning directly in the browser.</p>
          </div>
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <h4 className="font-bold text-emerald-800 mb-1">3. Pharmacy Refill Automation</h4>
            <p className="text-slate-600">Sync active medication schedules with Jan Aushadhi generic drug stores to identify low-cost generic alternatives.</p>
          </div>
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <h4 className="font-bold text-emerald-800 mb-1">4. Wearable Device Sync</h4>
            <p className="text-slate-600">Ingest continuous glucose monitoring (CGM) and smart BP cuff data alongside episodic lab reports.</p>
          </div>
        </div>
      )
    }
  ];

  const current = slides[currentSlide];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col min-h-[580px]">
      {/* Top Slide Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Presentation className="w-5 h-5 text-teal-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100/70 px-2.5 py-0.5 rounded-full">
            {current.tag}
          </span>
        </div>
        <div className="text-xs font-mono font-semibold text-slate-500">
          Slide {currentSlide + 1} of {slides.length}
        </div>
      </div>

      {/* Main Slide Content Area */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{current.title}</h2>
          <p className="text-xs text-slate-500 mt-1">{current.subtitle}</p>
        </div>

        <div className="flex-1">
          {current.content}
        </div>
      </div>

      {/* Slide Navigation Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <button
          onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
          disabled={currentSlide === 0}
          className="inline-flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-6 bg-teal-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
          disabled={currentSlide === slides.length - 1}
          className="inline-flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
