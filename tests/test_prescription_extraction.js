import assert from 'node:assert/strict';
import { structureOCRResult } from '../src/services/ocrService.js';
import { askCopilot } from '../src/services/aiService.js';
import { findPrescriptionDifferences } from '../src/services/prescriptionReview.js';
import {
  prescriptionA,
  prescriptionB,
  prescriptionC,
  unreadablePrescription
} from './fixtures/prescriptionOcrFixtures.js';

const fixtures = [prescriptionA, prescriptionB, prescriptionC];
const scanResults = await Promise.all(fixtures.map((fixture, index) =>
  structureOCRResult({
    data: { text: fixture.text, confidence: 94, words: fixture.text.split(/\s+/).map(text => ({ text })) }
  }, { scanId: `fixture-scan-${index + 1}`, sourceFilename: fixture.filename })
));

assert.deepEqual(
  scanResults.map(result => result.structuredRecord.medications[0]?.name),
  ['Amoxicillin', 'Fluconazole', 'Nitrofurantoin'],
  'Each OCR response should produce only the medicine present in that response'
);
assert.deepEqual(
  scanResults.map(result => result.structuredRecord.medications[0]?.dosage),
  ['500 mg', '150 mg', '100 mg']
);
assert.deepEqual(
  scanResults.map(result => result.structuredRecord.medications[0]?.duration),
  ['5 days', '1 day', '7 days']
);
assert.deepEqual(
  scanResults.map(result => result.structuredRecord.medications[0]?.frequency),
  ['1-0-1', 'once daily', 'twice daily']
);
assert.deepEqual(
  scanResults.map(result => result.sourceFilename),
  fixtures.map(fixture => fixture.filename),
  'Each response must remain associated with its uploaded filename'
);
assert.equal(new Set(scanResults.map(result => result.scanId)).size, fixtures.length);
assert.ok(scanResults.every(result => result.structuredRecord.medications[0].status === 'Needs Review'));

const repeatedFileOne = await structureOCRResult(
  { data: { text: prescriptionA.text, confidence: 90 } },
  { scanId: 'repeat-one', sourceFilename: prescriptionA.filename }
);
const repeatedFileTwo = await structureOCRResult(
  { data: { text: prescriptionA.text, confidence: 90 } },
  { scanId: 'repeat-two', sourceFilename: prescriptionA.filename }
);
assert.notEqual(repeatedFileOne.scanId, repeatedFileTwo.scanId, 'Repeated files should create independent scan IDs');
assert.equal(repeatedFileTwo.structuredRecord.medications[0].name, 'Amoxicillin');

const unreadableResult = await structureOCRResult(
  { data: { text: unreadablePrescription.text, confidence: 12 } },
  { scanId: 'unreadable-scan', sourceFilename: unreadablePrescription.filename }
);
assert.equal(unreadableResult.structuredRecord.medications.length, 0);
assert.equal(unreadableResult.structuredRecord.extractionStatus, 'needs_review');
assert.equal(unreadableResult.structuredRecord.rawText, unreadablePrescription.text);

const prescriptionHistory = [
  {
    type: 'prescription',
    scanId: 'newer-scan',
    sourceFilename: 'newer.png',
    date: '2026-10-12',
    medications: [{ name: 'Amoxicillin', dosage: '500 mg', frequency: '1-0-1', duration: '5 days', instructions: 'after food' }]
  },
  {
    type: 'prescription',
    scanId: 'older-scan',
    sourceFilename: 'older.png',
    date: '2026-10-01',
    medications: [{ name: 'Tab Amoxicillin 500 mg', dosage: '250 mg', frequency: '1-0-1', duration: '5 days', instructions: '' }]
  }
];
const differences = findPrescriptionDifferences(prescriptionHistory);
assert.equal(differences.length, 1, 'Only changed explicit medicine fields should be flagged');
assert.equal(differences[0].field, 'dosage');
assert.equal(differences[0].recentValue, '500 mg');
assert.equal(differences[0].previousValue, '250 mg');

const copilotMedicineAnswer = await askCopilot('What medicines and dose are in my scan?', prescriptionHistory, { name: 'Test' });
assert.match(copilotMedicineAnswer, /Amoxicillin/);
assert.match(copilotMedicineAnswer, /250 mg in older\.png versus 500 mg in newer\.png|500 mg in newer\.png versus 250 mg in older\.png/);
assert.match(copilotMedicineAnswer, /not a drug-interaction checker/i);
const copilotDietAnswer = await askCopilot('What diet or food advice is in these prescriptions?', prescriptionHistory, { name: 'Test' });
assert.match(copilotDietAnswer, /after food/);
assert.match(copilotDietAnswer, /not new advice/);

await assert.rejects(
  structureOCRResult({ data: { text: '   ', confidence: 0 } }, { scanId: 'empty-scan' }),
  /No readable text/
);

console.log('Prescription extraction regression tests passed: distinct inputs, repeat upload IDs, concurrency, and unreadable OCR.');
