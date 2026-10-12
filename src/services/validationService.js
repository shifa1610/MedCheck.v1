import Fuse from 'fuse.js';
import { INDIAN_DRUG_CATALOG, LASA_LOOKALIKE_PAIRS, UNIT_CONVERSIONS } from '../data/drugCatalog';

// Flatten catalog for fuzzy search
const searchableItems = [];
INDIAN_DRUG_CATALOG.forEach(entry => {
  searchableItems.push({
    name: entry.generic,
    generic: entry.generic,
    type: 'generic',
    strengths: entry.commonStrengths,
    class: entry.class
  });
  entry.brands.forEach(brand => {
    searchableItems.push({
      name: brand,
      generic: entry.generic,
      type: 'brand',
      strengths: entry.commonStrengths,
      class: entry.class
    });
  });
});

const fuse = new Fuse(searchableItems, {
  keys: ['name', 'generic'],
  threshold: 0.45,
  includeScore: true
});

/**
 * Fuzzy matches raw medicine OCR against Indian drug database
 * Returns matched name, confidence tier, and up to 3 candidates
 */
export function validateMedicine(rawName) {
  if (!rawName || rawName.trim().length < 2) {
    return {
      rawName: rawName || 'Unreadable',
      matchedName: '',
      confidence: 'unreadable',
      candidateMatches: [],
      lookAlikeWarning: null
    };
  }

  // Clean common noise prefixes like 'Tab', 'Cap', 'Syp', 'Inj'
  const cleaned = rawName
    .replace(/^(tab|cap|syp|inj|tablet|capsule|syrup)\.?\s+/i, '')
    .trim();

  const results = fuse.search(cleaned);

  if (!results || results.length === 0) {
    return {
      rawName,
      matchedName: '',
      confidence: 'unreadable',
      candidateMatches: ["Manual Entry Required"],
      lookAlikeWarning: null
    };
  }

  const best = results[0];
  const score = best.score; // 0 is perfect, 1 is mismatch
  const topCandidates = results.slice(0, 3).map(r => r.item.generic);
  // Deduplicate candidates
  const uniqueCandidates = [...new Set(topCandidates)];

  let confidence = 'high';
  if (score > 0.35) {
    confidence = 'low';
  } else if (score > 0.15) {
    confidence = 'medium';
  }

  // Check for Look-Alike / Sound-Alike (LASA) safety hazards
  let lookAlikeWarning = null;
  LASA_LOOKALIKE_PAIRS.forEach(({ pair, warning }) => {
    const isPair0 = pair[0].toLowerCase();
    const isPair1 = pair[1].toLowerCase();
    const currentGeneric = best.item.generic.toLowerCase();

    if (currentGeneric.includes(isPair0) || currentGeneric.includes(isPair1)) {
      lookAlikeWarning = warning;
    }
  });

  return {
    rawName,
    matchedName: best.item.generic,
    confidence,
    candidateMatches: uniqueCandidates,
    lookAlikeWarning
  };
}

/**
 * Normalizes clinical laboratory units if necessary (e.g. mmol/L to mg/dL)
 */
export function normalizeLabUnit(testName, observedValue, unit) {
  const tName = testName.toLowerCase();
  const u = unit?.toLowerCase() || '';

  if ((tName.includes('glucose') || tName.includes('sugar')) && u.includes('mmol')) {
    const conv = UNIT_CONVERSIONS.glucose_mmol_to_mgdl;
    return {
      originalValue: observedValue,
      originalUnit: unit,
      normalizedValue: conv.formula(observedValue),
      normalizedUnit: conv.to,
      wasConverted: true
    };
  }

  if (tName.includes('cholesterol') && u.includes('mmol')) {
    const conv = UNIT_CONVERSIONS.cholesterol_mmol_to_mgdl;
    return {
      originalValue: observedValue,
      originalUnit: unit,
      normalizedValue: conv.formula(observedValue),
      normalizedUnit: conv.to,
      wasConverted: true
    };
  }

  return {
    originalValue: observedValue,
    originalUnit: unit,
    normalizedValue: observedValue,
    normalizedUnit: unit,
    wasConverted: false
  };
}

/**
 * Generates deterministic hash for duplicate upload detection
 */
export function computeRecordHash(record) {
  const rawKey = `${record.date}-${record.facility}-${record.type}-${(record.title || '').trim().toLowerCase()}`;
  let hash = 0;
  for (let i = 0; i < rawKey.length; i++) {
    const char = rawKey.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `HASH-${Math.abs(hash)}`;
}
