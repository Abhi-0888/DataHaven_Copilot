import { Router } from "express";
import multer from "multer";
import { datasetController } from "../controllers/dataset.controller";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/", datasetController.list);
router.get("/:id", datasetController.get);
router.post("/upload", upload.single("file"), datasetController.upload);
router.post("/:id/analyze", datasetController.analyze);
router.get("/:id/report", datasetController.report);

export default router;
