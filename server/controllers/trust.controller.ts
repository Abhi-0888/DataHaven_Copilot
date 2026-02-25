import type { Request, Response } from "express";
import { trustService } from "../services/trust.service";

export const trustController = {
    async get(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const breakdown = await trustService.getBreakdown(id);
        if (!breakdown) return res.status(404).json({ message: "Dataset not found" });
        res.json(breakdown);
    },
};
