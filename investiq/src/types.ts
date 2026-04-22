export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  buyingPower: number;
  totalPortfolioValue: number;
  createdAt: number;
}

export interface Holding {
  ticker: string;
  name: string;
  shares: number;
  averagePrice: number;
  currentPrice: number;
}

export interface Transaction {
  id: string;
  userId: string;
  ticker: string;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
  timestamp: number;
}

export interface LearningCard {
  id: string;
  title: string;
  content: string;
  reward: number;
}

export interface MarketData {
  ticker: string;
  price: number;
  change: number;
  volume: string;
  marketCap: string;
}
