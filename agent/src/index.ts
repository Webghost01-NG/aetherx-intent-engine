import express, { Request, Response } from "express";
import cors from "cors";
import { intentEngine } from "./intentEngine";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get("/health", async (req: Request, res: Response) => {
  const telemetry = await intentEngine.getLiveTelemetry();
  res.json({
    status: "ok",
    service: "AetherX AI Intent Agent Engine",
    language: "TypeScript",
    telemetry,
    timestamp: new Date().toISOString()
  });
});

// Parse Natural Language User Intent
app.post("/api/ai/intent", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Invalid prompt string provided" });
    }
    const payload = await intentEngine.generateExecutionPayload(prompt);
    res.json({
      success: true,
      message: "AI Agent successfully parsed intent & signed execution proof",
      payload
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Stream AI Logs
app.get("/api/ai/logs", (req: Request, res: Response) => {
  res.json({
    logs: intentEngine.getLogs()
  });
});

app.listen(PORT, () => {
  console.log(`⚡ AetherX Pure TypeScript AI Agent running on http://localhost:${PORT}`);
});
