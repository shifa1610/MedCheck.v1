import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  Lightbulb, 
  Heart, 
  Activity, 
  ShieldAlert, 
  ArrowUpRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import VoicePlayer from './VoicePlayer';
import { findPrescriptionDifferences, getPrescriptionReviewFacts } from '../services/prescriptionReview';

export default function HealthSummary({ records, patient, language, isDemo = true }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  if (records.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-900">
          <ShieldAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p><span className="font-semibold text-amber-950">Safety Notice & Medical Guardrail: </span>{t.summary.disclaimer}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-200 bg-teal-50 text-teal-700">
              <Activity aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Your health summary will appear here</h2>
              <p className="mt-1 text-sm text-slate-600">
                No records are saved for {patient.name} yet. Upload a report or prescription to get started.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isDemo) {
    const prescriptionFacts = getPrescriptionReviewFacts(records);
    const prescriptionDifferences = findPrescriptionDifferences(records);
    const labValues = records.flatMap(record => record.biomarkers || record.testValues || []);

    return (
      <div className="space-y-5">
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
          This overview summarizes saved document text only. It does not diagnose, determine whether medicines are safe, or replace review by a clinician.
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-900">Saved health records for {patient.name}</h2>
          <div className="mt-3 space-y-2">
            {records.map((record, index) => (
              <div key={record.id || record._id || index} className="rounded-xl bg-slate-50 p-3">
                <div className="font-semibold text-slate-900">{record.title || record.category || 'Medical record'}</div>
                <div className="mt-1 text-[11px] text-slate-600">
                  {record.sourceFilename || record.facility || 'Source not recorded'}
                  {record.date ? ` · ${record.date}` : ''}
                  {record.doctor ? ` · ${record.doctor}` : ''}
                </div>
                {record.summary?.plainText && <p className="mt-2 text-xs text-slate-700">{record.summary.plainText}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">Extracted prescription details</h2>
          {prescriptionFacts.length ? (
            <div className="mt-3 space-y-2">
              {prescriptionFacts.map((medicine, index) => (
                <div key={`${medicine.sourceFilename}-${medicine.name}-${index}`} className="rounded-xl border border-slate-100 p-3 text-xs">
                  <div className="font-semibold text-slate-900">{medicine.name || 'Medicine name needs review'} · {medicine.dosage || 'Dose not detected'} · {medicine.frequency || 'Frequency not detected'}</div>
                  <div className="mt-1 text-slate-600">Source: {medicine.sourceFilename}{medicine.duration ? ` · ${medicine.duration}` : ''}{medicine.instructions ? ` · ${medicine.instructions}` : ''}</div>
                  <div className="mt-1 text-amber-800">Purpose is not inferred from medicine name; verify all fields with the prescriber or pharmacist.</div>
                </div>
              ))}
            </div>
          ) : <p className="mt-2 text-sm text-slate-600">No medicine fields were extracted from saved prescriptions.</p>}
        </section>

        {prescriptionDifferences.length > 0 && (
          <section className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5">
            <h2 className="font-bold text-rose-900">Prescription differences to verify</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-800">
              {prescriptionDifferences.map((difference, index) => (
                <li key={`${difference.medicine}-${difference.field}-${index}`}>
                  {difference.medicine}: {difference.label} is {difference.recentValue} in {difference.recentDocument} and {difference.previousValue} in {difference.previousDocument}.
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-rose-900">Ask the prescriber which direction is current. Do not change a medicine based on this comparison.</p>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">Lab values explicitly saved from documents</h2>
          {labValues.length ? (
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {labValues.map((value, index) => <li key={`${value.name || value.testName}-${index}`}>{value.name || value.testName}: {value.value || value.observedValue || 'Value not detected'} {value.unit || ''}</li>)}
            </ul>
          ) : <p className="mt-2 text-sm text-slate-600">No lab values were extracted. MedCheck will not fill in sample results for this account.</p>}
        </section>
      </div>
    );
  }

  // Get the most recent lab or diagnostic record
  const latestLab = records.find(r => r.type === 'lab') || records[0];
  const latestRx = records.find(r => r.type === 'prescription');

  // Multi-lingual summary text selector
  const summaryText = latestLab?.summary?.[language] || latestLab?.summary?.plainText || latestLab?.summary;
  const rxSummaryText = latestRx?.summary?.[language] || latestRx?.summary?.plainText || latestRx?.summary;

  return (
    <div className="space-y-6">
      {/* Disclaimer Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-amber-900 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-semibold text-amber-950">Safety Notice & Medical Guardrail: </span>
          {t.summary.disclaimer}
        </div>
      </div>

      {/* Main AI Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t.summary.title}
              </h2>
              <p className="text-xs text-slate-500">
                Synthesized from latest diagnostic records • {latestLab?.facility || 'Apollo Diagnostics'} ({latestLab?.date})
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <VoicePlayer 
              text={`${summaryText}. ${rxSummaryText || ''}`} 
              language={language} 
              label={
                language === 'te' ? "సారాంశం వినండి (Telugu)" : 
                language === 'hi' ? "सारांश सुनें (Hindi)" : 
                language === 'ta' ? "ஒலி வடிவில் கேட்க (Tamil)" :
                language === 'kn' ? "ಸಾರಾಂಶವನ್ನು ಆಲಿಸಿ (Kannada)" :
                language === 'ml' ? "സംഗ്രഹം കേൾക്കുക (Malayalam)" :
                language === 'mr' ? "सारांश ऐका (Marathi)" :
                language === 'gu' ? "સારાંશ સાંભળો (Gujarati)" :
                "Listen to Summary"
              } 
            />
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Validated
            </span>
          </div>
        </div>

        {/* Plain Language Interpretation */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            {t.summary.whatThisMeans}
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            {summaryText}
          </p>

          {rxSummaryText && (
            <div className="mt-3 pt-3 border-t border-slate-200/60">
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-800">Prescription Update ({latestRx?.date}):</strong> {rxSummaryText}
              </p>
            </div>
          )}
        </div>

        {/* Attention Required: Abnormal Values */}
        {latestLab?.abnormalExplanations && latestLab.abnormalExplanations.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-slate-900">
                {t.summary.abnormalValues} ({latestLab.abnormalExplanations.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestLab.abnormalExplanations.map((item, idx) => (
                <div 
                  key={idx} 
                  className="rounded-xl border border-rose-100 bg-gradient-to-b from-rose-50/50 to-white p-4 shadow-xs hover:border-rose-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-semibold text-sm text-slate-900">
                      {item.marker}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      item.status === 'High' 
                        ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {item.value} • {item.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mb-2 font-mono">
                    Target Reference: {item.ref}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed mb-3">
                    <strong className="text-slate-900">Clinical Insight: </strong>
                    {item.explanation}
                  </p>

                  <div className="bg-white/80 rounded-lg p-2.5 border border-rose-100/80 text-xs text-slate-700 flex items-start gap-2">
                    <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">Action: </strong>
                      {item.lifestyleAdvice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Normal Values Row */}
        {latestLab?.normalMarkers && latestLab.normalMarkers.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                {t.summary.normalValues}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {latestLab.normalMarkers.map((marker, idx) => (
                <div key={idx} className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3">
                  <div className="text-xs font-semibold text-slate-800">{marker.name}</div>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">{marker.value}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Normal ({marker.ref})</div>
                  <div className="text-[10px] text-emerald-800/80 font-medium mt-0.5">{marker.interpretation}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Questions for Doctor */}
        {latestLab?.doctorQuestions && latestLab.doctorQuestions.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-4">
              <h3 className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <HelpCircle className="w-4 h-4 text-sky-600" />
                {t.summary.questionsForDoctor}
              </h3>
              <ul className="space-y-2">
                {latestLab.doctorQuestions.map((q, idx) => (
                  <li key={idx} className="text-xs text-sky-950 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-sky-200 text-sky-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
