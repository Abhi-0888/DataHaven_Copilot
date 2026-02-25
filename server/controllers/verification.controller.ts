import type { Request, Response } from "express";
import { verificationService } from "../services/verification.service";
import { timelineService } from "../services/timeline.service";
import { datasetService } from "../services/dataset.service";

export const verificationController = {
    async register(req: Request, res: Response) {
        try {
            const { datasetId } = req.body;
            if (!datasetId) return res.status(400).json({ message: "datasetId is required" });
            const result = await verificationService.register(Number(datasetId));
            res.json(result);
        } catch (err: any) {
            res.status(500).json({ message: err.message || "Registration failed" });
        }
    },

    async verify(req: Request, res: Response) {
        const { hash } = req.params;
        const result = await verificationService.verify(hash);
        res.json(result);
    },

    async getTimeline(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const timeline = await timelineService.getTimeline(id);
        res.json(timeline);
    },

    async getStorageProof(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const dataset = await datasetService.getById(id);
        if (!dataset) return res.status(404).json({ message: "Dataset not found" });
        const proof = verificationService.generateStorageProof(id, dataset.fileHash);
        res.json(proof);
    },
};
