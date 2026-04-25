import { createModel, fetchMarketData, getSanitizedKey, json, SchemaType } from "./_shared.js";

export const handler = async (event) => {
  const key = getSanitizedKey();
  if (!key) {
    return json(503, { error: "GEMINI_API_KEY is missing." });
  }

  try {
    const { messages = [] } = JSON.parse(event.body || "{}");
    const model = createModel(
      key,
      "You are InvestIQ's Market Mentor, a world-class financial strategist. Use the getMarketData tool for prices. Be professional, sophisticated, and relate finance to real-world scenarios."
    );

    let history = messages.slice(0, -1);
    const firstUserIndex = history.findIndex((m) => m.role === "user");
    history = firstUserIndex !== -1 ? history.slice(firstUserIndex) : [];

    const formattedHistory = history.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history: formattedHistory,
      tools: [
        {
          functionDeclarations: [
            {
              name: "getMarketData",
              description: "Get real-time market data for a stock ticker.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  ticker: { type: SchemaType.STRING, description: "Stock ticker (e.g. AAPL)" },
                },
                required: ["ticker"],
              },
            },
          ],
        },
      ],
    });

    const lastMessage = messages[messages.length - 1]?.content || "";
    let result = await chat.sendMessage(lastMessage);
    let response = result.response;

    const call = response.functionCalls()?.[0];
    if (call?.name === "getMarketData") {
      const data = fetchMarketData(call.args?.ticker);
      result = await chat.sendMessage([
        {
          functionResponse: {
            name: "getMarketData",
            response: { result: data },
          },
        },
      ]);
      response = result.response;
    }

    return json(200, { text: response.text() });
  } catch (error) {
    const message = error?.message || "";
    const isKeyError =
      message.toLowerCase().includes("key not valid") || message.includes("400") || message.includes("401");

    return json(isKeyError ? 401 : 500, {
      error: isKeyError ? "The Gemini API key is invalid. Re-check the Netlify environment variable GEMINI_API_KEY." : "AI analysis failed.",
      details: message,
    });
  }
};

