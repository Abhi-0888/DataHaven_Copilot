import { eventRepo, type VerificationEvent } from "../repositories/event.repo";

export const timelineService = {
    async addEvent(
        datasetId: number,
        eventType: string,
        metadata?: Record<string, any>
    ): Promise<VerificationEvent> {
        return eventRepo.createVerificationEvent({ datasetId, eventType, metadata });
    },

    async getTimeline(datasetId: number): Promise<VerificationEvent[]> {
        return eventRepo.getVerificationEvents(datasetId);
    },
};
