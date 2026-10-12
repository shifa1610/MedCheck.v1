import { 
  HeartPulse, 
  GitCompare, 
  CheckSquare, 
  FileText, 
  TrendingUp, 
  Pill, 
  Languages, 
  Printer, 
  Award, 
  Presentation, 
  ShieldCheck 
} from 'lucide-react';

export const SIDEBAR_MODULES = [
  {
    id: 'dashboard',
    title: "Health Dashboard",
    description: "Summary of vital indicators, health statistics, and recent activity.",
    icon: HeartPulse,
    badge: "Module 1"
  },
  {
    id: 'compare',
    title: "Compare & Flag Conflicts",
    description: "Compare prescriptions across dates to flag dosage changes and drug conflicts.",
    icon: GitCompare,
    badge: "Module 2"
  },
  {
    id: 'verify',
    title: "Verify Review",
    description: "Review and correct extracted doctor notes before saving to record.",
    icon: CheckSquare,
    badge: "Module 3"
  },
  {
    id: 'timeline',
    title: "Records Timeline",
    description: "Chronological medical record history with date and record-type filters.",
    icon: FileText,
    badge: "Module 4"
  },
  {
    id: 'trends',
    title: "Biomarker Trends",
    description: "Charts of lab tests over time against laboratory reference bounds.",
    icon: TrendingUp,
    badge: "Module 5"
  },
  {
    id: 'medications',
    title: "Medications",
    description: "Active medication list, dosages, timings, and food instructions.",
    icon: Pill,
    badge: "Module 6"
  },
  {
    id: 'converter',
    title: "Language & Voice",
    description: "Translate medical advice into 8 Indian languages with voice-over.",
    icon: Languages,
    badge: "Module 7"
  },
  {
    id: 'visitprep',
    title: "Visit-Prep Brief",
    description: "Generate a 1-page printable summary with questions to ask your doctor.",
    icon: Printer,
    badge: "Module 8"
  },
  {
    id: 'accuracy',
    title: "Accuracy Benchmark",
    description: "Compare extraction precision against verified clinical test datasets.",
    icon: Award,
    badge: "Module 9"
  },
  {
    id: 'slides',
    title: "Demo Slides",
    description: "Slide deck presenting project architecture, workflow, and challenge scope.",
    icon: Presentation,
    badge: "Module 10"
  },
  {
    id: 'abha',
    title: "ABHA & FHIR Locker",
    description: "Standard ABDM FHIR R4 JSON bundles and national health interoperability.",
    icon: ShieldCheck,
    badge: "Module 11"
  }
];
