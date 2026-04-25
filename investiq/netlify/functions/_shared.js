import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export const json = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

export const getSanitizedKey = () => {
  let key = process.env.GEMINI_API_KEY;
  const placeholders = ["MY_GEMINI_API_KEY", "YOUR_API_KEY", "INSERT_KEY_HERE"];

  if (!key || placeholders.some((p) => key.includes(p))) {
    for (const envValue of Object.values(process.env)) {
      if (typeof envValue === "string" && envValue.startsWith("AIza") && envValue.length >= 30) {
        key = envValue;
        break;
      }
    }
  }

  if (!key) return null;

  const cleaned = key
    .trim()
    .replace(/^(GEMINI_API_KEY|api_key|key)[:=]\s*/i, "")
    .replace(/[\s\u200B-\u200D\uFEFF]/g, "");

  return cleaned || null;
};

export const fetchMarketData = (ticker = "AAPL") => ({
  ticker: ticker.toUpperCase(),
  price: 150.25 + Math.random() * 10,
  change: (Math.random() - 0.5) * 5,
  volume: "1.2M",
  marketCap: "2.5T",
});

export const createModel = (key, systemInstruction) => {
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    ...(systemInstruction ? { systemInstruction } : {}),
  });
};

export { SchemaType };

