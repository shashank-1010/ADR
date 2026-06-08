import { Router } from "express";
import { db } from "../data/inMemoryStore";

const router = Router();

router.get("/adr-reports", (req, res) => {
  const { limit, severity } = req.query;
  const reports = db.reports.findAll(
    limit ? Number(limit) : 20,
    typeof severity === "string" ? severity : undefined
  );
  res.json(reports);
});

router.post("/adr-reports", (req, res) => {
  const { drugName, reaction, severity, patientAge, description, outcome } = req.body;
  if (!drugName || !reaction || !severity || !description) {
    res.status(400).json({
      error: "validation_error",
      message: "drugName, reaction, severity, and description are required",
    });
    return;
  }
  const report = db.reports.create({ drugName, reaction, severity, patientAge, description, outcome });
  res.status(201).json(report);
});

export default router;
