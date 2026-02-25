import { Router } from "express";
import { eventsController } from "../controllers/events.controller";
import { verificationController } from "../controllers/verification.controller";

const router = Router({ mergeParams: true });

// GET /api/datasets/:id/events
router.get("/events", eventsController.getEvents);
// GET /api/datasets/:id/versions
router.get("/versions", eventsController.getVersions);
// GET /api/datasets/:id/timeline
router.get("/timeline", verificationController.getTimeline);
// GET /api/datasets/:id/proof
router.get("/proof", verificationController.getStorageProof);

export default router;
