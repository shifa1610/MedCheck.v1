/**
 * MedCheck Indian Pharmaceutical Catalog & Look-Alike Sound-Alike (LASA) Database
 */

export const INDIAN_DRUG_CATALOG = [
  // Antidiabetic
  { generic: "Metformin", brands: ["Metformin Hydrochloride", "Glycomet", "Glucophage", "Obimet", "Cetapin"], commonStrengths: ["500 mg", "850 mg", "1000 mg"], class: "Biguanide (Antidiabetic)" },
  { generic: "Glimepiride", brands: ["Amaryl", "Glimy", "Gemer"], commonStrengths: ["1 mg", "2 mg", "3 mg"], class: "Sulfonylurea" },
  { generic: "Teneligliptin", brands: ["Tendia", "Zita", "Tenali", "Tenelimac"], commonStrengths: ["20 mg"], class: "DPP-4 Inhibitor" },
  { generic: "Vildagliptin", brands: ["Galvus", "Jalra", "Zomelis"], commonStrengths: ["50 mg"], class: "DPP-4 Inhibitor" },
  { generic: "Dapagliflozin", brands: ["Forxiga", "Oxra", "Dapaduce"], commonStrengths: ["5 mg", "10 mg"], class: "SGLT2 Inhibitor" },

  // Cardiovascular & Antihypertensive
  { generic: "Telmisartan", brands: ["Telma", "Micardis", "Telpres", "Telsar", "Telmikem"], commonStrengths: ["20 mg", "40 mg", "80 mg"], class: "ARB (Antihypertensive)" },
  { generic: "Atorvastatin", brands: ["Atorvastatin Calcium", "Atorva", "Lipitor", "Storvas", "Tonact"], commonStrengths: ["10 mg", "20 mg", "40 mg", "80 mg"], class: "Statin (Lipid-lowering)" },
  { generic: "Rosuvastatin", brands: ["Rozavel", "Rosuvas", "Roseday", "Rosulip"], commonStrengths: ["5 mg", "10 mg", "20 mg", "40 mg"], class: "Statin (Lipid-lowering)" },
  { generic: "Amlodipine", brands: ["Amlodipine Besylate", "Stamlo", "Amlong", "Norvasc", "Amtas"], commonStrengths: ["2.5 mg", "5 mg", "10 mg"], class: "Calcium Channel Blocker" },
  { generic: "Metoprolol", brands: ["Metoprolol Succinate", "Betaloc", "Metolar", "Starpress", "Metpure"], commonStrengths: ["25 mg", "50 mg", "100 mg"], class: "Beta-Blocker" },
  { generic: "Clopidogrel", brands: ["Clopilet", "Plavix", "Deplatt", "Ceruvin"], commonStrengths: ["75 mg"], class: "Antiplatelet" },
  { generic: "Aspirin", brands: ["Acetylsalicylic Acid", "Ecosprin", "Disprin", "Loprin", "Delisprin"], commonStrengths: ["75 mg", "150 mg"], class: "Antiplatelet / Analgesic" },
  { generic: "Losartan", brands: ["Losartan Potassium", "Losar", "Repace", "Tozaar"], commonStrengths: ["25 mg", "50 mg", "100 mg"], class: "ARB (Antihypertensive)" },
  { generic: "Ramipril", brands: ["Cardace", "Hopace", "Ramirx"], commonStrengths: ["2.5 mg", "5 mg", "10 mg"], class: "ACE Inhibitor" },

  // Gastrointestinal & Antacid
  { generic: "Pantoprazole", brands: ["Pantoprazole Sodium", "Pan 40", "Pantocid", "Pantosec", "Pantodac", "Pan"], commonStrengths: ["40 mg"], class: "Proton Pump Inhibitor" },
  { generic: "Omeprazole", brands: ["Omez", "Ocid", "Omee"], commonStrengths: ["20 mg", "40 mg"], class: "Proton Pump Inhibitor" },
  { generic: "Rabeprazole", brands: ["Rabeprazole Sodium", "Razo", "Happi", "Rablet", "Veloz"], commonStrengths: ["20 mg"], class: "Proton Pump Inhibitor" },
  { generic: "Ranitidine", brands: ["Rantac", "Aciloc", "Zinetac"], commonStrengths: ["150 mg", "300 mg"], class: "H2 Blocker" },

  // Analgesic, Antipyretic & Anti-inflammatory
  { generic: "Paracetamol", brands: ["Acetaminophen", "Dolo", "Dolo 650", "Calpol", "Calpol 650", "Crocin", "Pacimol", "Sumo L"], commonStrengths: ["500 mg", "650 mg"], class: "Analgesic / Antipyretic" },
  { generic: "Ibuprofen", brands: ["Brufen", "Ibugesic", "Combiflam"], commonStrengths: ["200 mg", "400 mg"], class: "NSAID" },
  { generic: "Aceclofenac", brands: ["Hifenac", "Zerodol", "Aceclo"], commonStrengths: ["100 mg"], class: "NSAID" },
  { generic: "Diclofenac", brands: ["Voveran", "Dynapar", "Voltaren"], commonStrengths: ["50 mg"], class: "NSAID" },

  // Antibiotics & Antimicrobial
  { generic: "Amoxicillin", brands: ["Mox", "Novamox", "Amoxil"], commonStrengths: ["250 mg", "500 mg"], class: "Penicillin Antibiotic" },
  { generic: "Amoxicillin and Potassium Clavulanate", brands: ["Augmentin", "Augmentin 625", "Augmentin 375", "Moxikind-CV", "Clavam", "Clavam 625", "Mega-CV"], commonStrengths: ["375 mg", "625 mg", "1000 mg"], class: "Penicillin + Beta-Lactamase Inhibitor" },
  { generic: "Azithromycin", brands: ["Azee", "Azithral", "Zithrox", "Azicip"], commonStrengths: ["250 mg", "500 mg"], class: "Macrolide Antibiotic" },
  { generic: "Ciprofloxacin", brands: ["Ciplox", "Ciprobid", "Cifran"], commonStrengths: ["250 mg", "500 mg"], class: "Fluoroquinolone Antibiotic" },
  { generic: "Levofloxacin", brands: ["Levomac", "Levaquin", "Glevo"], commonStrengths: ["500 mg", "750 mg"], class: "Fluoroquinolone Antibiotic" },
  { generic: "Cefixime", brands: ["Taxim-O", "Zifi", "Cefolac", "Omnix"], commonStrengths: ["100 mg", "200 mg"], class: "Cephalosporin Antibiotic" },
  { generic: "Doxycycline", brands: ["Doxicip", "Doxy-1", "Microdox"], commonStrengths: ["100 mg"], class: "Tetracycline Antibiotic" },
  { generic: "Metronidazole", brands: ["Flagyl", "Metrogyl", "Aristogyl"], commonStrengths: ["200 mg", "400 mg"], class: "Nitroimidazole Antimicrobial" },

  // Allergy & Respiratory
  { generic: "Cetirizine", brands: ["Cetzine", "Alerid", "Zyrtec", "Okacet"], commonStrengths: ["5 mg", "10 mg"], class: "Antihistamine" },
  { generic: "Levocetirizine", brands: ["Levocet", "Vozet", "Xyzal", "1-AL"], commonStrengths: ["5 mg"], class: "Antihistamine" },
  { generic: "Montelukast", brands: ["Montair", "Telekast", "Singulair"], commonStrengths: ["4 mg", "5 mg", "10 mg"], class: "Leukotriene Receptor Antagonist" },

  // Thyroid & Endocrine
  { generic: "Levothyroxine", brands: ["Levothyroxine Sodium", "Thyronorm", "Eltroxin", "Thyrox"], commonStrengths: ["25 mcg", "50 mcg", "75 mcg", "100 mcg", "125 mcg"], class: "Thyroid Hormone" }
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
  },
  {
    pair: ["Cetirizine", "Sertraline"],
    warning: "LOOK-ALIKE / SOUND-ALIKE: Cetirizine is an antihistamine; Sertraline is an SSRI antidepressant."
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
