import type { Request, Response } from "express";
import { ledgerService } from "../services/ledger.service";

export const ledgerController = {
    async get(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const ledger = await ledgerService.getLedger(id);
        res.json(ledger);
    },
};
