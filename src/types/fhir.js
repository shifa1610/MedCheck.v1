/**
 * ABDM / FHIR R4 Standards Data Model
 * Compliant with Ayushman Bharat Digital Mission (ABDM) Health Information Exchange Specifications
 */

// LOINC codes for common laboratory biomarkers
export const LOINC_MAPPINGS = {
  hba1c: { code: '4548-4', display: 'Hemoglobin A1c/Hemoglobin.total in Blood', unit: '%' },
  glucose_fasting: { code: '1558-6', display: 'Fasting Glucose [Mass/volume] in Serum or Plasma', unit: 'mg/dL' },
  glucose_pp: { code: '1554-5', display: 'Postprandial Glucose [Mass/volume] in Serum or Plasma', unit: 'mg/dL' },
  cholesterol_total: { code: '2093-3', display: 'Cholesterol [Mass/volume] in Serum or Plasma', unit: 'mg/dL' },
  cholesterol_ldl: { code: '13457-7', display: 'Cholesterol in LDL [Mass/volume] in Serum or Plasma', unit: 'mg/dL' },
  cholesterol_hdl: { code: '2085-9', display: 'Cholesterol in HDL [Mass/volume] in Serum or Plasma', unit: 'mg/dL' },
  triglycerides: { code: '2571-8', display: 'Triglyceride [Mass/volume] in Serum or Plasma', unit: 'mg/dL' },
  creatinine: { code: '2160-0', display: 'Creatinine [Mass/volume] in Serum or Plasma', unit: 'mg/dL' },
  hemoglobin: { code: '718-7', display: 'Hemoglobin [Mass/volume] in Blood', unit: 'g/dL' },
  bp_systolic: { code: '8480-6', display: 'Systolic blood pressure', unit: 'mmHg' },
  bp_diastolic: { code: '8462-4', display: 'Diastolic blood pressure', unit: 'mmHg' },
};

/**
 * Transforms an internal medical record into an ABDM-compliant FHIR R4 Bundle
 */
export function recordToFHIRBundle(record, patient) {
  const bundleId = `bundle-${record.id || Date.now()}`;
  const timestamp = new Date().toISOString();

  const entries = [
    // 1. Patient Resource
    {
      fullUrl: `urn:uuid:patient-${patient.id}`,
      resource: {
        resourceType: 'Patient',
        id: patient.id,
        identifier: [
          {
            system: 'https://healthid.ndhm.gov.in',
            value: patient.abhaId,
            type: {
              coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'MR', display: 'ABHA Number' }]
            }
          },
          {
            system: 'https://abdm.gov.in/abha-address',
            value: patient.abhaAddress,
            type: {
              coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v2-0203', code: 'PI', display: 'ABHA Address' }]
            }
          }
        ],
        name: [{ text: patient.name }],
        gender: patient.gender?.toLowerCase() || 'unknown',
        birthDate: patient.dob || '1984-05-15',
        telecom: [{ system: 'phone', value: patient.phone || '+91 98765 43210' }]
      }
    },
    
    // 2. DiagnosticReport Resource
    {
      fullUrl: `urn:uuid:report-${record.id}`,
      resource: {
        resourceType: 'DiagnosticReport',
        id: `report-${record.id}`,
        status: 'final',
        category: [{
          coding: [{
            system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
            code: record.type === 'prescription' ? 'RX' : 'LAB',
            display: record.type?.toUpperCase()
          }]
        }],
        code: {
          text: record.title || 'Diagnostic Assessment & Health Evaluation'
        },
        subject: { reference: `urn:uuid:patient-${patient.id}` },
        effectiveDateTime: record.date || new Date().toISOString().split('T')[0],
        issued: timestamp,
        performer: [{ display: record.doctor || record.facility || 'Healthcare Provider' }],
        conclusion: record.summary?.plainText || record.summary || 'Summary unavailable'
      }
    }
  ];

  // 3. Observations (Lab Tests / Biomarkers)
  if (record.biomarkers && Array.isArray(record.biomarkers)) {
    record.biomarkers.forEach((bio, idx) => {
      const bioKey = bio.name.toLowerCase().replace(/[\s-]/g, '_');
      const loinc = LOINC_MAPPINGS[bioKey] || { code: '26436-6', display: bio.name, unit: bio.unit || '' };

      const obsId = `obs-${record.id}-${idx}`;
      entries.push({
        fullUrl: `urn:uuid:${obsId}`,
        resource: {
          resourceType: 'Observation',
          id: obsId,
          status: 'final',
          code: {
            coding: [{
              system: 'http://loinc.org',
              code: loinc.code,
              display: loinc.display
            }],
            text: bio.name
          },
          subject: { reference: `urn:uuid:patient-${patient.id}` },
          effectiveDateTime: record.date,
          valueQuantity: {
            value: parseFloat(bio.value) || 0,
            unit: bio.unit || loinc.unit,
            system: 'http://unitsofmeasure.org'
          },
          interpretation: [{
            coding: [{
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
              code: bio.status === 'High' ? 'H' : bio.status === 'Low' ? 'L' : 'N',
              display: bio.status || 'Normal'
            }]
          }],
          referenceRange: bio.referenceRange ? [{
            text: bio.referenceRange
          }] : undefined
        }
      });
    });
  }

  // 4. MedicationRequests (Prescribed Drugs)
  if (record.medications && Array.isArray(record.medications)) {
    record.medications.forEach((med, idx) => {
      const medId = `med-${record.id}-${idx}`;
      entries.push({
        fullUrl: `urn:uuid:${medId}`,
        resource: {
          resourceType: 'MedicationRequest',
          id: medId,
          status: 'active',
          intent: 'order',
          medicationCodeableConcept: {
            text: `${med.name} ${med.dosage || ''}`.trim()
          },
          subject: { reference: `urn:uuid:patient-${patient.id}` },
          authoredOn: record.date,
          requester: { display: record.doctor || 'Attending Physician' },
          dosageInstruction: [{
            text: `${med.frequency || ''} - ${med.timing || ''} (${med.duration || ''})`,
            timing: {
              code: { text: med.frequency || 'Once daily' }
            },
            additionalInstruction: med.instructions ? [{ text: med.instructions }] : []
          }]
        }
      });
    });
  }

  // 5. Conditions (Diagnoses)
  if (record.diagnoses && Array.isArray(record.diagnoses)) {
    record.diagnoses.forEach((diag, idx) => {
      const condId = `cond-${record.id}-${idx}`;
      entries.push({
        fullUrl: `urn:uuid:${condId}`,
        resource: {
          resourceType: 'Condition',
          id: condId,
          clinicalStatus: {
            coding: [{
              system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
              code: 'active',
              display: 'Active'
            }]
          },
          verificationStatus: {
            coding: [{
              system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
              code: 'confirmed',
              display: 'Confirmed'
            }]
          },
          code: { text: diag },
          subject: { reference: `urn:uuid:patient-${patient.id}` },
          recordedDate: record.date
        }
      });
    });
  }

  return {
    resourceType: 'Bundle',
    id: bundleId,
    meta: {
      lastUpdated: timestamp,
      profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle']
    },
    identifier: {
      system: 'https://abdm.gov.in/bundle',
      value: bundleId
    },
    type: 'document',
    timestamp: timestamp,
    entry: entries
  };
}
