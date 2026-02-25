import { eventRepo, type SystemEvent } from "../repositories/event.repo";

export const eventService = {
    async logEvent(params: {
        datasetId: number;
        eventType: string;
        actor: string;
        metadata?: Record<string, any>;
    }): Promise<SystemEvent> {
        return eventRepo.createSystemEvent(params);
    },

    async fetchEvents(datasetId: number): Promise<SystemEvent[]> {
        return eventRepo.getSystemEvents(datasetId);
    },
};
