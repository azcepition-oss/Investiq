import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Financial Data Proxy (Example)
  app.get("/api/market-data/:ticker", async (req, res) => {
    // In a real app, you'd call Polygon.io or similar here using process.env.FINANCIAL_API_KEY
    // For now, we'll return mock data if the key is missing to keep the app functional
    res.json({
      ticker: req.params.ticker,
      price: 150.25 + Math.random() * 10,
      change: (Math.random() - 0.5) * 5,
      volume: "1.2M",
      marketCap: "2.5T"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
