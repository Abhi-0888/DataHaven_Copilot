import { db } from "../db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

export type DatasetVersion = typeof schema.datasetVersions.$inferSelect;

export const versionRepo = {
    async getByDataset(datasetId: number): Promise<DatasetVersion[]> {
        return db
            .select()
            .from(schema.datasetVersions)
            .where(eq(schema.datasetVersions.datasetId, datasetId));
    },

    async create(data: {
        datasetId: number;
        versionNumber: number;
        parentVersion?: number;
        fileHash: string;
    }): Promise<DatasetVersion> {
        const [row] = await db
            .insert(schema.datasetVersions)
            .values(data)
            .returning();
        return row;
    },
};
