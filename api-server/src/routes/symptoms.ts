import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const DISCLAIMER = "This analysis is for advisory purposes only and does not constitute medical advice. Always consult a qualified healthcare professional before making any medical decisions.";

const SYMPTOM_MAP: Record<string, { disease: string; description: string; recommendedAction: string; urgencyLevel: "low" | "medium" | "high" | "emergency" }[]> = {
  "chest pain": [
    { disease: "Angina Pectoris", description: "Chest pain caused by reduced blood flow to the heart muscle.", recommendedAction: "Seek immediate medical evaluation. Avoid strenuous activity.", urgencyLevel: "emergency" },
    { disease: "Myocardial Infarction (Heart Attack)", description: "Blockage of blood flow to heart muscle — a medical emergency.", recommendedAction: "Call emergency services immediately (999/911).", urgencyLevel: "emergency" },
    { disease: "GERD / Acid Reflux", description: "Stomach acid reflux causing chest burning sensation.", recommendedAction: "Consult a doctor. Avoid triggers. May require antacid therapy.", urgencyLevel: "medium" },
  ],
  "headache": [
    { disease: "Tension Headache", description: "Most common headache type, often related to stress or posture.", recommendedAction: "Rest, hydration, and OTC analgesics. Consult if persistent.", urgencyLevel: "low" },
    { disease: "Migraine", description: "Moderate to severe throbbing headache, often one-sided, with nausea/photophobia.", recommendedAction: "See a physician for migraine management and triggers identification.", urgencyLevel: "medium" },
    { disease: "Hypertensive Headache", description: "Severe headache associated with elevated blood pressure.", recommendedAction: "Check blood pressure urgently. Seek emergency care if BP is very high.", urgencyLevel: "high" },
  ],
  "fever": [
    { disease: "Influenza (Flu)", description: "Viral respiratory infection with sudden fever, body aches, and fatigue.", recommendedAction: "Rest, fluids, antipyretics. Antiviral therapy if within 48h of onset.", urgencyLevel: "medium" },
    { disease: "Bacterial Infection", description: "Bacterial infection requiring antibiotic evaluation.", recommendedAction: "Blood cultures and CBC recommended. May require antibiotics.", urgencyLevel: "high" },
    { disease: "COVID-19", description: "SARS-CoV-2 viral infection — respiratory and systemic symptoms.", recommendedAction: "PCR testing recommended. Isolate and seek medical review.", urgencyLevel: "medium" },
  ],
  "cough": [
    { disease: "Upper Respiratory Tract Infection (URTI)", description: "Viral infection of the throat, nose, and sinuses.", recommendedAction: "Supportive care. Consult if lasting >2 weeks.", urgencyLevel: "low" },
    { disease: "Asthma", description: "Chronic airway inflammation causing recurrent cough and wheeze.", recommendedAction: "Spirometry and physician review. Inhaler therapy may be needed.", urgencyLevel: "medium" },
    { disease: "Pneumonia", description: "Infection of lung tissue, bacterial or viral.", recommendedAction: "Chest X-ray and urgent medical review. Antibiotics if bacterial.", urgencyLevel: "high" },
  ],
  "fatigue": [
    { disease: "Anaemia", description: "Low haemoglobin impairing oxygen delivery to tissues.", recommendedAction: "Full blood count and iron studies. Iron or B12 supplementation may be needed.", urgencyLevel: "medium" },
    { disease: "Hypothyroidism", description: "Underactive thyroid causing widespread metabolic slowing.", recommendedAction: "Thyroid function tests (TSH, T4). May require thyroxine replacement.", urgencyLevel: "low" },
    { disease: "Type 2 Diabetes", description: "Insufficient insulin action causing high blood glucose and fatigue.", recommendedAction: "Fasting glucose and HbA1c testing. Lifestyle modification and medical review.", urgencyLevel: "medium" },
  ],
};

router.post("/symptoms/predict", async (req, res) => {
  try {
    const { symptoms, currentMedications, patientAge } = req.body;

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      res.status(400).json({ error: "validation_error", message: "At least one symptom required" });
      return;
    }

    const baseUrl = process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"];
    const apiKey = process.env["AI_INTEGRATIONS_OPENAI_API_KEY"];

    let predictions: any[] = [];
    let analysisNotes = "";

    if (baseUrl && apiKey) {
      try {
        const client = new OpenAI({ baseURL: baseUrl, apiKey });
        const prompt = `You are a clinical decision support system. Analyze the following patient symptoms and return a JSON array of probable diagnoses.

Patient symptoms: ${symptoms.join(", ")}
${currentMedications?.length ? `Current medications: ${currentMedications.join(", ")}` : ""}
${patientAge ? `Patient age: ${patientAge}` : ""}

Return ONLY a JSON array (no other text) in this exact format:
[
  {
    "disease": "Disease name",
    "confidence": 0.85,
    "description": "Brief clinical description",
    "recommendedAction": "What the patient should do",
    "urgencyLevel": "low|medium|high|emergency",
    "medicationConflicts": ["Any conflict with listed medications if applicable"]
  }
]

Limit to 4 most likely diagnoses. Confidence should be between 0 and 1. Do not provide prescriptions.`;

        const response = await client.chat.completions.create({
          model: "gpt-5-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        });

        const content = response.choices[0]?.message?.content || "[]";
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          predictions = JSON.parse(jsonMatch[0]);
          analysisNotes = "Analysis performed using AI clinical decision support.";
        }
      } catch (aiErr) {
        req.log.warn({ aiErr }, "AI prediction failed, using rule-based fallback");
      }
    }

    if (predictions.length === 0) {
      const symptomLower = symptoms.map((s: string) => s.toLowerCase());
      const matched: any[] = [];
      for (const [key, diseases] of Object.entries(SYMPTOM_MAP)) {
        if (symptomLower.some((s: string) => s.includes(key) || key.includes(s))) {
          matched.push(...diseases);
        }
      }

      if (matched.length > 0) {
        predictions = matched.slice(0, 4).map((d, i) => ({
          ...d,
          confidence: Math.max(0.5, 0.9 - i * 0.12),
          medicationConflicts: [],
        }));
        analysisNotes = "Analysis performed using clinical rule-based matching.";
      } else {
        predictions = [
          {
            disease: "Unspecified Condition",
            confidence: 0.4,
            description: "The symptoms entered did not match a specific pattern in the database. A physician review is recommended.",
            recommendedAction: "Please consult a qualified healthcare professional for a proper clinical assessment.",
            urgencyLevel: "medium",
            medicationConflicts: [],
          },
        ];
        analysisNotes = "Insufficient symptom data for high-confidence prediction.";
      }
    }

    res.json({ predictions, disclaimer: DISCLAIMER, analysisNotes });
  } catch (err) {
    req.log.error({ err }, "Symptom prediction failed");
    res.status(500).json({ error: "server_error", message: "Symptom prediction failed" });
  }
});

export default router;
