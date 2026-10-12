/**
 * MedCheck Automated Prescription Scanning & Dynamic Recognition Test Suite
 * Verifies that:
 * 1. Every prescription is processed independently using actual text/OCR
 * 2. Hardcoded Metformin fallback is eliminated
 * 3. Exact drug names, dosages (e.g. 250mg vs 500mg), frequencies, and timings are extracted
 * 4. Unreadable documents show "Needs Review" with empty medication arrays
 * 5. Concurrent scans produce isolated, independent results with unique scan IDs
 */

import { extractMedicalRecord } from '../src/services/aiService.js';
import { validateMedicine } from '../src/services/validationService.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(message);
  } else {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  }
}

async function runPrescriptionTests() {
  console.log('\n======================================================');
  console.log('  MEDCHECK PRESCRIPTION RECOGNITION REGRESSION SUITE');
  console.log('======================================================\n');

  // Test 1: Prescription A (Amoxicillin 500mg + Paracetamol 650mg)
  console.log('[TEST GROUP 1] Prescription A (Amoxicillin & Paracetamol):');
  const rxAText = `
    Dr. Ananya Sen, MBBS MD
    City Health Clinic
    Date: 12/04/2026
    Patient: Rajesh Kumar
    1. Tab Amoxicillin 500mg TDS for 5 days
    2. Tab Paracetamol 650mg SOS after meals
  `;

  const recordA = await extractMedicalRecord(rxAText, { fileName: 'prescription_A.jpg', skipDelay: true });

  assert(recordA.doctor.includes('Ananya Sen'), `Extracted doctor: ${recordA.doctor}`);
  assert(recordA.facility.includes('City Health Clinic'), `Extracted facility: ${recordA.facility}`);
  assert(recordA.date === '12/04/2026', `Extracted date: ${recordA.date}`);
  assert(recordA.medications.length === 2, `Extracted exactly 2 medications (found: ${recordA.medications.length})`);
  
  const amox = recordA.medications.find(m => m.name.toLowerCase().includes('amoxicillin'));
  assert(!!amox, 'Amoxicillin was identified in Prescription A');
  assert(amox.dosage === '500mg', `Amoxicillin dosage is exact (500mg, found: ${amox.dosage})`);
  assert(amox.frequency.toLowerCase().includes('tds') || amox.frequency.toLowerCase().includes('thrice'), `Amoxicillin frequency TDS extracted (found: ${amox.frequency})`);
  assert(amox.duration.includes('5 days'), `Amoxicillin duration 5 days extracted (found: ${amox.duration})`);

  const para = recordA.medications.find(m => m.name.toLowerCase().includes('paracetamol'));
  assert(!!para, 'Paracetamol was identified in Prescription A');
  assert(para.dosage === '650mg', `Paracetamol dosage is 650mg (found: ${para.dosage})`);
  assert(para.frequency.includes('SOS'), `Paracetamol frequency SOS extracted (found: ${para.frequency})`);

  // Verify Metformin is NOT present
  const hasMetforminA = recordA.medications.some(m => m.name.toLowerCase().includes('metformin'));
  assert(!hasMetforminA, 'CRITICAL: Prescription A does NOT contain hardcoded Metformin fallback');

  // Test 2: Prescription B (Azithromycin 250mg + Pantoprazole 40mg)
  console.log('\n[TEST GROUP 2] Prescription B (Azithromycin 250mg & Pantoprazole 40mg):');
  const rxBText = `
    Apollo Medical Clinic
    Dr. Vikram Malhotra
    Date: 15-05-2026
    Tab Azithromycin 250mg OD for 3 days
    Tab Pantoprazole 40mg 1-0-0 before meals
  `;

  const recordB = await extractMedicalRecord(rxBText, { fileName: 'prescription_B.png', skipDelay: true });

  assert(recordB.doctor.includes('Vikram Malhotra'), `Extracted doctor: ${recordB.doctor}`);
  assert(recordB.facility.includes('Apollo Medical Clinic'), `Extracted facility: ${recordB.facility}`);
  assert(recordB.medications.length === 2, `Extracted exactly 2 medications (found: ${recordB.medications.length})`);

  const azith = recordB.medications.find(m => m.name.toLowerCase().includes('azithromycin'));
  assert(!!azith, 'Azithromycin was identified in Prescription B');
  assert(azith.dosage === '250mg', `Azithromycin dosage preserves 250mg without forcing 500mg default (found: ${azith.dosage})`);
  assert(azith.frequency.includes('OD') || azith.frequency.toLowerCase().includes('once daily'), `Azithromycin frequency OD extracted (found: ${azith.frequency})`);

  const panto = recordB.medications.find(m => m.name.toLowerCase().includes('pantoprazole'));
  assert(!!panto, 'Pantoprazole was identified in Prescription B');
  assert(panto.dosage === '40mg', `Pantoprazole dosage is 40mg (found: ${panto.dosage})`);
  assert(panto.timing.toLowerCase().includes('before meals'), `Pantoprazole timing Before Meals extracted (found: ${panto.timing})`);

  // Verify Prescription B is distinct from Prescription A
  assert(recordA.medications[0].name !== recordB.medications[0].name, 'Prescription A and B extract distinct medications');

  // Test 3: Prescription C (Ciprofloxacin 500mg & Cetirizine 10mg)
  console.log('\n[TEST GROUP 3] Prescription C (Ciprofloxacin 500mg & Cetirizine 10mg):');
  const rxCText = `
    Care Hospital
    Dr. Sneha Reddy
    Tab Ciprofloxacin 500mg BD after food
    Tab Cetirizine 10mg 0-0-1 bedtime
  `;

  const recordC = await extractMedicalRecord(rxCText, { fileName: 'rx_C.pdf', skipDelay: true });
  assert(recordC.medications.length === 2, `Extracted exactly 2 medications (found: ${recordC.medications.length})`);
  
  const cipro = recordC.medications.find(m => m.name.toLowerCase().includes('ciprofloxacin'));
  assert(!!cipro, 'Ciprofloxacin identified in Prescription C');
  assert(cipro.frequency.includes('BD') || cipro.frequency.toLowerCase().includes('twice daily'), `Ciprofloxacin BD extracted (found: ${cipro.frequency})`);

  const ceti = recordC.medications.find(m => m.name.toLowerCase().includes('cetirizine'));
  assert(!!ceti, 'Cetirizine identified in Prescription C');
  assert(ceti.dosage === '10mg', `Cetirizine 10mg preserved (found: ${ceti.dosage})`);

  // Test 4: Unreadable / Non-prescription Scans MUST NOT Fall Back to Metformin
  console.log('\n[TEST GROUP 4] Unreadable / Blank Document Handling:');
  const blankText = "Receipt No 12345. Thank you for your payment. Please visit again.";
  const recordBlank = await extractMedicalRecord(blankText, { fileName: 'blurred_scan.jpg', skipDelay: true });

  assert(recordBlank.medications.length === 0, `Unreadable text returns 0 medications (found: ${recordBlank.medications.length})`);
  assert(recordBlank.verificationStatus.includes('Needs Review'), `Verification status flagged as Needs Review (found: ${recordBlank.verificationStatus})`);
  assert(!recordBlank.summary.plainText.includes('Metformin'), 'Summary does not contain fake Metformin');

  // Test 5: Concurrent / Independent Scans
  console.log('\n[TEST GROUP 5] Concurrency & Unique Scan ID Isolation:');
  const [asyncA, asyncB, asyncC] = await Promise.all([
    extractMedicalRecord(rxAText, { fileName: 'rxA.jpg', scanId: 'SCAN-REQ-1', skipDelay: true }),
    extractMedicalRecord(rxBText, { fileName: 'rxB.png', scanId: 'SCAN-REQ-2', skipDelay: true }),
    extractMedicalRecord(rxCText, { fileName: 'rxC.pdf', scanId: 'SCAN-REQ-3', skipDelay: true })
  ]);

  assert(asyncA.scanId === 'SCAN-REQ-1', 'Async Scan A preserved its unique scan ID');
  assert(asyncB.scanId === 'SCAN-REQ-2', 'Async Scan B preserved its unique scan ID');
  assert(asyncC.scanId === 'SCAN-REQ-3', 'Async Scan C preserved its unique scan ID');
  assert(asyncA.medications[0].name.toLowerCase().includes('amoxicillin'), 'Async Scan A correctly returned Amoxicillin');
  assert(asyncB.medications[0].name.toLowerCase().includes('azithromycin'), 'Async Scan B correctly returned Azithromycin');
  assert(asyncC.medications[0].name.toLowerCase().includes('ciprofloxacin'), 'Async Scan C correctly returned Ciprofloxacin');

  // Test 6: Fuse.js Fuzzy Validation on Misspelled Prescription Lines
  console.log('\n[TEST GROUP 6] OCR Typos / Fuzzy Drug Matching:');
  const typoValidation = validateMedicine('Tab Telmisartn');
  assert(typoValidation.matchedName === 'Telmisartan', `Fuzzy matched "Telmisartn" -> "Telmisartan" (confidence: ${typoValidation.confidence})`);
  
  const typoPanto = validateMedicine('Pantoprazol');
  assert(typoPanto.matchedName === 'Pantoprazole', `Fuzzy matched "Pantoprazol" -> "Pantoprazole"`);

  console.log('\n======================================================');
  console.log(`  ALL PRESCRIPTION TESTS PASSED: ${passed} / ${total} checks successful!`);
  console.log('======================================================\n');
}

runPrescriptionTests().catch(err => {
  console.error('\nPrescription test suite failed:', err);
  process.exit(1);
});
