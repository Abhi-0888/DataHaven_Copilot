import { db } from "../db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

export type VerificationEvent = typeof schema.verificationEvents.$inferSelect;
export type SystemEvent = typeof schema.systemEvents.$inferSelect;

export const eventRepo = {
    async getVerificationEvents(datasetId: number): Promise<VerificationEvent[]> {
        return db
            .select()
            .from(schema.verificationEvents)
            .where(eq(schema.verificationEvents.datasetId, datasetId));
    },

    async createVerificationEvent(data: {
        datasetId: number;
        eventType: string;
        metadata?: Record<string, any>;
    }): Promise<VerificationEvent> {
        const [row] = await db
            .insert(schema.verificationEvents)
            .values(data)
            .returning();
        return row;
    },

    async getSystemEvents(datasetId: number): Promise<SystemEvent[]> {
        return db
            .select()
            .from(schema.systemEvents)
            .where(eq(schema.systemEvents.datasetId, datasetId));
    },

    async createSystemEvent(data: {
        datasetId: number;
        eventType: string;
        actor: string;
        metadata?: Record<string, any>;
    }): Promise<SystemEvent> {
        const [row] = await db
            .insert(schema.systemEvents)
            .values(data)
            .returning();
        return row;
    },
};
