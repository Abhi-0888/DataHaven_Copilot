import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { requestLogger } from "./middleware/requestLogger";
import { errorHandler } from "./middleware/errorHandler";
import { serveStatic } from "./static";

// Route modules
import datasetRoutes from "./routes/dataset.routes";
import verificationRoutes from "./routes/verification.routes";
import ledgerRoutes from "./routes/ledger.routes";
import trustRoutes from "./routes/trust.routes";
import eventRoutes from "./routes/events.routes";

// Services
import { datasetService } from "./services/dataset.service";
import { analysisService } from "./services/analysis.service";

// Copilot (OpenAI)
import { openai } from "./config/openai";
import { z } from "zod";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

const app = express();
const httpServer = createServer(app);

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(requestLogger);

// ─── Dataset routes ──────────────────────────────────────────────────────────
app.use("/api/datasets", datasetRoutes);

// ─── Per-dataset sub-routes ───────────────────────────────────────────────────
app.use("/api/datasets/:id", ledgerRoutes);
app.use("/api/datasets/:id", trustRoutes);
app.use("/api/datasets/:id", eventRoutes);

// ─── Blockchain / verification routes ─────────────────────────────────────────
app.use("/api/blockchain", verificationRoutes);

// ─── Copilot endpoint ─────────────────────────────────────────────────────────
const copilotSchema = z.object({
  datasetId: z.coerce.number(),
  query: z.string(),
});

app.post("/api/copilot/query", async (req: Request, res: Response) => {
  try {
    const input = copilotSchema.parse(req.body);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are DataHeaven Copilot, an expert AI assistant for data analysis and intelligence." },
        { role: "user", content: `Regarding dataset ${input.datasetId}: ${input.query}` },
      ],
    });
    res.json({ answer: response.choices[0].message.content });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.errors[0].message });
    }
    res.status(500).json({ message: "Copilot error" });
  }
});

// ─── Seed database ────────────────────────────────────────────────────────────
async function seedDatabase() {
  const existing = await datasetService.getAll();
  if (existing.length === 0) {
    const buf = Buffer.from("name,value\nalpha,100\nbeta,200\ngamma,300");
    const dataset = await datasetService.create({
      name: "Global Sales 2024",
      description: "Comprehensive sales data across regions for demo purposes.",
      ownerWallet: "0x123...abc",
      fileBuffer: buf,
      originalname: "sales_2024.csv",
    });

    await analysisService.analyze(dataset.id);
    console.log("[seed] Demo dataset created:", dataset.id);
  }
}

// ─── Error handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Vite / static ────────────────────────────────────────────────────────────
(async () => {
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  await seedDatabase();

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen({ port, host: "0.0.0.0" }, () => {
    const formattedTime = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    console.log(`${formattedTime} [express] DataHeaven Copilot serving on port ${port}`);
  });
})();
