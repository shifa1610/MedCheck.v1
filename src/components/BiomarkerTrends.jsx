import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  AlertCircle, 
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import { 
  PAPA_TREND_SERIES, 
  MAA_TREND_SERIES, 
  SELF_TREND_SERIES,
  FAMILY_MEMBERS 
} from '../data/mockRecords';
import { TRANSLATIONS } from '../data/translations';

export default function BiomarkerTrends({ language, currentFamilyKey = 'papa' }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const activeMember = FAMILY_MEMBERS[currentFamilyKey] || FAMILY_MEMBERS.papa;

  // Select dataset based on active family member
  const trendData = currentFamilyKey === 'maa' 
    ? MAA_TREND_SERIES 
    : currentFamilyKey === 'self' 
      ? SELF_TREND_SERIES 
      : PAPA_TREND_SERIES;

  // Metric configurations per family profile
  const metricConfigs = {
    papa: {
      hba1c: {
        title: "HbA1c (3-Month Average Glucose)",
        unit: "%",
        targetLine: 7.0,
        normalLine: 5.7,
        lines: [{ key: 'hba1c', name: 'HbA1c (%)', color: '#0284c7', strokeWidth: 3 }],
        insight: "Down from 9.1% to 8.2% (-0.9% over 11 months). Positive trend from lifestyle modifications, but still elevated above diabetic target of 7.0%."
      },
      fastingGlucose: {
        title: "Fasting Blood Sugar",
        unit: "mg/dL",
        targetLine: 100,
        normalLine: 100,
        lines: [{ key: 'fastingGlucose', name: 'Fasting Sugar (mg/dL)', color: '#0d9488', strokeWidth: 3 }],
        insight: "Decreased from 178 mg/dL to 142 mg/dL. Continuing improvement, though morning baseline remains above non-diabetic reference (70-100 mg/dL)."
      },
      cholesterol: {
        title: "Lipid Profile (Total vs LDL)",
        unit: "mg/dL",
        targetLine: 200,
        normalLine: 100,
        lines: [
          { key: 'cholesterolTotal', name: 'Total Cholesterol', color: '#6366f1', strokeWidth: 2 },
          { key: 'cholesterolLdl', name: 'LDL Bad Cholesterol', color: '#e11d48', strokeWidth: 3 }
        ],
        insight: "Total Cholesterol reduced from 252 to 228 mg/dL; LDL dropped from 172 to 154 mg/dL. Statin therapy (Atorvastatin 40mg) protects arterial stent."
      },
      bp: {
        title: "Blood Pressure (Systolic / Diastolic)",
        unit: "mmHg",
        targetLine: 130,
        normalLine: 80,
        lines: [
          { key: 'bpSystolic', name: 'Systolic BP', color: '#e11d48', strokeWidth: 2 },
          { key: 'bpDiastolic', name: 'Diastolic BP', color: '#0ea5e9', strokeWidth: 2 }
        ],
        insight: "Stabilized around 138/88 mmHg following Telmisartan titration. Significantly improved from hypertensive peak of 148/94 in late 2025."
      }
    },
    maa: {
      tsh: {
        title: "TSH (Thyroid Stimulating Hormone)",
        unit: "uIU/mL",
        targetLine: 4.2,
        normalLine: 2.5,
        lines: [{ key: 'tsh', name: 'TSH (uIU/mL)', color: '#7c3aed', strokeWidth: 3 }],
        insight: "TSH decreased from 12.4 to 7.8 uIU/mL. Dose stepped up from 25mcg to 50mcg Thyronorm to bring below upper threshold of 4.2 uIU/mL."
      },
      vitD: {
        title: "Vitamin D3 (25-OH)",
        unit: "ng/mL",
        targetLine: 30.0,
        normalLine: 30.0,
        lines: [{ key: 'vitD', name: 'Vitamin D (ng/mL)', color: '#ea580c', strokeWidth: 3 }],
        insight: "Improved from severe deficiency (10.5 ng/mL) to 14.2 ng/mL. Weekly 60,000 IU Cholecalciferol course initiated for knee osteoarthritis relief."
      },
      bp: {
        title: "Blood Pressure (Systolic / Diastolic)",
        unit: "mmHg",
        targetLine: 130,
        normalLine: 80,
        lines: [
          { key: 'bpSystolic', name: 'Systolic BP', color: '#e11d48', strokeWidth: 2 },
          { key: 'bpDiastolic', name: 'Diastolic BP', color: '#0ea5e9', strokeWidth: 2 }
        ],
        insight: "Well-controlled around 130/84 mmHg with regular monitoring."
      }
    },
    self: {
      hba1c: {
        title: "HbA1c (Routine Screening)",
        unit: "%",
        targetLine: 5.7,
        normalLine: 5.7,
        lines: [{ key: 'hba1c', name: 'HbA1c (%)', color: '#059669', strokeWidth: 3 }],
        insight: "Consistently optimal (5.2%). Healthy non-diabetic glycemic regulation."
      },
      fastingGlucose: {
        title: "Fasting Blood Sugar",
        unit: "mg/dL",
        targetLine: 100,
        normalLine: 100,
        lines: [{ key: 'fastingGlucose', name: 'Fasting Sugar (mg/dL)', color: '#0d9488', strokeWidth: 3 }],
        insight: "Optimal morning fasting sugar at 88 mg/dL."
      },
      bp: {
        title: "Blood Pressure",
        unit: "mmHg",
        targetLine: 120,
        normalLine: 80,
        lines: [
          { key: 'bpSystolic', name: 'Systolic BP', color: '#059669', strokeWidth: 2 },
          { key: 'bpDiastolic', name: 'Diastolic BP', color: '#0ea5e9', strokeWidth: 2 }
        ],
        insight: "Optimal blood pressure: 118/76 mmHg."
      }
    }
  };

  const familyConfigs = metricConfigs[currentFamilyKey] || metricConfigs.papa;
  const availableMetricKeys = Object.keys(familyConfigs);
  const [activeMetric, setActiveMetric] = useState(availableMetricKeys[0]);

  // Fallback if active metric not in current family
  const currentMetricKey = availableMetricKeys.includes(activeMetric) ? activeMetric : availableMetricKeys[0];
  const currentConfig = familyConfigs[currentMetricKey];

  return (
    <div className="space-y-6">
      {/* Top Selector Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                Biomarker Longitudinal Trends
              </h2>
              <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                {activeMember.name} ({activeMember.relation})
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-visit historical trajectory tracked from physical lab reports over time
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {availableMetricKeys.map(k => (
              <button
                key={k}
                onClick={() => setActiveMetric(k)}
                className={`text-xs px-3.5 py-2 rounded-xl font-semibold transition-all ${
                  currentMetricKey === k
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {familyConfigs[k].title}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="mt-6 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="label" 
                stroke="#64748b" 
                tick={{ fontSize: 11 }}
                tickLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                tick={{ fontSize: 11 }}
                tickLine={false}
                unit={` ${currentConfig.unit}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                wrapperStyle={{ fontSize: '12px', fontWeight: 600 }}
              />
              <ReferenceLine 
                y={currentConfig.targetLine} 
                stroke="#10b981" 
                strokeDasharray="4 4" 
                label={{ value: `Target Goal: ${currentConfig.targetLine} ${currentConfig.unit}`, fill: '#059669', fontSize: 10, position: 'right' }} 
              />
              {currentConfig.lines.map((line, idx) => (
                <Line
                  key={idx}
                  type="monotone"
                  dataKey={line.key}
                  name={line.name}
                  stroke={line.color}
                  strokeWidth={line.strokeWidth}
                  dot={{ r: 5, fill: line.color, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Clinical Interpretation Card */}
        <div className="mt-6 p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 flex items-start gap-3">
          <TrendingDown className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="text-xs text-teal-950">
            <span className="font-bold uppercase tracking-wider text-[11px] text-teal-800 block mb-1">
              Clinical Interpretation ({currentConfig.title}):
            </span>
            <p className="leading-relaxed">
              {currentConfig.insight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
