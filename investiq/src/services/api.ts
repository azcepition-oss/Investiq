import axios from 'axios';
import { MarketData } from '../types';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

const api = axios.create({
  baseURL: '/api',
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const getMarketData = async (ticker: string): Promise<MarketData> => {
  const response = await api.get(`/market-data/${ticker}`);
  return response.data;
};

const getMarketDataTool: FunctionDeclaration = {
  name: "getMarketData",
  description: "Get real-time market data for a specific stock or bond ticker (e.g., AAPL, TSLA, US10Y).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      ticker: {
        type: Type.STRING,
        description: "The stock or bond ticker symbol.",
      },
    },
    required: ["ticker"],
  },
};

export const chatWithAI = async (messages: { role: string, content: string }[]) => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are InvestIQ's Market Mentor, a financial expert for Gen-Z. You have access to real-time market data via the getMarketData tool. Use it to provide accurate, up-to-date information. Keep your tone conversational, direct, and use Gen-Z slang occasionally but stay professional. Always explain jargon simply.",
      tools: [{ functionDeclarations: [getMarketDataTool] }],
    },
  });

  const lastMessage = messages[messages.length - 1].content;
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

  // Note: The SDK handles history in a specific way, but for simplicity in this turn-based approach:
  let response = await chat.sendMessage({ message: lastMessage });

  // Handle function calls
  while (response.functionCalls) {
    const toolResults = await Promise.all(response.functionCalls.map(async (call) => {
      if (call.name === "getMarketData") {
        const data = await getMarketData(call.args.ticker as string);
        return {
          functionResponse: {
            name: call.name,
            response: { result: data }
          }
        };
      }
      return { 
        functionResponse: {
          name: call.name,
          response: { error: "Unknown function" }
        }
      };
    }));

    response = await chat.sendMessage({
      message: toolResults
    });
  }

  return response.text;
};

export const getAIExplanation = async (data: {
  ticker: string;
  stockName: string;
  priceChange: number;
  newsSummaries: string;
  question?: string;
}) => {
  const prompt = `You are an expert financial analyst mentoring a Gen-Z high school/college student. The user is looking at ${data.stockName} (${data.ticker}), which is currently ${data.priceChange >= 0 ? 'Up' : 'Down'} ${Math.abs(data.priceChange)}% today. Here is the latest news context: ${data.newsSummaries}. 
  
  Task: Answer the user's specific question: "${data.question || 'Explain exactly why this stock is going up or down today based on this real-world news.'}"
  
  Constraints:
  1. Do NOT use jargon without quickly defining it in 3 words.
  2. Keep it under 3 short sentences.
  3. Tone: Conversational, engaging, and direct. No fluff.
  4. IMPORTANT: At the end, provide a "Source" section with a relevant URL to a news article or financial site where the user can read more.
  5. Format the source as: "SOURCE: [Title](URL)"`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
};

export default api;
