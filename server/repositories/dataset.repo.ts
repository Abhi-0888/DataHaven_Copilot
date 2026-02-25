import { db } from "../db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import type { InsertDataset, Dataset } from "@shared/schema";

export const datasetRepo = {
    async getAll(): Promise<Dataset[]> {
        return db.select().from(schema.datasets);
    },

    async getById(id: number): Promise<Dataset | undefined> {
        const [row] = await db
            .select()
            .from(schema.datasets)
            .where(eq(schema.datasets.id, id));
        return row;
    },

    async create(data: InsertDataset): Promise<Dataset> {
        const [row] = await db
            .insert(schema.datasets)
            .values({
                ...data,
                completenessScore: data.completenessScore ?? 0,
                freshnessScore: data.freshnessScore ?? 0,
                consistencyScore: data.consistencyScore ?? 0,
                schemaScore: data.schemaScore ?? 0,
                verificationScore: data.verificationScore ?? 0,
            })
            .returning();
        return row;
    },

    async update(id: number, data: Partial<InsertDataset>): Promise<Dataset> {
        const [row] = await db
            .update(schema.datasets)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(schema.datasets.id, id))
            .returning();
        return row;
    },
};
