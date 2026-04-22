import React, { createContext, useContext, useState, useEffect } from 'react';
import { Holding } from '../types';

interface PortfolioContextType {
  buyingPower: number;
  holdings: Holding[];
  buyStock: (ticker: string, name: string, shares: number, price: number) => void;
  sellStock: (ticker: string, shares: number, price: number) => void;
  totalValue: number;
  deductFunds: (amount: number) => boolean;
  activeLeagueId: string | null;
  setActiveLeagueId: (id: string | null) => void;
  tournamentStatus: {
    isActive: boolean;
    phase: 'idle' | 'draft' | 'sim1' | 'adjust' | 'sim2' | 'end';
    timeLeft: number;
    day: number;
    budget: number;
    holdings: Holding[];
    isReady: boolean;
    readyPlayers: string[];
    simHistory: { time: number; value: number }[];
    playerHoldings: { [id: string]: Holding[] };
    leaders: { id: string; name: string; value: number; avatar: string }[];
  };
  startTournament: () => void;
  stopTournament: () => void;
  fastForwardTournament: () => void;
  buySimStock: (ticker: string, name: string, shares: number, price: number) => void;
  sellSimStock: (ticker: string, shares: number, price: number) => void;
  collectReward: (amount: number) => void;
  setPlayerReady: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buyingPower, setBuyingPower] = useState(100000); // Start with $100k
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [activeLeagueId, setActiveLeagueId] = useState<string | null>(null);
  const [tournamentStatus, setTournamentStatus] = useState({
    isActive: false,
    phase: 'idle' as 'idle' | 'draft' | 'sim1' | 'adjust' | 'sim2' | 'end',
    timeLeft: 0,
    day: 1,
    budget: 50000, // Tournament specific budget
    holdings: [] as Holding[],
    isReady: false,
    readyPlayers: [] as string[],
    simHistory: [] as { time: number; value: number }[],
    playerHoldings: {} as { [id: string]: Holding[] },
    leaders: [
      { id: '1', name: 'AlphaTrader', value: 50000, avatar: 'https://picsum.photos/seed/1/100/100' },
      { id: '2', name: 'BullRun_04', value: 50000, avatar: 'https://picsum.photos/seed/2/100/100' },
      { id: '3', name: 'DiamondHands', value: 50000, avatar: 'https://picsum.photos/seed/3/100/100' },
    ]
  });

  // Tournament Controller
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (tournamentStatus.isActive) {
      interval = setInterval(() => {
        setTournamentStatus(prev => {
          const isEveryoneReady = prev.readyPlayers.length === prev.leaders.length && prev.leaders.length > 0;
          
          if (prev.timeLeft > 0 && !isEveryoneReady) {
            // Update leaders during simulation phases
            const isSimPhase = prev.phase === 'sim1' || prev.phase === 'sim2';
            let newLeaders = prev.leaders;
            let newHoldings = prev.holdings;
            let newDay = prev.day;

            if (isSimPhase) {
              newDay += 1;
              const volatility = 0.08; // High volatility for sim
              
              // Define a specific "market mood" for this tick to make it feel cohesive
              const marketMood = (Math.random() * 0.04) - 0.015; // Slightly bullish/bearish bias for this tick
              
              newLeaders = prev.leaders.map(l => {
                const playerHoldings = l.id === 'me' ? prev.holdings : (prev.playerHoldings[l.id] || []);
                
                // Update prices for all assets involved in this player's portfolio
                const updatedHoldings = playerHoldings.map(h => {
                  const stockVol = Math.random() * volatility;
                  const priceChange = 1 + marketMood + (Math.random() * (stockVol * 2) - stockVol);
                  return { ...h, currentPrice: h.currentPrice * priceChange };
                });

                if (l.id === 'me') {
                  newHoldings = updatedHoldings;
                }

                const newValue = (l.id === 'me' ? prev.budget : 0) + updatedHoldings.reduce((acc, h) => acc + (h.shares * h.currentPrice), 0);
                
                // Update the global playerHoldings map for NPCs
                if (l.id !== 'me') {
                  prev.playerHoldings[l.id] = updatedHoldings;
                }

                return { ...l, value: newValue };
              }).sort((a, b) => b.value - a.value);

              // Update simulation history for graphs
              const userValue = newLeaders.find(l => l.id === 'me')?.value || 0;
              const newHistory = [...prev.simHistory, { time: newDay, value: userValue }].slice(-30);
              
              return { ...prev, timeLeft: prev.timeLeft - 1, leaders: newLeaders, holdings: newHoldings, day: newDay, simHistory: newHistory };
            }

            return { ...prev, timeLeft: prev.timeLeft - 1, leaders: newLeaders, holdings: newHoldings, day: newDay };
          } else {
            // Phase Transitions
            switch (prev.phase) {
              case 'draft': return { ...prev, phase: 'sim1', timeLeft: 45 };
              case 'sim1': return { ...prev, phase: 'adjust', timeLeft: 45 };
              case 'adjust': return { ...prev, phase: 'sim2', timeLeft: 45 };
              case 'sim2': return { ...prev, phase: 'end', isActive: false };
              default: return prev;
            }
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [tournamentStatus.isActive, tournamentStatus.phase]);

  const startTournament = () => {
    setTournamentStatus({
      isActive: true,
      phase: 'draft',
      timeLeft: 120, // 2 minutes draft
      day: 0,
      budget: 50000,
      holdings: [],
      isReady: false,
      readyPlayers: [],
      simHistory: [{ time: 0, value: 50000 }],
      playerHoldings: {
        '1': [{ ticker: 'NVDA', name: 'NVIDIA', shares: 50, averagePrice: 900, currentPrice: 900 }],
        '2': [{ ticker: 'TSLA', name: 'Tesla', shares: 100, averagePrice: 170, currentPrice: 170 }],
        '3': [{ ticker: 'AAPL', name: 'Apple', shares: 150, averagePrice: 180, currentPrice: 180 }],
      },
      leaders: [
        { id: 'me', name: 'You', value: 50000, avatar: 'https://picsum.photos/seed/you/100/100' },
        { id: '1', name: 'AlphaTrader', value: 50000, avatar: 'https://picsum.photos/seed/1/100/100' },
        { id: '2', name: 'BullRun_04', value: 50000, avatar: 'https://picsum.photos/seed/2/100/100' },
        { id: '3', name: 'DiamondHands', value: 50000, avatar: 'https://picsum.photos/seed/3/100/100' },
      ]
    });
  };

  const stopTournament = () => {
    setTournamentStatus(prev => ({ ...prev, isActive: false }));
  };

  const fastForwardTournament = () => {
    setTournamentStatus(prev => ({ ...prev, timeLeft: 1 }));
  };

  const setPlayerReady = () => {
    setTournamentStatus(prev => {
      // Simulate other NPC players getting ready randomly
      const others = prev.leaders.filter(l => l.id !== 'me');
      const randomOthers = others.slice(0, Math.floor(Math.random() * others.length) + 1).map(o => o.id);
      return { 
        ...prev, 
        isReady: true,
        readyPlayers: [...new Set([...prev.readyPlayers, 'me', ...randomOthers])]
      };
    });
  };

  const buySimStock = (ticker: string, name: string, shares: number, price: number) => {
    const cost = shares * price;
    if (tournamentStatus.budget < cost) {
      alert("Not enough Sim budget!");
      return;
    }

    setTournamentStatus(prev => {
      const existing = prev.holdings.find(h => h.ticker === ticker);
      let newHoldings;
      if (existing) {
        const totalShares = existing.shares + shares;
        const totalCost = (existing.shares * existing.averagePrice) + (shares * price);
        newHoldings = prev.holdings.map(h => h.ticker === ticker 
          ? { ...h, shares: totalShares, averagePrice: totalCost / totalShares, currentPrice: price }
          : h
        );
      } else {
        newHoldings = [...prev.holdings, { ticker, name, shares, averagePrice: price, currentPrice: price }];
      }
      return { ...prev, budget: prev.budget - cost, holdings: newHoldings };
    });
  };

  const sellSimStock = (ticker: string, shares: number, price: number) => {
    const existing = tournamentStatus.holdings.find(h => h.ticker === ticker);
    if (!existing || existing.shares < shares) {
      alert("Not enough Sim shares!");
      return;
    }

    setTournamentStatus(prev => {
      const proceeds = shares * price;
      const newHoldings = prev.holdings.map(h => h.ticker === ticker 
        ? { ...h, shares: h.shares - shares, currentPrice: price }
        : h
      ).filter(h => h.shares > 0);
      return { ...prev, budget: prev.budget + proceeds, holdings: newHoldings };
    });
  };

  const collectReward = (amount: number) => {
    setBuyingPower(prev => prev + amount);
    setTournamentStatus(prev => ({ ...prev, phase: 'idle' }));
    alert(`Reward Collected: $${amount.toLocaleString()} added to your main buying power!`);
  };

  const buyStock = (ticker: string, name: string, shares: number, price: number) => {
    const cost = shares * price;
    if (buyingPower < cost) {
      alert("Not enough buying power!");
      return;
    }

    setBuyingPower(prev => prev - cost);
    setHoldings(prev => {
      const existing = prev.find(h => h.ticker === ticker);
      if (existing) {
        const totalShares = existing.shares + shares;
        const totalCost = (existing.shares * existing.averagePrice) + (shares * price);
        return prev.map(h => h.ticker === ticker 
          ? { ...h, shares: totalShares, averagePrice: totalCost / totalShares, currentPrice: price }
          : h
        );
      }
      return [...prev, { ticker, name, shares, averagePrice: price, currentPrice: price }];
    });
  };

  const sellStock = (ticker: string, shares: number, price: number) => {
    const existing = holdings.find(h => h.ticker === ticker);
    if (!existing || existing.shares < shares) {
      alert("Not enough shares to sell!");
      return;
    }

    const proceeds = shares * price;
    setBuyingPower(prev => prev + proceeds);
    setHoldings(prev => {
      const updated = prev.map(h => h.ticker === ticker 
        ? { ...h, shares: h.shares - shares, currentPrice: price }
        : h
      ).filter(h => h.shares > 0);
      return updated;
    });
  };

  const totalValue = buyingPower + holdings.reduce((acc, h) => acc + (h.shares * h.currentPrice), 0);

  const deductFunds = (amount: number) => {
    if (buyingPower < amount) return false;
    setBuyingPower(prev => prev - amount);
    return true;
  };

  return (
    <PortfolioContext.Provider value={{ 
      buyingPower, 
      holdings, 
      buyStock, 
      sellStock, 
      totalValue, 
      deductFunds,
      activeLeagueId,
      setActiveLeagueId,
      tournamentStatus,
      startTournament,
      stopTournament,
      fastForwardTournament,
      buySimStock,
      sellSimStock,
      collectReward,
      setPlayerReady
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
