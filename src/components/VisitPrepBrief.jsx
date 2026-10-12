import React from 'react';
import { 
  Printer, 
  HelpCircle, 
  Pill, 
  Activity, 
  ShieldAlert, 
  User, 
  Calendar, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export default function VisitPrepBrief({ patient, records }) {
  const handlePrint = () => {
    window.print();
  };

  const latestLab = records.find(r => r.type === 'lab') || records[0];

  const doctorQuestions = [
    {
      q: "My HbA1c is 8.2% and fasting sugar is 142 mg/dL. Should my Metformin dose be adjusted, or should we add a secondary agent (like an SGLT-2 inhibitor)?",
      context: "Glycemic management (Last lab: Oct 02, 2026)"
    },
    {
      q: "With my LDL at 154 mg/dL and my history of cardiac stenting, is Atorvastatin 20mg enough, or should we target an LDL < 70 mg/dL?",
      context: "Lipid & cardiovascular goal"
    },
    {
      q: "My home blood pressure averages 138/88 mmHg on Telmisartan 40mg. Is this within our target goal?",
      context: "Blood pressure titration"
    },
    {
      q: "Should I schedule an annual diabetic retinopathy screening or urine microalbumin-to-creatinine test this quarter?",
      context: "Preventive organ screening"
    },
    {
      q: "Can I take Metformin with morning tea/coffee or strictly after breakfast to minimize stomach upset?",
      context: "Administration & tolerance"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between no-print">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Physician Visit-Prep Brief (1-Page Summary)
          </h2>
          <p className="text-xs text-slate-500">
            Consolidates your active medicines, recent biomarker shifts, and 5 key questions for your next appointment.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm print:border-none print:shadow-none print:p-0 max-w-4xl mx-auto">
        
        {/* Document Header */}
        <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold tracking-wider uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                MedCheck Clinical Summary
              </span>
              <span className="text-xs text-slate-400 font-mono">Date Generated: {new Date().toLocaleDateString()}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
              Patient Clinical Brief: {patient.name}
            </h1>
            <div className="text-xs text-slate-600 mt-1 flex flex-wrap gap-x-4">
              <span><strong>Age/Sex:</strong> {patient.age}Y / {patient.gender}</span>
              <span><strong>Blood Group:</strong> {patient.bloodGroup}</span>
              <span><strong>ABHA ID:</strong> {patient.abhaId}</span>
              <span className="text-rose-600 font-bold"><strong>Allergies:</strong> {patient.allergies.join(', ')}</span>
            </div>
          </div>

          <div className="text-right text-xs font-mono text-slate-500">
            <div>ABDM Ready</div>
            <div>Source: MedCheck Vault</div>
          </div>
        </div>

        {/* Section 1: Recent Biomarker Shifts */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-1">
            <Activity className="w-4 h-4 text-teal-600" />
            1. Recent Diagnostic Shifts & Vitals (Printed Reference Limits)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-500">HbA1c (3-Month Sugar)</div>
              <div className="text-base font-bold text-rose-700 mt-0.5">8.2 %</div>
              <div className="text-[10px] text-slate-500">Printed Ref: &lt; 5.7% (Above)</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-500">Fasting Blood Sugar</div>
              <div className="text-base font-bold text-rose-700 mt-0.5">142 mg/dL</div>
              <div className="text-[10px] text-slate-500">Printed Ref: 70-100 (Above)</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-500">LDL Cholesterol</div>
              <div className="text-base font-bold text-rose-700 mt-0.5">154 mg/dL</div>
              <div className="text-[10px] text-slate-500">Printed Ref: &lt; 100 (Above)</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-500">Kidney Creatinine</div>
              <div className="text-base font-bold text-emerald-700 mt-0.5">1.05 mg/dL</div>
              <div className="text-[10px] text-slate-500">Printed Ref: 0.7-1.3 (Normal)</div>
            </div>
          </div>
        </div>

        {/* Section 2: Active Medication Regimen */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-1">
            <Pill className="w-4 h-4 text-purple-600" />
            2. Verified Active Prescription Schedule
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="p-2.5">Medicine Name</th>
                  <th className="p-2.5">Dose</th>
                  <th className="p-2.5">Frequency</th>
                  <th className="p-2.5">Timing & Food Instruction</th>
                  <th className="p-2.5">Indication</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Tab Metformin HCl</td>
                  <td className="p-2.5 font-mono">500 mg</td>
                  <td className="p-2.5 font-mono">1-0-1</td>
                  <td className="p-2.5">After Meals (भोजन के बाद)</td>
                  <td className="p-2.5 text-slate-600">Type 2 Diabetes Mellitus</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Tab Telmisartan</td>
                  <td className="p-2.5 font-mono">40 mg</td>
                  <td className="p-2.5 font-mono">1-0-0</td>
                  <td className="p-2.5">Morning after breakfast</td>
                  <td className="p-2.5 text-slate-600">Essential Hypertension</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Tab Atorvastatin</td>
                  <td className="p-2.5 font-mono">20 mg</td>
                  <td className="p-2.5 font-mono">0-0-1</td>
                  <td className="p-2.5">Bedtime (रात को सोने से पहले)</td>
                  <td className="p-2.5 text-slate-600">Dyslipidemia & CAD Prophylaxis</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: 5 Questions for the Doctor */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-1">
            <HelpCircle className="w-4 h-4 text-sky-600" />
            3. Prioritized Checklist: 5 Questions for the Physician
          </h3>

          <div className="space-y-2.5">
            {doctorQuestions.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <div className="font-semibold text-slate-900 leading-snug">{item.q}</div>
                  <div className="text-[10px] text-teal-700 font-medium mt-0.5">Focus Area: {item.context}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Not a prescription or diagnosis. For personal health comprehension and doctor appointment preparation only.</span>
          </div>
          <span className="font-mono">MedCheck v1.0 • Altrix Labs Hackathon</span>
        </div>

      </div>
    </div>
  );
}
