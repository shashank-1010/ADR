export const SAMPLE_DRUGS = [
  {
    name: "Aspirin",
    genericName: "Acetylsalicylic Acid",
    category: "NSAID / Analgesic",
    activeIngredients: ["Acetylsalicylic acid 500mg"],
    indications: [
      "Pain relief (mild to moderate)",
      "Fever reduction",
      "Anti-inflammatory",
      "Cardiovascular risk reduction (low dose)",
    ],
    contraindications: [
      "Peptic ulcer disease",
      "Bleeding disorders",
      "Hypersensitivity to NSAIDs",
      "Children under 12 (Reye's syndrome risk)",
      "Third trimester of pregnancy",
    ],
    sideEffects: [
      "Gastrointestinal irritation",
      "Nausea",
      "Bleeding risk",
      "Tinnitus at high doses",
      "Allergic reactions",
    ],
    description:
      "Aspirin is a non-steroidal anti-inflammatory drug (NSAID) used for pain, fever, and inflammation. At low doses, it inhibits platelet aggregation for cardiovascular prophylaxis.",
    manufacturer: "Various",
  },
  {
    name: "Warfarin",
    genericName: "Warfarin Sodium",
    category: "Anticoagulant",
    activeIngredients: ["Warfarin sodium 5mg"],
    indications: [
      "Prevention of thromboembolic events",
      "Atrial fibrillation",
      "Deep vein thrombosis",
      "Pulmonary embolism prophylaxis",
      "Mechanical heart valves",
    ],
    contraindications: [
      "Active bleeding",
      "Pregnancy",
      "Severe hepatic impairment",
      "Recent surgery to CNS or eye",
      "Uncontrolled hypertension",
    ],
    sideEffects: [
      "Bleeding (major risk)",
      "Bruising",
      "Skin necrosis (rare)",
      "Purple toe syndrome",
      "Hair loss",
    ],
    description:
      "Warfarin is a vitamin K antagonist anticoagulant. It requires regular INR monitoring due to narrow therapeutic index and numerous drug/food interactions.",
    manufacturer: "Bristol-Myers Squibb",
  },
  {
    name: "Metformin",
    genericName: "Metformin Hydrochloride",
    category: "Antidiabetic (Biguanide)",
    activeIngredients: ["Metformin hydrochloride 500mg"],
    indications: [
      "Type 2 diabetes mellitus",
      "Polycystic ovary syndrome (off-label)",
      "Insulin resistance",
    ],
    contraindications: [
      "Renal impairment (eGFR < 30)",
      "Hepatic impairment",
      "Lactic acidosis risk",
      "Iodinated contrast procedures",
      "Severe heart failure",
    ],
    sideEffects: [
      "Nausea and vomiting",
      "Diarrhea",
      "Metallic taste",
      "Vitamin B12 deficiency (long-term)",
      "Lactic acidosis (rare but serious)",
    ],
    description:
      "Metformin is the first-line oral antidiabetic agent for type 2 diabetes. It reduces hepatic glucose production and improves insulin sensitivity.",
    manufacturer: "Various",
  },
  {
    name: "Lisinopril",
    genericName: "Lisinopril",
    category: "ACE Inhibitor",
    activeIngredients: ["Lisinopril 10mg"],
    indications: [
      "Hypertension",
      "Heart failure",
      "Post-myocardial infarction",
      "Diabetic nephropathy",
    ],
    contraindications: [
      "Pregnancy",
      "Angioedema history",
      "Bilateral renal artery stenosis",
      "Concurrent use with aliskiren in diabetes",
    ],
    sideEffects: [
      "Dry persistent cough",
      "Angioedema (rare but serious)",
      "Hyperkalemia",
      "Hypotension (first dose)",
      "Renal function decline",
    ],
    description:
      "Lisinopril is an ACE inhibitor that blocks the renin-angiotensin-aldosterone system, reducing blood pressure and cardiac workload.",
    manufacturer: "AstraZeneca",
  },
  {
    name: "Amoxicillin",
    genericName: "Amoxicillin Trihydrate",
    category: "Antibiotic (Penicillin)",
    activeIngredients: ["Amoxicillin trihydrate 500mg"],
    indications: [
      "Bacterial infections (respiratory tract)",
      "Ear infections (otitis media)",
      "Urinary tract infections",
      "Skin infections",
      "H. pylori eradication (combination therapy)",
    ],
    contraindications: [
      "Penicillin allergy",
      "Mononucleosis (risk of rash)",
    ],
    sideEffects: [
      "Diarrhea",
      "Nausea",
      "Skin rash",
      "Allergic reactions (including anaphylaxis)",
      "Oral/vaginal candidiasis",
    ],
    description:
      "Amoxicillin is a broad-spectrum penicillin antibiotic effective against gram-positive and some gram-negative bacteria.",
    manufacturer: "Various",
  },
  {
    name: "Simvastatin",
    genericName: "Simvastatin",
    category: "Statin (HMG-CoA Reductase Inhibitor)",
    activeIngredients: ["Simvastatin 20mg"],
    indications: [
      "Hypercholesterolemia",
      "Cardiovascular risk reduction",
      "Prevention of major cardiovascular events",
    ],
    contraindications: [
      "Active liver disease",
      "Pregnancy and breastfeeding",
      "Concurrent use with strong CYP3A4 inhibitors",
      "Myopathy history",
    ],
    sideEffects: [
      "Muscle pain (myalgia)",
      "Rhabdomyolysis (rare)",
      "Elevated liver enzymes",
      "Headache",
      "Gastrointestinal upset",
    ],
    description:
      "Simvastatin reduces LDL cholesterol by inhibiting HMG-CoA reductase in the liver. Requires monitoring for muscle and liver adverse effects.",
    manufacturer: "Merck",
  },
  {
    name: "Omeprazole",
    genericName: "Omeprazole",
    category: "Proton Pump Inhibitor",
    activeIngredients: ["Omeprazole 20mg"],
    indications: [
      "Gastroesophageal reflux disease (GERD)",
      "Peptic ulcer disease",
      "Zollinger-Ellison syndrome",
      "H. pylori eradication (combination)",
      "NSAID-induced gastropathy prevention",
    ],
    contraindications: [
      "Hypersensitivity to proton pump inhibitors",
      "Concurrent use with atazanavir or nelfinavir",
    ],
    sideEffects: [
      "Headache",
      "Diarrhea",
      "Hypomagnesemia (long-term)",
      "Vitamin B12 deficiency",
      "Increased risk of C. difficile infection",
    ],
    description:
      "Omeprazole is a proton pump inhibitor that reduces gastric acid secretion. One of the most widely prescribed medications globally.",
    manufacturer: "AstraZeneca",
  },
  {
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    category: "NSAID / Analgesic",
    activeIngredients: ["Ibuprofen 400mg"],
    indications: [
      "Mild to moderate pain",
      "Fever",
      "Osteoarthritis",
      "Rheumatoid arthritis",
      "Dysmenorrhea",
    ],
    contraindications: [
      "Active peptic ulcer",
      "Severe heart failure",
      "Severe renal impairment",
      "Third trimester of pregnancy",
      "NSAID hypersensitivity",
    ],
    sideEffects: [
      "Gastrointestinal irritation",
      "Nausea",
      "Dyspepsia",
      "Renal impairment",
      "Cardiovascular events (prolonged use)",
    ],
    description:
      "Ibuprofen is a widely used NSAID with analgesic, antipyretic, and anti-inflammatory properties. Should be taken with food to minimize gastrointestinal effects.",
    manufacturer: "Various",
  },
];

export const DRUG_INTERACTIONS: Record<string, {
  drug1: string;
  drug2: string;
  severity: "safe" | "moderate" | "dangerous";
  explanation: string;
  alternatives: string[];
}> = {
  "aspirin-warfarin": {
    drug1: "Aspirin",
    drug2: "Warfarin",
    severity: "dangerous",
    explanation: "Aspirin inhibits platelet aggregation while warfarin reduces clotting factor synthesis. Combined use significantly increases the risk of serious or fatal bleeding events.",
    alternatives: ["Consider clopidogrel under specialist guidance if antiplatelet therapy is needed"],
  },
  "warfarin-ibuprofen": {
    drug1: "Warfarin",
    drug2: "Ibuprofen",
    severity: "dangerous",
    explanation: "NSAIDs like ibuprofen displace warfarin from protein binding, increase warfarin levels, inhibit platelet function, and damage the gastric mucosa — all of which dramatically increase bleeding risk.",
    alternatives: ["Paracetamol/acetaminophen is generally safer for pain relief while on warfarin"],
  },
  "simvastatin-amoxicillin": {
    drug1: "Simvastatin",
    drug2: "Amoxicillin",
    severity: "safe",
    explanation: "No clinically significant pharmacokinetic or pharmacodynamic interaction known between simvastatin and amoxicillin.",
    alternatives: [],
  },
  "metformin-ibuprofen": {
    drug1: "Metformin",
    drug2: "Ibuprofen",
    severity: "moderate",
    explanation: "NSAIDs can reduce renal blood flow, decreasing metformin excretion and increasing the risk of lactic acidosis, particularly in patients with renal impairment.",
    alternatives: ["Paracetamol is preferred for pain relief in patients on metformin"],
  },
  "lisinopril-ibuprofen": {
    drug1: "Lisinopril",
    drug2: "Ibuprofen",
    severity: "moderate",
    explanation: "NSAIDs antagonize the antihypertensive effect of ACE inhibitors and can cause acute kidney injury, particularly in elderly or volume-depleted patients.",
    alternatives: ["Paracetamol for pain management", "Consider dose adjustment of lisinopril if NSAID is necessary"],
  },
  "aspirin-ibuprofen": {
    drug1: "Aspirin",
    drug2: "Ibuprofen",
    severity: "moderate",
    explanation: "Ibuprofen may competitively inhibit the irreversible platelet inhibition by low-dose aspirin, potentially reducing the cardioprotective effect of aspirin therapy.",
    alternatives: ["Take aspirin 2 hours before ibuprofen if both are needed", "Consider alternative analgesics"],
  },
};
