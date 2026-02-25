import { pgTable, text, serial, integer, timestamp, json, doublePrecision, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const datasets = pgTable("datasets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ownerWallet: text("ownerWallet").notNull(),
  storageId: text("storageId").notNull(),
  fileHash: text("fileHash").notNull(),
  metadataHash: text("metadataHash").notNull(),
  aiReportHash: text("aiReportHash").notNull(),
  trustScore: doublePrecision("trustScore").notNull(),
  version: integer("version").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const datasetAnalysis = pgTable("dataset_analysis", {
  id: serial("id").primaryKey(),
  datasetId: integer("datasetId").notNull().references(() => datasets.id),
  summary: text("summary").notNull(),
  columnStats: json("columnStats").notNull(),
  missingValues: json("missingValues").notNull(),
  correlations: json("correlations").notNull(),
  anomalies: json("anomalies").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insights = pgTable("insights", {
  id: serial("id").primaryKey(),
  datasetId: integer("datasetId").notNull().references(() => datasets.id),
  text: text("text").notNull(),
  confidence: doublePrecision("confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const verificationLogs = pgTable("verification_logs", {
  id: serial("id").primaryKey(),
  datasetId: integer("datasetId").notNull().references(() => datasets.id),
  wallet: text("wallet").notNull(),
  result: boolean("result").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas
export const insertDatasetSchema = createInsertSchema(datasets).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDatasetAnalysisSchema = createInsertSchema(datasetAnalysis).omit({ id: true, createdAt: true });
export const insertInsightSchema = createInsertSchema(insights).omit({ id: true, createdAt: true });
export const insertVerificationLogSchema = createInsertSchema(verificationLogs).omit({ id: true, createdAt: true });

// Types
export type Dataset = typeof datasets.$inferSelect;
export type InsertDataset = z.infer<typeof insertDatasetSchema>;

export type DatasetAnalysis = typeof datasetAnalysis.$inferSelect;
export type InsertDatasetAnalysis = z.infer<typeof insertDatasetAnalysisSchema>;

export type Insight = typeof insights.$inferSelect;
export type InsertInsight = z.infer<typeof insertInsightSchema>;

export type VerificationLog = typeof verificationLogs.$inferSelect;
export type InsertVerificationLog = z.infer<typeof insertVerificationLogSchema>;
