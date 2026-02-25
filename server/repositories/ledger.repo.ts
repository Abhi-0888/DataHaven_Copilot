import { db } from "../db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

export type LedgerEntry = typeof schema.aiMemoryLedger.$inferSelect;

export const ledgerRepo = {
    async getByDataset(datasetId: number): Promise<LedgerEntry[]> {
        return db
            .select()
            .from(schema.aiMemoryLedger)
            .where(eq(schema.aiMemoryLedger.datasetId, datasetId));
    },

    async create(data: {
        datasetId: number;
        insightText: string;
        insightHash: string;
        datasetVersion: number;
        verified: boolean;
    }): Promise<LedgerEntry> {
        const [row] = await db
            .insert(schema.aiMemoryLedger)
            .values(data)
            .returning();
        return row;
    },
};
