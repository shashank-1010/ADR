import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import drugsRouter from "./drugs.js";
import interactionsRouter from "./interactions.js";
import symptomsRouter from "./symptoms.js";
import adrReportsRouter from "./adrReports.js";
import chatbotRouter from "./chatbot.js";
import dashboardRouter from "./dashboard.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(drugsRouter);
router.use(interactionsRouter);
router.use(symptomsRouter);
router.use(adrReportsRouter);
router.use(chatbotRouter);
router.use(dashboardRouter);

export default router;
