import { Router } from "express";
import { db } from "../data/inMemoryStore";

const router = Router();

router.get("/dashboard/stats", (_req, res) => {
  const counts = db.reports.countBySeverity();
  res.json({
    totalDrugs: db.drugs.findAll().length,
    totalReports: counts.mild + counts.moderate + counts.severe,
    reportsThisMonth: db.reports.recentMonth(),
    severeReports: counts.severe,
    dangerousInteractionsChecked: 142,
    symptomsAnalyzed: 87,
    severityBreakdown: counts,
    topReportedDrugs: db.reports.topDrugs(5),
  });
});

router.get("/dashboard/recent-reports", (_req, res) => {
  res.json(db.reports.findAll(5));
});

export default router;
