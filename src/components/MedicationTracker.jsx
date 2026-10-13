import React from 'react';
import { 
  Pill, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  RefreshCw,
  Sun,
  Sunset,
  Moon,
  Info
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { getPrescriptionReviewFacts } from '../services/prescriptionReview';

export default function MedicationTracker({ records, language, isDemo = true }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const reviewedMedications = getPrescriptionReviewFacts(records);

  if (!isDemo) {
    return (
      <div className="space-y-5">
        <section className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Pill className="h-5 w-5 text-purple-600" />
            Medicines from saved prescriptions
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            This list reflects text verified and saved from this patient’s prescriptions. It does not determine what is currently active or recommend how to take a medicine.
          </p>
        </section>

        {reviewedMedications.length ? reviewedMedications.map((medication, index) => (
          <article key={`${medication.sourceFilename}-${medication.name}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900">{medication.name || 'Medicine name not readable'}</h3>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Source: {medication.sourceFilename}{medication.recordDate ? ` · ${medication.recordDate}` : ''}
                </p>
              </div>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                {medication.status || 'Needs Review'}
              </span>
            </div>
            <dl className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
              <div><dt className="font-semibold text-slate-700">Strength / dose in document</dt><dd className="mt-1 text-slate-600">{medication.dosage || 'Not detected'}</dd></div>
              <div><dt className="font-semibold text-slate-700">Frequency in document</dt><dd className="mt-1 text-slate-600">{medication.frequency || 'Not detected'}</dd></div>
              <div><dt className="font-semibold text-slate-700">Duration in document</dt><dd className="mt-1 text-slate-600">{medication.duration || 'Not detected'}</dd></div>
              <div><dt className="font-semibold text-slate-700">Timing / food instructions</dt><dd className="mt-1 text-slate-600">{medication.instructions || 'No food or timing instruction was detected. Ask the prescriber or pharmacist.'}</dd></div>
              <div><dt className="font-semibold text-slate-700">Purpose / use</dt><dd className="mt-1 text-slate-600">{medication.purpose || 'Not stated in the saved prescription text.'}</dd></div>
            </dl>
          </article>
        )) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
            No saved prescription medicines are available for this patient yet.
          </div>
        )}

        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          MedCheck does not check drug interactions or generate personalized diet plans. Verify medicines, food restrictions, and any unclear directions with a qualified healthcare professional.
        </p>
      </div>
    );
  }

  // Aggregate all active medications from prescriptions
  const allMedications = [];
  records.forEach(r => {
    if (r.medications) {
      r.medications.forEach(m => {
        if (!allMedications.some(existing => existing.name === m.name)) {
          allMedications.push({
            ...m,
            prescribedBy: r.doctor,
            prescribedDate: r.date,
            facility: r.facility
          });
        }
      });
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-purple-600" />
              {t.medications.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.medications.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {allMedications.length} Active Prescriptions
            </span>
          </div>
        </div>

        {/* Daily Schedule Timeline */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            Daily Regimen Schedule
          </h3>

          {(() => {
            const morningMeds = allMedications.filter(m => {
              const text = `${m.timing || ''} ${m.frequency || ''} ${m.instructions || ''}`.toLowerCase();
              return /morning|breakfast|सुबह|ఉదయం|1-[01]-[01]|od|tds|bd|daily/i.test(text) || (m.frequency && (m.frequency.startsWith('1-') || m.frequency.includes('Morning') || m.frequency.includes('OD')));
            });

            const afternoonMeds = allMedications.filter(m => {
              const text = `${m.timing || ''} ${m.frequency || ''} ${m.instructions || ''}`.toLowerCase();
              return /afternoon|noon|lunch|1-1-1|tds|qid/i.test(text) || (m.frequency && m.frequency.includes('-1-'));
            });

            const nightMeds = allMedications.filter(m => {
              const text = `${m.timing || ''} ${m.frequency || ''} ${m.instructions || ''}`.toLowerCase();
              return /night|bedtime|dinner|रात|పడుకునే|0-0-1|1-0-1|1-1-1|bd|tds|qhs|hs/i.test(text) || (m.frequency && (m.frequency.endsWith('-1') || m.frequency.includes('Night') || m.frequency.includes('Bedtime') || m.frequency.includes('BD')));
            });

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Morning Slot */}
                <div className="bg-amber-50/50 rounded-2xl border border-amber-200/70 p-4">
                  <div className="flex items-center justify-between pb-3 border-b border-amber-200/50">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                      <Sun className="w-4 h-4 text-amber-600" />
                      {t.medications.morning} (08:00 AM)
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                      {morningMeds.length} Med{morningMeds.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {morningMeds.length === 0 ? (
                      <div className="bg-white/80 p-3 rounded-xl border border-amber-100 text-center text-xs text-slate-500">
                        No morning medications scheduled.
                      </div>
                    ) : (
                      morningMeds.map((med, i) => (
                        <div key={i} className="bg-white p-3 rounded-xl border border-amber-100 shadow-xs">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs text-slate-900">{med.name}</span>
                            <span className="text-[11px] font-mono text-purple-700 font-semibold">{med.dosage}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">{med.timing || med.frequency || 'Take with water'}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Afternoon Slot */}
                <div className="bg-sky-50/50 rounded-2xl border border-sky-200/70 p-4">
                  <div className="flex items-center justify-between pb-3 border-b border-sky-200/50">
                    <div className="flex items-center gap-2 text-sky-900 font-bold text-xs uppercase tracking-wider">
                      <Sunset className="w-4 h-4 text-sky-600" />
                      {t.medications.afternoon} (01:30 PM)
                    </div>
                    <span className="text-[10px] bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded-full">
                      {afternoonMeds.length} Med{afternoonMeds.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {afternoonMeds.length === 0 ? (
                      <div className="bg-white/80 p-4 rounded-xl border border-sky-100 text-center text-xs text-slate-500">
                        No routine scheduled medications at noon.
                      </div>
                    ) : (
                      afternoonMeds.map((med, i) => (
                        <div key={i} className="bg-white p-3 rounded-xl border border-sky-100 shadow-xs">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs text-slate-900">{med.name}</span>
                            <span className="text-[11px] font-mono text-purple-700 font-semibold">{med.dosage}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">{med.timing || med.frequency}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Night Slot */}
                <div className="bg-indigo-50/50 rounded-2xl border border-indigo-200/70 p-4">
                  <div className="flex items-center justify-between pb-3 border-b border-indigo-200/50">
                    <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                      <Moon className="w-4 h-4 text-indigo-600" />
                      {t.medications.night} (09:00 PM)
                    </div>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
                      {nightMeds.length} Med{nightMeds.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {nightMeds.length === 0 ? (
                      <div className="bg-white/80 p-3 rounded-xl border border-indigo-100 text-center text-xs text-slate-500">
                        No nighttime medications scheduled.
                      </div>
                    ) : (
                      nightMeds.map((med, i) => (
                        <div key={i} className="bg-white p-3 rounded-xl border border-indigo-100 shadow-xs">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs text-slate-900">{med.name}</span>
                            <span className="text-[11px] font-mono text-purple-700 font-semibold">{med.dosage}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">{med.timing || med.frequency || 'At bedtime'}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Detailed Medication Cards */}
        <div className="mt-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Prescription Insights & Precautions
          </h3>

          <div className="space-y-4">
            {allMedications.map((med, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 hover:border-slate-300 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {med.name} <span className="text-purple-600 font-mono">({med.dosage})</span>
                      </h4>
                      <div className="text-[11px] text-slate-500">
                        {med.prescribedBy} • {med.facility}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg font-medium">
                      <RefreshCw className="w-3 h-3 text-amber-600" />
                      Refill in {med.refillDueDays || 14} days
                    </span>
                    <span className="text-xs font-mono font-semibold bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700">
                      {med.frequency}
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/70">
                    <span className="font-semibold text-slate-900 block mb-0.5">Clinical Purpose</span>
                    <span className="text-slate-600">{med.purpose}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/70">
                    <span className="font-semibold text-slate-900 block mb-0.5">Timing & Route</span>
                    <span className="text-slate-600">{med.timing}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/70">
                    <span className="font-semibold text-slate-900 block mb-0.5">Safety & Food Precautions</span>
                    <span className="text-slate-600">{med.precautions || "Take with water. Do not skip meals."}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
