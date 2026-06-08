import { SAMPLE_DRUGS } from "./drugs";

export interface DrugRecord {
  id: string;
  name: string;
  genericName: string;
  category: string;
  activeIngredients: string[];
  indications: string[];
  contraindications: string[];
  sideEffects: string[];
  description: string;
  manufacturer?: string;
}

export interface AdrReportRecord {
  id: string;
  drugName: string;
  reaction: string;
  severity: "mild" | "moderate" | "severe";
  patientAge?: number;
  description: string;
  outcome?: string;
  reportedAt: string;
  status: "pending" | "reviewed" | "resolved";
}

let drugsStore: DrugRecord[] = SAMPLE_DRUGS.map((d, i) => ({
  ...d,
  id: `drug_${i + 1}`,
}));

let reportsStore: AdrReportRecord[] = [
  {
    id: "rpt_001",
    drugName: "Warfarin",
    reaction: "Gastrointestinal Haemorrhage",
    severity: "severe",
    patientAge: 72,
    description: "Patient presented with rectal bleeding 3 weeks after commencing warfarin therapy for atrial fibrillation. INR found to be supratherapeutic at 5.2. Admitted for reversal and monitoring.",
    outcome: "Hospitalised, INR corrected with vitamin K. Warfarin dose adjusted.",
    reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "reviewed",
  },
  {
    id: "rpt_002",
    drugName: "Lisinopril",
    reaction: "Angioedema",
    severity: "severe",
    patientAge: 55,
    description: "Patient developed rapid onset facial and tongue swelling within 2 hours of first dose of lisinopril. No respiratory compromise but required emergency department attendance.",
    outcome: "Drug discontinued. Switched to ARB (losartan). Full recovery.",
    reportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "resolved",
  },
  {
    id: "rpt_003",
    drugName: "Simvastatin",
    reaction: "Myalgia with elevated CK",
    severity: "moderate",
    patientAge: 61,
    description: "Patient reported progressive bilateral leg pain 6 weeks after increasing simvastatin to 80mg. CK elevated at 1800 U/L. No renal impairment.",
    outcome: "Simvastatin reduced to 20mg. Symptoms resolved over 3 weeks.",
    reportedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: "resolved",
  },
  {
    id: "rpt_004",
    drugName: "Amoxicillin",
    reaction: "Maculopapular Rash",
    severity: "mild",
    patientAge: 34,
    description: "Widespread non-urticarial rash developed on day 5 of amoxicillin course for chest infection. No systemic features. Drug ceased and rash resolved.",
    outcome: "Drug discontinued. Rash resolved within 5 days. Penicillin allergy documented.",
    reportedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "reviewed",
  },
  {
    id: "rpt_005",
    drugName: "Metformin",
    reaction: "Lactic Acidosis",
    severity: "severe",
    patientAge: 68,
    description: "Elderly patient with pre-existing renal impairment (eGFR 28) developed fatigue, nausea and elevated lactate (8 mmol/L). Metformin had not been dose-adjusted for renal function.",
    outcome: "ICU admission required. Metformin ceased permanently. Insulin initiated.",
    reportedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: "reviewed",
  },
  {
    id: "rpt_006",
    drugName: "Ibuprofen",
    reaction: "Acute Kidney Injury",
    severity: "moderate",
    patientAge: 78,
    description: "Elderly patient taking ibuprofen for arthritis pain developed oliguria and rising creatinine. Also on lisinopril and furosemide — triple whammy nephropathy.",
    outcome: "NSAID ceased. Creatinine normalised after IV fluids and withholding ACE inhibitor temporarily.",
    reportedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    status: "resolved",
  },
  {
    id: "rpt_007",
    drugName: "Omeprazole",
    reaction: "Clostridium difficile Colitis",
    severity: "moderate",
    patientAge: 45,
    description: "Patient developed C. difficile infection after prolonged omeprazole use following antibiotic course. Presented with severe watery diarrhoea.",
    outcome: "Omeprazole ceased. Metronidazole course commenced. Symptoms resolved.",
    reportedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "rpt_008",
    drugName: "Aspirin",
    reaction: "Peptic Ulcer with Haematemesis",
    severity: "severe",
    patientAge: 58,
    description: "Patient on daily low-dose aspirin presented with haematemesis. OGD confirmed duodenal ulcer. Had not been prescribed a PPI for gastroprotection.",
    outcome: "Aspirin paused. IV PPI commenced. Ulcer treated with H. pylori eradication therapy.",
    reportedAt: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
    status: "reviewed",
  },
];

export const db = {
  drugs: {
    findAll(search?: string, limit = 50): DrugRecord[] {
      let results = drugsStore;
      if (search) {
        const s = search.toLowerCase();
        results = results.filter(
          (d) =>
            d.name.toLowerCase().includes(s) ||
            d.genericName.toLowerCase().includes(s) ||
            d.category.toLowerCase().includes(s)
        );
      }
      return results.slice(0, limit);
    },
    findById(id: string): DrugRecord | undefined {
      return drugsStore.find((d) => d.id === id);
    },
  },
  reports: {
    findAll(limit = 20, severity?: string): AdrReportRecord[] {
      let results = reportsStore;
      if (severity) results = results.filter((r) => r.severity === severity);
      return results.sort((a, b) => b.reportedAt.localeCompare(a.reportedAt)).slice(0, limit);
    },
    create(data: Omit<AdrReportRecord, "id" | "reportedAt" | "status">): AdrReportRecord {
      const report: AdrReportRecord = {
        ...data,
        id: `rpt_${Date.now()}`,
        reportedAt: new Date().toISOString(),
        status: "pending",
      };
      reportsStore.unshift(report);
      return report;
    },
    countBySeverity() {
      return {
        mild: reportsStore.filter((r) => r.severity === "mild").length,
        moderate: reportsStore.filter((r) => r.severity === "moderate").length,
        severe: reportsStore.filter((r) => r.severity === "severe").length,
      };
    },
    recentMonth() {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      return reportsStore.filter((r) => new Date(r.reportedAt) >= startOfMonth).length;
    },
    topDrugs(limit = 5) {
      const counts: Record<string, number> = {};
      for (const r of reportsStore) counts[r.drugName] = (counts[r.drugName] || 0) + 1;
      return Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([name, count]) => ({ name, count }));
    },
  },
};
