import { Router } from "express";
import { db } from "../data/inMemoryStore";

const router = Router();

router.get("/drugs", (req, res) => {
  const { search, limit } = req.query;
  const drugs = db.drugs.findAll(
    typeof search === "string" ? search : undefined,
    limit ? Number(limit) : 50
  );
  res.json(drugs);
});

router.get("/drugs/:id", (req, res) => {
  const drug = db.drugs.findById(req.params.id);
  if (!drug) {
    res.status(404).json({ error: "not_found", message: "Drug not found" });
    return;
  }
  res.json(drug);
});

export default router;
