import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const SYSTEM_PROMPT = `You are ADR Shield, an AI-powered pharmacovigilance assistant. Your role is to:
- Answer questions about drug safety, adverse drug reactions, and drug interactions
- Provide general guidance on medication use and safety
- Help users understand warning signs of adverse drug reactions
- Explain medical terminology in plain language

IMPORTANT RULES:
- Never prescribe medications or recommend specific treatments
- Always remind users to consult qualified healthcare professionals
- If asked about an emergency, direct users to call emergency services immediately
- Provide evidence-based information only
- Be clear, professional, and concise
- Always end responses about health concerns with: "Please consult a qualified healthcare professional for personalised medical advice."

You are for advisory purposes only. Do not provide medical prescriptions or diagnoses.`;

router.post("/chatbot/message", async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "validation_error", message: "Message is required" });
      return;
    }

    const baseUrl = process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"];
    const apiKey = process.env["AI_INTEGRATIONS_OPENAI_API_KEY"];

    if (!baseUrl || !apiKey) {
      res.json({
        message: "I am the Emerk assistant. Unfortunately the AI service is not currently configured. For drug safety information, please consult a pharmacist or physician. This system is for advisory purposes only.",
        disclaimer: "This system is for advisory purposes only. Always consult a qualified healthcare professional.",
      });
      return;
    }

    const client = new OpenAI({ baseURL: baseUrl, apiKey });

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory.map((h: { role: "user" | "assistant"; content: string }) => ({
        role: h.role,
        content: h.content,
      })),
      { role: "user", content: message },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages,
      temperature: 0.4,
      max_tokens: 600,
    });

    const responseMessage = completion.choices[0]?.message?.content || "I was unable to process your query. Please try again.";

    res.json({
      message: responseMessage,
      sources: ["ADR Shield Clinical Database", "WHO Pharmacovigilance Guidelines"],
      disclaimer: "This system is for advisory purposes only. Always consult a qualified healthcare professional.",
    });
  } catch (err) {
    req.log.error({ err }, "Chatbot query failed");
    res.status(500).json({ error: "server_error", message: "Failed to process chat message" });
  }
});

export default router;
