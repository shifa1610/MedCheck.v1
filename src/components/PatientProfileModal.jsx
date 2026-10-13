import React, { useState } from 'react';
import { HeartPulse, X } from 'lucide-react';

const LANGUAGES = [
  ['en', 'English'],
  ['hi', 'Hindi'],
  ['te', 'Telugu'],
  ['ta', 'Tamil'],
  ['kn', 'Kannada'],
  ['ml', 'Malayalam'],
  ['mr', 'Marathi'],
  ['gu', 'Gujarati']
];

export default function PatientProfileModal({ onClose, onSave, isSaving = false, error = '', canClose = true }) {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Self');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Prefer not to say');
  const [bloodGroup, setBloodGroup] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      name: name.trim(),
      relationship: relationship.trim(),
      age: age === '' ? null : Number(age),
      gender,
      bloodGroup,
      preferredLanguage
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
      <section
        aria-labelledby="patient-profile-title"
        aria-modal="true"
        role="dialog"
        className="my-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-800 text-white">
              <HeartPulse aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h2 id="patient-profile-title" className="text-xl font-black text-slate-950">Create a patient profile</h2>
              <p className="mt-1 text-sm text-slate-600">Add yourself or a family member to organize their records.</p>
            </div>
          </div>
          {canClose && <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close profile form"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block space-y-1.5 text-sm font-semibold text-slate-800">
            <span>Patient name</span>
            <input
              autoFocus
              required
              minLength={2}
              maxLength={100}
              value={name}
              onChange={event => setName(event.target.value)}
              placeholder="e.g., Priya Sharma"
              className="min-h-11 w-full rounded-xl border border-slate-300 px-3 font-normal focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/10"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm font-semibold text-slate-800">
              <span>Relationship</span>
              <select
                value={relationship}
                onChange={event => setRelationship(event.target.value)}
                className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/10"
              >
                {['Self', 'Parent', 'Spouse', 'Child', 'Sibling', 'Other'].map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5 text-sm font-semibold text-slate-800">
              <span>Age <span className="font-normal text-slate-500">(optional)</span></span>
              <input
                type="number"
                min="0"
                max="125"
                step="1"
                value={age}
                onChange={event => setAge(event.target.value)}
                placeholder="Age"
                className="min-h-11 w-full rounded-xl border border-slate-300 px-3 font-normal focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/10"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm font-semibold text-slate-800">
              <span>Gender</span>
              <select
                value={gender}
                onChange={event => setGender(event.target.value)}
                className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/10"
              >
                {['Prefer not to say', 'Female', 'Male', 'Other'].map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5 text-sm font-semibold text-slate-800">
              <span>Blood group <span className="font-normal text-slate-500">(optional)</span></span>
              <select
                value={bloodGroup}
                onChange={event => setBloodGroup(event.target.value)}
                className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/10"
              >
                <option value="">Not provided</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block space-y-1.5 text-sm font-semibold text-slate-800">
            <span>Preferred language</span>
            <select
              value={preferredLanguage}
              onChange={event => setPreferredLanguage(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 font-normal focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-700/10"
            >
              {LANGUAGES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
            </select>
          </label>

          {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">{error}</p>}

          <div className={`flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end ${canClose ? '' : 'sm:justify-start'}`}>
            {canClose && <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="min-h-11 rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>}
            <button
              type="submit"
              disabled={isSaving}
              className="min-h-11 rounded-xl bg-teal-800 px-5 text-sm font-bold text-white hover:bg-teal-900 disabled:opacity-60"
            >
              {isSaving ? 'Saving profile…' : 'Save patient profile'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
