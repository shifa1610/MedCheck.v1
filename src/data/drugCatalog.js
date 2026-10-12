/**
 * MedCheck Indian Pharmaceutical Catalog & Look-Alike Sound-Alike (LASA) Database
 */

export const INDIAN_DRUG_CATALOG = [
  { generic: "Metformin Hydrochloride", brands: ["Glycomet", "Glucophage", "Obimet", "Cetapin"], commonStrengths: ["500 mg", "850 mg", "1000 mg"], class: "Biguanide (Antidiabetic)" },
  { generic: "Telmisartan", brands: ["Telma", "Micardis", "Telpres", "Telsar"], commonStrengths: ["20 mg", "40 mg", "80 mg"], class: "ARB (Antihypertensive)" },
  { generic: "Atorvastatin Calcium", brands: ["Atorva", "Lipitor", "Storvas", "Tonact"], commonStrengths: ["10 mg", "20 mg", "40 mg"], class: "Statin (Lipid-lowering)" },
  { generic: "Amlodipine Besylate", brands: ["Stamlo", "Amlong", "Norvasc", "Amtas"], commonStrengths: ["2.5 mg", "5 mg", "10 mg"], class: "Calcium Channel Blocker" },
  { generic: "Pantoprazole Sodium", brands: ["Pan 40", "Pantocid", "Pantosec", "Pantodac"], commonStrengths: ["40 mg"], class: "Proton Pump Inhibitor" },
  { generic: "Clopidogrel", brands: ["Clopilet", "Plavix", "Deplatt", "Ceruvin"], commonStrengths: ["75 mg"], class: "Antiplatelet" },
  { generic: "Aspirin (Acetylsalicylic Acid)", brands: ["Ecosprin", "Disprin", "Loprin"], commonStrengths: ["75 mg", "150 mg"], class: "Antiplatelet / Analgesic" },
  { generic: "Teneligliptin", brands: ["Tendia", "Zita", "Tenali", "Tenelimac"], commonStrengths: ["20 mg"], class: "DPP-4 Inhibitor" },
  { generic: "Metoprolol Succinate", brands: ["Betaloc", "Metolar", "Starpress"], commonStrengths: ["25 mg", "50 mg"], class: "Beta-Blocker" },
  { generic: "Rosuvastatin", brands: ["Rozavel", "Rosuvas", "Roseday"], commonStrengths: ["5 mg", "10 mg", "20 mg"], class: "Statin (Lipid-lowering)" },
  { generic: "Glimepiride", brands: ["Amaryl", "Glimy", "Gemer"], commonStrengths: ["1 mg", "2 mg", "3 mg"], class: "Sulfonylurea" },
  { generic: "Paracetamol", brands: ["Dolo 650", "Calpol", "Crocin", "Pacimol"], commonStrengths: ["500 mg", "650 mg"], class: "Analgesic / Antipyretic" },
  { generic: "Azithromycin", brands: ["Azee", "Azithral", "Zithrox"], commonStrengths: ["250 mg", "500 mg"], class: "Macrolide Antibiotic" }
];

// Look-Alike / Sound-Alike (LASA) safety flags
export const LASA_LOOKALIKE_PAIRS = [
  {
    pair: ["Metformin", "Metoprolol"],
    warning: "CRITICAL LOOK-ALIKE: Metformin regulates blood glucose; Metoprolol controls heart rate & blood pressure. Verify handwritten script carefully."
  },
  {
    pair: ["Telmisartan", "Teneligliptin"],
    warning: "LOOK-ALIKE: Telmisartan treats hypertension; Teneligliptin treats diabetes. Confirm clinical indication with user."
  },
  {
    pair: ["Amlodipine", "Amiloride"],
    warning: "HIGH RISK LOOK-ALIKE: Amlodipine is a calcium channel blocker; Amiloride is a potassium-sparing diuretic."
  },
  {
    pair: ["Clopidogrel", "Clozapine"],
    warning: "CRITICAL SAFETY: Clopidogrel is a cardiovascular blood thinner; Clozapine is an antipsychotic."
  }
];

// Lab unit conversions
export const UNIT_CONVERSIONS = {
  glucose_mmol_to_mgdl: {
    from: "mmol/L",
    to: "mg/dL",
    factor: 18.0182,
    formula: (val) => Math.round(val * 18.0182 * 10) / 10
  },
  cholesterol_mmol_to_mgdl: {
    from: "mmol/L",
    to: "mg/dL",
    factor: 38.67,
    formula: (val) => Math.round(val * 38.67 * 10) / 10
  },
  creatinine_umol_to_mgdl: {
    from: "µmol/L",
    to: "mg/dL",
    factor: 0.0113,
    formula: (val) => Math.round(val * 0.0113 * 100) / 100
  }
};
