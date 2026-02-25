import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import { openai } from "./replit_integrations/image/client"; 
import crypto from "crypto";
import { db } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

const upload = multer({ storage: multer.memoryStorage() });

async function seedDatabase() {
  const existing = await storage.getDatasets();
  if (existing.length === 0) {
    const dataset = await storage.createDataset({
      name: "Global Sales 2024",
      description: "Comprehensive sales data across regions.",
      ownerWallet: "0x123...abc",
      storageId: "ipfs://Qm123...",
      fileHash: "hash123",
      metadataHash: "meta123",
      aiReportHash: "ai123",
      trustScore: 85.5,
      completenessScore: 90,
      freshnessScore: 75,
      consistencyScore: 88,
      schemaScore: 95,
      verificationScore: 100,
      version: 1
    });

    await storage.createAnalysis({
      datasetId: dataset.id,
      summary: "Sales have grown by 15% Q/Q.",
      columnStats: { Revenue: "Avg $1500", Region: "5 distinct" },
      missingValues: { Revenue: 0 },
      correlations: { Revenue_Cost: 0.8 },
      anomalies: { "Row 15": "Outlier revenue" }
    });

    await storage.createInsight({
      datasetId: dataset.id,
      text: "Significant upward trend in the APAC region.",
      confidence: 0.92
    });
    
    await db.insert(schema.verificationEvents).values({
      datasetId: dataset.id,
      eventType: "UPLOAD",
      metadata: { filename: "sales_2024.csv" }
    });
    
    await db.insert(schema.verificationEvents).values({
      datasetId: dataset.id,
      eventType: "VERIFIED",
      metadata: { txHash: "0xabc123" }
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.datasets.list.path, async (req, res) => {
    const datasets = await storage.getDatasets();
    res.json(datasets);
  });

  app.get(api.datasets.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const dataset = await storage.getDataset(id);
    if (!dataset) return res.status(404).json({ message: "Not found" });
    res.json(dataset);
  });

  app.post(api.datasets.upload.path, upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      const { name, description, ownerWallet } = req.body;
      
      if (!file || !name || !ownerWallet) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
      
      const dataset = await storage.createDataset({
        name,
        description,
        ownerWallet,
        storageId: `mock-ipfs://${crypto.randomBytes(16).toString('hex')}`,
        fileHash,
        metadataHash: crypto.randomBytes(32).toString('hex'),
        aiReportHash: "pending",
        trustScore: 75, 
        completenessScore: 80,
        freshnessScore: 70,
        consistencyScore: 75,
        schemaScore: 85,
        verificationScore: 0,
        version: 1
      });

      await db.insert(schema.verificationEvents).values({
        datasetId: dataset.id,
        eventType: "UPLOAD",
        metadata: { filename: file.originalname }
      });

      res.status(201).json(dataset);
    } catch (err) {
      res.status(500).json({ message: "Upload failed" });
    }
  });

  app.post(api.datasets.analyze.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const dataset = await storage.getDataset(id);
    if (!dataset) return res.status(404).json({ message: "Not found" });

    const analysis = await storage.createAnalysis({
      datasetId: id,
      summary: "Automated AI Analysis complete.",
      columnStats: { "Data": "Analyzed" },
      missingValues: {},
      correlations: {},
      anomalies: {}
    });

    const insight = await storage.createInsight({
      datasetId: id,
      text: "The data shows consistent patterns with minor anomalies.",
      confidence: 0.88
    });

    await db.insert(schema.aiMemoryLedger).values({
      datasetId: id,
      insightText: insight.text,
      insightHash: crypto.createHash('sha256').update(insight.text).digest('hex'),
      datasetVersion: dataset.version,
      verified: true
    });

    await db.insert(schema.verificationEvents).values({
      datasetId: id,
      eventType: "ANALYZED",
      metadata: { analysisId: analysis.id }
    });
    
    res.json({ analysis, insights: [insight] });
  });

  app.get(api.datasets.report.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const analysis = await storage.getAnalysis(id);
    const insights = await storage.getInsights(id);
    res.json({ analysis, insights });
  });

  app.get(api.datasets.timeline.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const events = await db.select().from(schema.verificationEvents).where(eq(schema.verificationEvents.datasetId, id));
    res.json(events);
  });

  app.get(api.datasets.ledger.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const ledger = await db.select().from(schema.aiMemoryLedger).where(eq(schema.aiMemoryLedger.datasetId, id));
    res.json(ledger);
  });

  app.get(api.datasets.trust.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const dataset = await storage.getDataset(id);
    if (!dataset) return res.status(404).json({ message: "Not found" });
    res.json({
      completeness: dataset.completenessScore,
      freshness: dataset.freshnessScore,
      consistency: dataset.consistencyScore,
      schema: dataset.schemaScore,
      verification: dataset.verificationScore,
      total: dataset.trustScore
    });
  });

  app.get(api.datasets.versions.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const versions = await db.select().from(schema.datasetVersions).where(eq(schema.datasetVersions.datasetId, id));
    res.json(versions);
  });

  app.get(api.datasets.events.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const events = await db.select().from(schema.systemEvents).where(eq(schema.systemEvents.datasetId, id));
    res.json(events);
  });

  app.post(api.copilot.query.path, async (req, res) => {
    try {
      const input = api.copilot.query.input.parse(req.body);
      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: "You are a data copilot." },
          { role: "user", content: `Regarding dataset ${input.datasetId}: ${input.query}` }
        ]
      });
      res.json({ answer: response.choices[0].message.content });
    } catch(err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      res.status(500).json({ message: "Copilot error" });
    }
  });

  app.post(api.blockchain.register.path, async (req, res) => {
    const input = api.blockchain.register.input.parse(req.body);
    const txHash = `0x${crypto.randomBytes(32).toString('hex')}`;
    
    await db.insert(schema.verificationEvents).values({
      datasetId: input.datasetId,
      eventType: "VERIFIED",
      metadata: { txHash }
    });

    res.json({ txHash, status: "success" });
  });

  app.get(api.blockchain.verify.path, async (req, res) => {
    res.json({ verified: true, timestamp: new Date().toISOString() });
  });

  await seedDatabase();
  return httpServer;
}
