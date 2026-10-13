const COMPARISON_FIELDS = [
  ['dosage', 'Strength / dose'],
  ['frequency', 'Frequency'],
  ['duration', 'Duration'],
  ['instructions', 'Timing / food instructions']
];

function medicationKey(name = '') {
  return name
    .toLowerCase()
    .replace(/^(?:tab(?:let)?|cap(?:sule)?|syp(?:rup)?|inj(?:ection)?)\.?\s+/i, '')
    .replace(/\b\d+(?:\.\d+)?\s?(?:mg|mcg|µg|g|ml|iu|units?)\b/gi, '')
    .replace(/[^a-z0-9]/g, '');
}

function medicationValue(medication, field) {
  return String(medication?.[field] || '').trim();
}

function documentLabel(record) {
  return record.sourceFilename || record.title || 'Prescription without a title';
}

function medicinesForRecord(record) {
  if (Array.isArray(record.medications)) return record.medications;
  return Array.isArray(record.medicines) ? record.medicines : [];
}

export function findPrescriptionDifferences(records = []) {
  const prescriptions = records
    .filter(record => record.type === 'prescription' || record.recordType === 'prescription')
    .filter(record => medicinesForRecord(record).length)
    .sort((left, right) =>
      new Date(right.date || right.recordDate || right.createdAt || 0) -
      new Date(left.date || left.recordDate || left.createdAt || 0)
    );

  const differences = [];
  for (let recentIndex = 0; recentIndex < prescriptions.length; recentIndex += 1) {
    const recent = prescriptions[recentIndex];
    for (let previousIndex = recentIndex + 1; previousIndex < prescriptions.length; previousIndex += 1) {
      const previous = prescriptions[previousIndex];
      for (const recentMedication of medicinesForRecord(recent)) {
        const key = medicationKey(recentMedication.name);
        if (!key) continue;
        const previousMedication = medicinesForRecord(previous).find(medication => medicationKey(medication.name) === key);
        if (!previousMedication) continue;

        for (const [field, label] of COMPARISON_FIELDS) {
          const recentValue = medicationValue(recentMedication, field);
          const previousValue = medicationValue(previousMedication, field);
          if (recentValue && previousValue && recentValue.toLowerCase() !== previousValue.toLowerCase()) {
            differences.push({
              medicine: recentMedication.name || previousMedication.name,
              field,
              label,
              recentValue,
              previousValue,
              recentDocument: documentLabel(recent),
              previousDocument: documentLabel(previous),
              recentDate: recent.date || recent.recordDate || '',
              previousDate: previous.date || previous.recordDate || ''
            });
          }
        }
      }
    }
  }
  return differences;
}

export function getPrescriptionReviewFacts(records = []) {
  return records.flatMap(record => {
    if (record.type !== 'prescription' && record.recordType !== 'prescription') return [];
    return medicinesForRecord(record).map(medication => ({
      ...medication,
      sourceFilename: documentLabel(record),
      recordDate: record.date || record.recordDate || '',
      doctor: record.doctor || record.doctorName || ''
    }));
  });
}
