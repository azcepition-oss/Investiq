import axios from 'axios';
import { MarketData } from '../types';

const api = axios.create({
  baseURL: '/api',
});

export const getMarketData = async (ticker: string): Promise<MarketData> => {
  const response = await api.get(`/market-data/${ticker}`);
  return response.data;
};

export const chatWithAI = async (messages: { role: string; content: string }[]) => {
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
  const response = await api.post('/explain', data);
  return response.data.text;
};

export default api;
