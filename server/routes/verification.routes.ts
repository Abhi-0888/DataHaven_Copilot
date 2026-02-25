import { Router } from "express";
import { verificationController } from "../controllers/verification.controller";

const router = Router();

// POST /api/blockchain/register
router.post("/register", verificationController.register);
// GET /api/blockchain/verify/:hash
router.get("/verify/:hash", verificationController.verify);

export default router;
