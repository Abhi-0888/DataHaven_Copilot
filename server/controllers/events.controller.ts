import type { Request, Response } from "express";
import { eventService } from "../services/event.service";
import { versionRepo } from "../repositories/version.repo";

export const eventsController = {
    async getEvents(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const events = await eventService.fetchEvents(id);
        res.json(events);
    },

    async getVersions(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const versions = await versionRepo.getByDataset(id);
        res.json(versions);
    },
};
