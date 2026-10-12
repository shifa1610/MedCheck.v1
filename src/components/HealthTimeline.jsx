import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  User, 
  Building2, 
  Pill, 
  Activity, 
  ExternalLink, 
  Search, 
  Filter, 
  Code2, 
  Check, 
  Copy, 
  X,
  Stethoscope
} from 'lucide-react';
import { recordToFHIRBundle } from '../types/fhir';
import { TRANSLATIONS } from '../data/translations';

export default function HealthTimeline({ records, patient, language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [fhirModalRecord, setFhirModalRecord] = useState(null);
  const [copied, setCopied] = useState(false);

  // Filter records
  const filteredRecords = records.filter(record => {
    if (filterType !== 'all' && record.type !== filterType) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = record.title?.toLowerCase().includes(query);
    const doctorMatch = record.doctor?.toLowerCase().includes(query);
    const facilityMatch = record.facility?.toLowerCase().includes(query);
    const medMatch = record.medications?.some(m => m.name.toLowerCase().includes(query));
    const bioMatch = record.biomarkers?.some(b => b.name.toLowerCase().includes(query));
    return titleMatch || doctorMatch || facilityMatch || medMatch || bioMatch;
  });

  const handleCopyFhir = (jsonString) => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.timeline.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 focus:outline-hidden transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: t.timeline.filterAll },
            { id: 'prescription', label: t.timeline.filterPrescription },
            { id: 'lab', label: t.timeline.filterLab },
            { id: 'discharge', label: t.timeline.filterDischarge }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterType === f.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 pl-6 md:pl-8 space-y-6">
        {filteredRecords.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            No health records matched your criteria.
          </div>
        ) : (
          filteredRecords.map((record) => {
            const isRx = record.type === 'prescription';
            const isLab = record.type === 'lab';
            const isDischarge = record.type === 'discharge';

            const badgeBg = isRx 
              ? 'bg-purple-100 text-purple-700 border-purple-200' 
              : isLab 
                ? 'bg-sky-100 text-sky-700 border-sky-200' 
                : 'bg-amber-100 text-amber-700 border-amber-200';

            const summaryLocalized = record.summary?.[language] || record.summary?.plainText || record.summary;

            return (
              <div key={record.id} className="relative group">
                {/* Node on Timeline */}
                <div className={`absolute -left-[35px] md:-left-[43px] top-4 w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white ${
                  isRx ? 'bg-purple-600' : isLab ? 'bg-sky-600' : 'bg-amber-600'
                }`}>
                  {isRx ? <Pill className="w-3 h-3" /> : isLab ? <Activity className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                </div>

                {/* Card Container */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeBg}`}>
                          {record.category || record.type}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {record.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {record.facility}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                          {record.doctor}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {record.date}
                      </span>
                    </div>
                  </div>

                  {/* Summary Snippet */}
                  <div className="mt-3 text-xs text-slate-600 leading-relaxed">
                    {summaryLocalized}
                  </div>

                  {/* Highlights Grid */}
                  {isRx && record.medications && (
                    <div className="mt-3.5 flex flex-wrap gap-2">
                      {record.medications.map((m, idx) => (
                        <div key={idx} className="bg-purple-50/70 border border-purple-100 text-purple-900 rounded-lg px-2.5 py-1.5 text-xs flex items-center gap-2">
                          <Pill className="w-3.5 h-3.5 text-purple-600" />
                          <span className="font-semibold">{m.name}</span>
                          <span className="text-purple-600 font-medium">({m.dosage})</span>
                          <span className="bg-purple-200/70 text-purple-800 text-[10px] px-1.5 py-0.2 rounded font-mono">{m.frequency}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {isLab && record.biomarkers && (
                    <div className="mt-3.5 flex flex-wrap gap-2">
                      {record.biomarkers.slice(0, 4).map((b, idx) => (
                        <div key={idx} className={`rounded-lg px-2.5 py-1 text-xs border flex items-center gap-1.5 ${
                          b.status === 'High' 
                            ? 'bg-rose-50 border-rose-200 text-rose-800' 
                            : b.status === 'Borderline' 
                              ? 'bg-amber-50 border-amber-200 text-amber-800'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        }`}>
                          <span className="font-medium">{b.name}:</span>
                          <span className="font-bold">{b.value} {b.unit}</span>
                          <span className="text-[10px] uppercase font-bold tracking-tight">({b.status})</span>
                        </div>
                      ))}
                      {record.biomarkers.length > 4 && (
                        <span className="text-xs text-slate-400 self-center">
                          +{record.biomarkers.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setFhirModalRecord(record)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 hover:text-teal-700 bg-slate-50 hover:bg-teal-50 px-2.5 py-1 rounded-md border border-slate-200 hover:border-teal-200 transition-colors"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>{t.timeline.viewFHIR}</span>
                    </button>

                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-800 hover:underline"
                    >
                      <span>{t.timeline.viewDetails}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                  {selectedRecord.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedRecord.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedRecord.facility} • {selectedRecord.doctor} ({selectedRecord.date})
                </p>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Clinical Summary
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedRecord.summary?.[language] || selectedRecord.summary?.plainText || selectedRecord.summary}
                </p>
              </div>

              {selectedRecord.medications && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Prescribed Medications ({selectedRecord.medications.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedRecord.medications.map((m, idx) => (
                      <div key={idx} className="bg-purple-50/50 border border-purple-100 rounded-xl p-3 text-xs text-slate-700">
                        <div className="flex justify-between items-center font-bold text-slate-900">
                          <span>{m.name} ({m.dosage})</span>
                          <span className="text-purple-700 font-mono">{m.frequency}</span>
                        </div>
                        <div className="text-slate-600 mt-1"><strong>Timing:</strong> {m.timing}</div>
                        <div className="text-slate-600 mt-0.5"><strong>Purpose:</strong> {m.purpose}</div>
                        {m.instructions && (
                          <div className="text-purple-900/80 mt-1 bg-white/80 p-1.5 rounded border border-purple-100">
                            <strong>Instructions:</strong> {m.instructions}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRecord.biomarkers && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Diagnostic Biomarkers ({selectedRecord.biomarkers.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedRecord.biomarkers.map((b, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-slate-800">{b.name}</div>
                          <div className="text-[10px] text-slate-500">Ref: {b.referenceRange}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">{b.value} {b.unit}</div>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            b.status === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {b.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FHIR R4 Bundle Modal */}
      {fhirModalRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 text-slate-100 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-800">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-teal-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    ABDM FHIR R4 Standard Bundle Specification
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Profile: https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyFhir(JSON.stringify(recordToFHIRBundle(fhirModalRecord, patient), null, 2))}
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-xs px-2.5 py-1.5 rounded-lg text-slate-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
                <button
                  onClick={() => setFhirModalRecord(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed text-emerald-400 bg-slate-900/90">
              <pre>
                {JSON.stringify(recordToFHIRBundle(fhirModalRecord, patient), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
