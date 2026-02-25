import { db } from "./db";
import {
  datasets, datasetAnalysis, insights, verificationLogs,
  type Dataset, type InsertDataset,
  type DatasetAnalysis, type InsertDatasetAnalysis,
  type Insight, type InsertInsight,
  type VerificationLog, type InsertVerificationLog
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getDatasets(): Promise<Dataset[]>;
  getDataset(id: number): Promise<Dataset | undefined>;
  createDataset(dataset: InsertDataset): Promise<Dataset>;
  
  createAnalysis(analysis: InsertDatasetAnalysis): Promise<DatasetAnalysis>;
  getAnalysis(datasetId: number): Promise<DatasetAnalysis | undefined>;
  
  createInsight(insight: InsertInsight): Promise<Insight>;
  getInsights(datasetId: number): Promise<Insight[]>;
  
  createVerificationLog(log: InsertVerificationLog): Promise<VerificationLog>;
  getVerificationLogs(datasetId: number): Promise<VerificationLog[]>;
}

export class DatabaseStorage implements IStorage {
  async getDatasets(): Promise<Dataset[]> {
    return await db.select().from(datasets);
  }

  async getDataset(id: number): Promise<Dataset | undefined> {
    const [dataset] = await db.select().from(datasets).where(eq(datasets.id, id));
    return dataset;
  }

  async createDataset(dataset: InsertDataset): Promise<Dataset> {
    const [created] = await db.insert(datasets).values(dataset).returning();
    return created;
  }

  async createAnalysis(analysis: InsertDatasetAnalysis): Promise<DatasetAnalysis> {
    const [created] = await db.insert(datasetAnalysis).values(analysis).returning();
    return created;
  }

  async getAnalysis(datasetId: number): Promise<DatasetAnalysis | undefined> {
    const [analysis] = await db.select().from(datasetAnalysis).where(eq(datasetAnalysis.datasetId, datasetId));
    return analysis;
  }

  async createInsight(insight: InsertInsight): Promise<Insight> {
    const [created] = await db.insert(insights).values(insight).returning();
    return created;
  }

  async getInsights(datasetId: number): Promise<Insight[]> {
    return await db.select().from(insights).where(eq(insights.datasetId, datasetId));
  }

  async createVerificationLog(log: InsertVerificationLog): Promise<VerificationLog> {
    const [created] = await db.insert(verificationLogs).values(log).returning();
    return created;
  }

  async getVerificationLogs(datasetId: number): Promise<VerificationLog[]> {
    return await db.select().from(verificationLogs).where(eq(verificationLogs.datasetId, datasetId));
  }
}

export const storage = new DatabaseStorage();
