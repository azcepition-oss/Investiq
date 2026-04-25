import axios from 'axios';
import { MarketData } from '../types';
import { consumeAiCredit, getDailyAiLimit, getRemainingAiCredits } from '../lib/aiCredits';

const api = axios.create({
  baseURL: '/api',
});

export const getMarketData = async (ticker: string): Promise<MarketData> => {
  const response = await api.get(`/market-data/${ticker}`);
  return response.data;
};

export const getAiCreditStatus = () => ({
  remaining: getRemainingAiCredits(),
  limit: getDailyAiLimit(),
});

export const chatWithAI = async (messages: { role: string; content: string }[]) => {
  consumeAiCredit();
  const response = await api.post('/chat', { messages });
  return response.data.text;
};

export const getAIExplanation = async (data: {
  ticker: string;
  stockName: string;
  priceChange: number;
  newsSummaries: string;
  question?: string;
}) => {
  consumeAiCredit();
  const response = await api.post('/explain', data);
  return response.data.text;
};

export default api;
