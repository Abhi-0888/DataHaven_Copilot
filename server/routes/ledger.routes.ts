import { Router } from "express";
import { ledgerController } from "../controllers/ledger.controller";

const router = Router({ mergeParams: true });

// GET /api/datasets/:id/ledger
router.get("/", ledgerController.get);

export default router;
