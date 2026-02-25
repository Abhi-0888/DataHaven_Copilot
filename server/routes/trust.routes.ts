import { Router } from "express";
import { trustController } from "../controllers/trust.controller";

const router = Router({ mergeParams: true });

// GET /api/datasets/:id/trust
router.get("/", trustController.get);

export default router;
