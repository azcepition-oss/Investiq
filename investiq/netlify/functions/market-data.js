import { fetchMarketData, json } from "./_shared.js";

export const handler = async (event) => {
  const pathParts = (event.path || "").split("/").filter(Boolean);
  const ticker = pathParts[pathParts.length - 1] || "AAPL";
  return json(200, fetchMarketData(ticker));
};

