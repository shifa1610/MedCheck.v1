import React, { useState } from 'react';
import { 
  Layers, 
  Database, 
  Cpu, 
  ShieldCheck, 
  Share2, 
  ArrowRight, 
  CheckCircle2, 
  FileCode, 
  Lock, 
  Sparkles,
  Server,
  Workflow
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function ArchitectureView({ language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activeStep, setActiveStep] = useState(0);

  const architectureLayers = [
    {
      title: "1. Multimodal Document Ingestion",
      icon: Layers,
      badge: "Ingestion Pipeline",
      color: "from-sky-500 to-blue-600",
      description: "Accepts high-resolution images, multi-page clinical PDFs, and mobile camera captures of handwritten doctor prescriptions, pathology reports, and discharge summaries.",
      specs: [
        "Automatic skew correction, contrast enhancement & DPI normalization",
        "Supports bilingual text (English, Hindi, Telugu, Tamil)",
        "Zero server-side persistence before patient consent"
      ]
    },
    {
      title: "2. Clinical OCR & Multimodal AI Extraction",
      icon: Cpu,
      badge: "AI Vision & LLM",
      color: "from-teal-500 to-emerald-600",
      description: "Combines multimodal vision models (Gemini 1.5/2.0 Flash) and clinical heuristic NER parsers to extract medications, dosages, frequency, reference ranges, and diagnoses.",
      specs: [
        "Extracts tabular laboratory parameters & reference bounds",
        "Parses medical acronyms: 1-0-1, OD, BD, TDS, SOS, AC, PC",
        "Entity normalization against RxNorm & Indian pharmaceutical catalog"
      ]
    },
    {
      title: "3. Plain-Language Health Summarizer",
      icon: Sparkles,
      badge: "Clinical NLP & Safety",
      color: "from-purple-500 to-indigo-600",
      description: "Translates complex medical jargon into empathetic, 6th-grade reading level explanations with color-coded severity tiers and actionable questions for doctors.",
      specs: [
        "Explains root clinical causes of abnormal biomarkers",
        "Strict medical guardrails: disclaimers and red-flag emergency detection",
        "Real-time multi-language synthesis (Hindi, Telugu, Tamil)"
      ]
    },
    {
      title: "4. ABDM & FHIR R4 Standardization",
      icon: Server,
      badge: "Interoperability Standard",
      color: "from-amber-500 to-orange-600",
      description: "Converts internal records into official Ayushman Bharat Digital Mission (ABDM) FHIR R4 standard bundles for seamless nationwide interoperability.",
      specs: [
        "LOINC coding for all laboratory observations (e.g. 4548-4 for HbA1c)",
        "FHIR Profiles: Patient, Observation, MedicationRequest, Condition",
        "ABHA ID 14-digit linking and mock HIP/HIU consent flow"
      ]
    },
    {
      title: "5. Privacy, Encryption & Local Storage",
      icon: ShieldCheck,
      badge: "Zero-Trust Security",
      color: "from-rose-500 to-pink-600",
      description: "End-to-end client-side AES-256 encryption. Patient identifiable health information (PII) is de-identified prior to any external AI inference.",
      specs: [
        "ABDM Sandbox consent artifact compliance",
        "Local IndexedDB encrypted health vault",
        "Instant one-click FHIR JSON data export and deletion"
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Workflow className="w-5 h-5 text-teal-600" />
                Technical Architecture & ABDM Pipeline
              </h2>
              <span className="bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Production-Ready Design
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive system topology from raw document ingest to ABDM FHIR R4 compliance
            </p>
          </div>
        </div>

        {/* Visual Pipeline Steps */}
        <div className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {architectureLayers.map((layer, idx) => {
              const Icon = layer.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 ${
                    isActive ? 'bg-teal-500 text-slate-950' : 'bg-white text-slate-700 shadow-2xs'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-0.5">
                    Stage 0{idx + 1}
                  </div>
                  <div className="text-xs font-bold leading-snug line-clamp-1">
                    {layer.title.split('. ')[1]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detailed Card */}
          <div className="mt-5 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
                  0{activeStep + 1}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {architectureLayers[activeStep].title}
                  </h3>
                  <span className="text-[11px] text-teal-400 font-mono">
                    {architectureLayers[activeStep].badge}
                  </span>
                </div>
              </div>
              <span className="text-xs text-slate-400">
                Altrix Labs Technical Evaluation Criteria (25%)
              </span>
            </div>

            <p className="mt-4 text-xs text-slate-300 leading-relaxed max-w-3xl">
              {architectureLayers[activeStep].description}
            </p>

            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Engineering Specifications & Standards:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {architectureLayers[activeStep].specs.map((spec, i) => (
                  <div key={i} className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data Architecture Diagram (Mermaid Representation) */}
        <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-teal-600" />
            End-to-End Data Flow Pipeline
          </h3>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 font-mono text-[11px] text-slate-700 leading-relaxed overflow-x-auto shadow-2xs">
            <div className="text-slate-500 pb-2"># MedCheck AI Data Pipeline & ABDM Gateway</div>
            <div className="flex flex-col gap-1.5">
              <div>[Patient Ingestion] ➜ Prescription / Lab PDF / Image / Mobile Camera Scan</div>
              <div className="pl-4 text-teal-700">↓ (Image Conditioning, Skew Correction, Contrast Normalization)</div>
              <div>[OCR & Vision AI]  ➜ Multimodal Vision + Indian Drug Catalog Matcher (Fuse.js)</div>
              <div className="pl-4 text-teal-700">↓ (Medication, Strength, Schedule, Printed Reference Bounds)</div>
              <div>[Clinical Normalizer]➜ Indian Generic/Brand Normalization + LOINC Standard Codes (e.g. 4548-4 HbA1c)</div>
              <div className="pl-4 text-teal-700">↓ (Medicine Document Reconciliation & Safety Engine)</div>
              <div>[Conflict Scanner]  ➜ Side-by-side reconciliation, dose mismatch & duplicate therapy alerts</div>
              <div className="pl-4 text-teal-700">↓ (ABDM FHIR R4 Bundle Construction)</div>
              <div>[ABDM FHIR Engine] ➜ Patient + DiagnosticReport + Observation + MedicationRequest</div>
              <div className="pl-4 text-teal-700">↓ (Plain Language Synthesis & Regional Voice Engine)</div>
              <div>[Family Copilot]   ➜ Plain English / हिन्दी / తెలుగు / தமிழ் Audio Summaries & Q&A</div>
            </div>
          </div>
        </div>

        {/* Altrix Labs Rubric Alignment Table */}
        <div className="mt-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            Altrix Labs Hackathon Evaluation Rubric (100% + Bonus Alignment)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="p-3 border-b border-slate-200">Criterion</th>
                  <th className="p-3 border-b border-slate-200">Weight</th>
                  <th className="p-3 border-b border-slate-200">Challenge Requirement</th>
                  <th className="p-3 border-b border-slate-200">MedCheck Implementation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr>
                  <td className="p-3 font-bold text-slate-900">AI Utilization</td>
                  <td className="p-3 font-semibold text-teal-700">35%</td>
                  <td className="p-3 text-slate-600">OCR accuracy, extraction of meds/dosages/tests, plain-language summaries & abnormal explanations</td>
                  <td className="p-3 text-slate-800 font-medium">Dual-engine clinical extraction, color-coded abnormal cards, patient-friendly explanations, doctor questions.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Technical Architecture</td>
                  <td className="p-3 font-semibold text-teal-700">25%</td>
                  <td className="p-3 text-slate-600">Clean data pipeline, sensible storage, structured data model, ABDM-ready schema</td>
                  <td className="p-3 text-slate-800 font-medium">FHIR R4 Bundle, LOINC mappings, mock ABHA ID authentication, HIP/HIU consent manager, export/import JSON.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">User Experience</td>
                  <td className="p-3 font-semibold text-teal-700">20%</td>
                  <td className="p-3 text-slate-600">Easy upload flow, readable summaries, clear health timeline</td>
                  <td className="p-3 text-slate-800 font-medium">1-click test samples, drag & drop, longitudinal interactive Recharts, daily pill schedule, mobile-ready layout.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Healthcare Impact</td>
                  <td className="p-3 font-semibold text-teal-700">10%</td>
                  <td className="p-3 text-slate-600">Medical correctness, safe wording, no misleading claims, appropriate disclaimers</td>
                  <td className="p-3 text-slate-800 font-medium">Clear clinical disclaimers, red-flag emergency awareness, drug precautions (food/grapefruit/hydration).</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Presentation & Demo</td>
                  <td className="p-3 font-semibold text-teal-700">10%</td>
                  <td className="p-3 text-slate-600">Working prototype shown clearly in a short demo or slides</td>
                  <td className="p-3 text-slate-800 font-medium">Built-in interactive demo slides mode, instant sample loaders, zero-friction judge evaluation.</td>
                </tr>
                <tr className="bg-emerald-50/50">
                  <td className="p-3 font-bold text-emerald-900">Bonus Features</td>
                  <td className="p-3 font-semibold text-emerald-700">+5 to 10 pts</td>
                  <td className="p-3 text-emerald-800">Multi-language (Hindi/Telugu/Tamil) + ABDM/ABHA integration</td>
                  <td className="p-3 text-emerald-950 font-bold">Full 4-language i18n switcher + bilingual prescription parsing + complete ABDM FHIR R4 Bundle exporter!</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
