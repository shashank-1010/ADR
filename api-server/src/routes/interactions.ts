import { Router } from "express";
import { DRUG_INTERACTIONS } from "../data/drugs";
import OpenAI from "openai";

const router = Router();

function getInteractionKey(drug1: string, drug2: string): string {
  const a = drug1.toLowerCase().replace(/\s+/g, "-");
  const b = drug2.toLowerCase().replace(/\s+/g, "-");
  return [a, b].sort().join("-");
}

router.post("/interactions/check", async (req, res) => {
  try {
    const { drugs, patientAge, conditions } = req.body;

    if (!Array.isArray(drugs) || drugs.length < 2) {
      res.status(400).json({ error: "validation_error", message: "At least 2 drugs required" });
      return;
    }

    const interactions = [];
    const warnings: string[] = [];

    for (let i = 0; i < drugs.length; i++) {
      for (let j = i + 1; j < drugs.length; j++) {
        const key = getInteractionKey(drugs[i], drugs[j]);
        if (DRUG_INTERACTIONS[key]) {
          interactions.push(DRUG_INTERACTIONS[key]);
        } else {
          interactions.push({
            drug1: drugs[i],
            drug2: drugs[j],
            severity: "safe" as const,
            explanation: `No known clinically significant interaction between ${drugs[i]} and ${drugs[j]} has been identified in our database.`,
            alternatives: [],
          });
        }
      }
    }

    if (patientAge && patientAge > 65) {
      warnings.push("Elderly patients (>65 years) may be more susceptible to drug interactions and adverse effects. Enhanced monitoring is advised.");
    }

    if (conditions && Array.isArray(conditions)) {
      if (conditions.some((c: string) => /renal|kidney/i.test(c))) {
        warnings.push("Renal impairment can alter drug metabolism and excretion. Dose adjustments may be necessary.");
      }
      if (conditions.some((c: string) => /liver|hepatic/i.test(c))) {
        warnings.push("Hepatic impairment affects drug metabolism. Review doses for hepatically-cleared medications.");
      }
    }

    const hasDangerous = interactions.some((i) => i.severity === "dangerous");
    const hasModerate = interactions.some((i) => i.severity === "moderate");
    const overallSeverity = hasDangerous ? "dangerous" : hasModerate ? "moderate" : "safe";

    const recommendations = hasDangerous
      ? ["Consult a physician or clinical pharmacist before proceeding with this combination", "Consider alternative therapies where available"]
      : hasModerate
      ? ["Monitor the patient closely for signs of adverse effects", "Consider dose adjustment under medical supervision"]
      : ["This combination appears safe. Continue to monitor for any unexpected effects."];

    res.json({ overallSeverity, interactions, warnings, recommendations });
  } catch (err) {
    req.log.error({ err }, "Interaction check failed");
    res.status(500).json({ error: "server_error", message: "Interaction check failed" });
  }
});

export default router;
