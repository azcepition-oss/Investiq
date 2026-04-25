import { createModel, getSanitizedKey, json } from "./_shared.js";

export const handler = async (event) => {
  const key = getSanitizedKey();
  if (!key) {
    return json(503, { error: "GEMINI_API_KEY missing" });
  }

  try {
    const { ticker, stockName, priceChange, newsSummaries, question } = JSON.parse(event.body || "{}");
    const model = createModel(key);
    const prompt = `You are a financial mentor. Stock: ${stockName} (${ticker}). Change: ${priceChange}%. News: ${newsSummaries}. Question: ${question || "Explain why this happened."} Keep it under 3 sentences. Tone: Pro & direct. Format: [Explanation] SOURCE: [Title](URL)`;
    const result = await model.generateContent(prompt);

    return json(200, { text: result.response.text() });
  } catch (error) {
    const message = error?.message || "";
    const isKeyError =
      message.toLowerCase().includes("key not valid") || message.includes("400") || message.includes("401");

    return json(isKeyError ? 401 : 500, {
      error: isKeyError ? "The Gemini API key is invalid. Re-check the Netlify environment variable GEMINI_API_KEY." : "Explanation failed.",
      details: message,
    });
  }
};

