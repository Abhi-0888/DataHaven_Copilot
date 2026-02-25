import type { Request, Response } from "express";
import { datasetService } from "../services/dataset.service";
import { analysisService } from "../services/analysis.service";

export const datasetController = {
    async list(req: Request, res: Response) {
        const datasets = await datasetService.getAll();
        res.json(datasets);
    },

    async get(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const dataset = await datasetService.getById(id);
        if (!dataset) return res.status(404).json({ message: "Dataset not found" });
        res.json(dataset);
    },

    async upload(req: Request, res: Response) {
        try {
            const file = req.file;
            const { name, description, ownerWallet } = req.body;

            if (!file || !name || !ownerWallet) {
                return res.status(400).json({ message: "Missing required fields: file, name, ownerWallet" });
            }

            // Validate file type
            const allowedTypes = ["text/csv", "application/json", "text/plain", "application/vnd.ms-excel", "application/octet-stream"];
            const ext = file.originalname.split(".").pop()?.toLowerCase();
            const allowedExts = ["csv", "json", "txt", "xlsx", "parquet"];
            if (!allowedExts.includes(ext || "")) {
                return res.status(400).json({ message: "Invalid file type. Allowed: CSV, JSON, TXT, XLSX, Parquet" });
            }

            const dataset = await datasetService.create({
                name,
                description,
                ownerWallet,
                fileBuffer: file.buffer,
                originalname: file.originalname,
            });

            res.status(201).json(dataset);
        } catch (err: any) {
            res.status(500).json({ message: err.message || "Upload failed" });
        }
    },

    async analyze(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const result = await analysisService.analyze(id);
            res.json(result);
        } catch (err: any) {
            if (err.message === "Dataset not found") {
                return res.status(404).json({ message: "Dataset not found" });
            }
            res.status(500).json({ message: err.message || "Analysis failed" });
        }
    },

    async report(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const report = await analysisService.getReport(id);
        res.json(report);
    },
};
