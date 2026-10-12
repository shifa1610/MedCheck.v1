import React, { useState } from 'react';
import { 
  GitCompare, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  ArrowRight, 
  Printer, 
  Share2, 
  Check, 
  Volume2, 
  AlertCircle, 
  Clock, 
  Pill, 
  Sparkles, 
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';
import { PRELOADED_COMPARISONS, FAMILY_MEMBERS } from '../data/mockRecords';
import { TRANSLATIONS } from '../data/translations';
import VoicePlayer from './VoicePlayer';

export default function MedicineConflictDetector({ 
  currentFamilyKey = 'papa', 
  records = [], 
  language = 'en' 
}) {
  const [selectedComparisonId, setSelectedComparisonId] = useState(PRELOADED_COMPARISONS[0].id);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [printMode, setPrintMode] = useState(false);

  const activeComparison = PRELOADED_COMPARISONS.find(c => c.id === selectedComparisonId) || PRELOADED_COMPARISONS[0];
  const activeMember = FAMILY_MEMBERS[currentFamilyKey] || FAMILY_MEMBERS.papa;

  // Language text selector
  const conflictSummaryText = activeComparison.conflictSummary[language] || activeComparison.conflictSummary.en;

  // Generate WhatsApp text for caregiver sharing
  const generateCaregiverWhatsAppText = () => {
    let msg = `*MedCheck Caregiver Verification Alert* 🩺\n`;
    msg += `Patient: ${activeMember.name} (${activeMember.relation})\n`;
    msg += `Comparing: ${activeComparison.docA.title} (${activeComparison.docA.date}) vs ${activeComparison.docB.title} (${activeComparison.docB.date})\n\n`;
    msg += `*Key Differences Detected:*\n`;
    activeComparison.conflicts.forEach((c, idx) => {
      msg += `${idx + 1}. *${c.drugName}*\n`;
      msg += `   • Doc A: ${c.docAValue}\n`;
      msg += `   • Doc B: ${c.docBValue}\n`;
      const langCapitalized = language.charAt(0).toUpperCase() + language.slice(1);
      const q = c['doctorQuestion' + langCapitalized] || c.doctorQuestionEn;
      msg += `   • Ask Doctor: "${q}"\n\n`;
    });
    msg += `_Note: MedCheck flags differences for doctor verification. Never alter medications without consulting a physician._`;
    return msg;
  };

  const handleCopyWhatsApp = () => {
    const text = generateCaregiverWhatsAppText();
    navigator.clipboard.writeText(text);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Value Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-teal-500/10 border border-amber-200/80 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <GitCompare className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-extrabold text-slate-900">
                  Medicine Document Conflict & Difference Scanner
                </h1>
                <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Doctor Verification Required
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                When two documents show different doses of the same medicine, nobody knows which to follow. MedCheck compares prescriptions, discharge summaries, and clinic slips side-by-side to highlight differences for a doctor or pharmacist to verify—<strong>without ever diagnosing</strong>.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopyWhatsApp}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              {copiedWhatsApp ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedWhatsApp ? "Copied for WhatsApp!" : "Share with Doctor (WhatsApp)"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Verification Slip</span>
            </button>
          </div>
        </div>

        {/* Preloaded Scenario Selector Pills */}
        <div className="mt-5 pt-4 border-t border-amber-200/60 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 mr-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Select Comparison Case:
          </span>
          {PRELOADED_COMPARISONS.map(comp => (
            <button
              key={comp.id}
              onClick={() => setSelectedComparisonId(comp.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                selectedComparisonId === comp.id
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
              }`}
            >
              {comp.title}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Document Headers: Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Document A */}
        <div className="bg-white rounded-2xl border-2 border-teal-500/30 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-teal-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            Document A (Recent)
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs border border-teal-200">
              A
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{activeComparison.docA.title}</h3>
              <p className="text-[11px] text-slate-500">{activeComparison.docA.facility} • {activeComparison.docA.date}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center justify-between">
            <span>Prescribing Doctor: <strong>{activeComparison.docA.doctor}</strong></span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">{activeComparison.docA.type}</span>
          </div>
        </div>

        {/* Document B */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-slate-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            Document B (Previous)
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200">
              B
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{activeComparison.docB.title}</h3>
              <p className="text-[11px] text-slate-500">{activeComparison.docB.facility} • {activeComparison.docB.date}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center justify-between">
            <span>Prescribing Doctor: <strong>{activeComparison.docB.doctor}</strong></span>
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium">{activeComparison.docB.type}</span>
          </div>
        </div>
      </div>

      {/* AI Plain-Language Conflict Synthesis Banner with Voice Player */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Caregiver Reconciliation Summary & Voice Advisory
              </h2>
              <p className="text-xs text-slate-500">
                Plain-language breakdown for {activeMember.name} • Available in 8 Indian languages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <VoicePlayer
              text={conflictSummaryText}
              language={language}
              label={
                language === 'te' 
                  ? "తేడాలను వినండి (Telugu Audio)" 
                  : language === 'hi' 
                    ? "अंतर सुनें (Hindi Audio)" 
                    : language === 'ta'
                      ? "ஒலி கேட்கவும் (Tamil Audio)"
                      : language === 'kn'
                        ? "ವ್ಯತ್ಯಾಸಗಳನ್ನು ಕೇಳಿ (Kannada Audio)"
                        : language === 'ml'
                          ? "വ്യത്യാസങ്ങൾ കേൾക്കുക (Malayalam Audio)"
                          : language === 'mr'
                            ? "फरक ऐका (Marathi Audio)"
                            : language === 'gu'
                              ? "તફાવત સાંભળો (Gujarati Audio)"
                              : "Listen to Differences (Voice)"
              }
            />
          </div>
        </div>

        <div className="mt-4 p-4 rounded-2xl bg-purple-50/60 border border-purple-200/70 text-slate-800 text-sm leading-relaxed">
          {conflictSummaryText}
        </div>
      </div>

      {/* Detailed Differences List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>Discrepancy Breakdown ({activeComparison.conflicts.length} Flags Identified)</span>
          </h2>
          <span className="text-xs text-slate-500">
            Compare values carefully before giving medicines to your family member
          </span>
        </div>

        {activeComparison.conflicts.map((conflict, idx) => {
          const isCritical = conflict.severity === 'critical';
          const isHigh = conflict.severity === 'high';
          const badgeColor = isCritical 
            ? 'bg-rose-100 text-rose-800 border-rose-300' 
            : isHigh 
              ? 'bg-amber-100 text-amber-800 border-amber-300' 
              : 'bg-sky-100 text-sky-800 border-sky-300';

          const langCapitalized = language.charAt(0).toUpperCase() + language.slice(1);
          const questionText = conflict['doctorQuestion' + langCapitalized] || conflict.doctorQuestionEn;

          return (
            <div 
              key={idx}
              className={`bg-white rounded-3xl border-2 transition-all p-5 sm:p-6 shadow-xs ${
                isCritical 
                  ? 'border-rose-300 ring-2 ring-rose-100' 
                  : isHigh 
                    ? 'border-amber-300' 
                    : 'border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{conflict.drugName}</h3>
                    <p className="text-xs text-slate-500">{conflict.differenceDescription}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badgeColor}`}>
                    {conflict.category.replace('_', ' ')}
                  </span>
                  {isCritical && (
                    <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                      Urgent Verify
                    </span>
                  )}
                </div>
              </div>

              {/* Side-by-Side Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-3.5">
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block mb-1">
                    Document A ({activeComparison.docA.title})
                  </span>
                  <div className="text-sm font-extrabold text-teal-950">
                    {conflict.docAValue}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Document B ({activeComparison.docB.title})
                  </span>
                  <div className="text-sm font-extrabold text-slate-700">
                    {conflict.docBValue}
                  </div>
                </div>
              </div>

              {/* Caregiver Safety Warning */}
              <div className="mt-3.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-950 font-semibold">Caregiver Warning: </strong>
                  {conflict.caregiverWarning}
                </div>
              </div>

              {/* Doctor / Pharmacist Question Card */}
              <div className="mt-3.5 p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-teal-400">
                      Question to Ask Your Doctor or Pharmacist:
                    </span>
                  </div>
                  <p className="text-xs text-slate-100 font-medium italic">
                    "{questionText}"
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <VoicePlayer
                    text={questionText}
                    language={language}
                    label="Speak Question"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety & Non-Diagnostic Guarantee */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-slate-600 leading-relaxed">
            <h4 className="font-bold text-slate-900 text-sm">
              MedCheck Zero-Diagnosis Clinical Safety Guarantee
            </h4>
            <p>
              MedCheck does not practice medicine, diagnose conditions, or decide which prescription is superior. Medical management decisions must strictly be made by a licensed doctor or verified by a registered pharmacist. Our mission is to protect family caregivers from accidental confusion, unrecorded dose modifications, or duplicate brand ingestion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
