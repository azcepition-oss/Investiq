import React, { createContext, useContext, useState, useEffect } from 'react';

interface TutorialStep {
  targetId: string;
  title: string;
  message: string;
  position: 'top' | 'bottom' | 'center';
  tabIndex?: number;
  path?: string;
  action?: () => void;
}

interface TutorialContextType {
  isActive: boolean;
  currentStep: number;
  steps: TutorialStep[];
  nextStep: () => void;
  skipTutorial: () => void;
  startTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    targetId: 'resource-bar',
    title: 'Pulse of Your Wealth',
    message: 'Welcome, Trader. This is your Resource Bar. It displays your current Rank IQ and total simulated capital. High IQ unlocks elite leagues!',
    position: 'bottom',
    path: '/portfolio'
  },
  {
    targetId: 'nav-tab-news',
    title: 'Information Warfare',
    message: 'Data is power. Use the News tab to track global events and AI sentiments. This is where you find your edge.',
    position: 'top',
    tabIndex: 0,
    path: '/news'
  },
  {
    targetId: 'nav-tab-portfolio',
    title: 'The Dashboard',
    message: 'Here you track every cent. Monitor your daily gains, total value, and active holdings. Efficiency is key to dominance.',
    position: 'top',
    tabIndex: 1,
    path: '/portfolio'
  },
  {
    targetId: 'dashboard-cash',
    title: 'Liquid Capital',
    message: 'Your cash on hand. Use this to strike when the market is ripe for profit.',
    position: 'top',
    tabIndex: 1,
    path: '/portfolio'
  },
  {
    targetId: 'nav-tab-market',
    title: 'The Battlefield',
    message: 'This is the Market. Search for any asset, analyze high-volatility stock charts, and deploy your capital with precision.',
    position: 'top',
    tabIndex: 2,
    path: '/market'
  },
  {
    targetId: 'market-search',
    title: 'Precision Targeting',
    message: 'Use the Search Bar to find any ticker instantly. Speed saves capital.',
    position: 'bottom',
    tabIndex: 2,
    path: '/market'
  },
  {
    targetId: 'market-category-0',
    title: 'Asset Classes',
    message: 'Filter through Stocks, Bonds, Crypto, and Forex. Each asset class has its own risk profile and potential for legendary returns.',
    position: 'bottom',
    tabIndex: 2,
    path: '/market'
  },
  {
    targetId: 'nav-tab-compete',
    title: 'The Arena',
    message: 'Compete in high-stakes Tournament Sim cups or join a League (Clan) to climb the global leaderboards.',
    position: 'top',
    tabIndex: 3,
    path: '/compete'
  },
  {
    targetId: 'league-trophies',
    title: 'Honor & Glory',
    message: 'Earn trophies in tournament cups to increase your clan\'s global standing. Victory brings massive rewards.',
    position: 'bottom',
    tabIndex: 3,
    path: '/compete'
  },
  {
    targetId: 'nav-tab-learning',
    title: 'The Dojo',
    message: 'In the Learn section, complete real-world case studies and quizzes. Higher IQ means better simulation outcomes.',
    position: 'top',
    tabIndex: 4,
    path: '/learning'
  },
  {
    targetId: 'first-lesson-card',
    title: 'The First Challenge',
    message: 'Start here. Every lesson you finish increases your IQ and gives you an edge in the Tournament Sims.',
    position: 'top',
    tabIndex: 4,
    path: '/learning'
  },
  {
    targetId: 'ai-mentor-btn',
    title: 'The AI Oracle',
    message: 'Stuck? Confused? Tap me anytime for a deep-dive analysis of any stock or market trend. I am your 24/7 advisor.',
    position: 'top'
  }
];

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTutorial();
    }
  };

  const skipTutorial = () => {
    completeTutorial();
  };

  const startTutorial = () => {
    setCurrentStep(0);
    setIsActive(true);
  };

  const completeTutorial = () => {
    setIsActive(false);
    localStorage.setItem('tutorialCompleted', 'true');
  };

  return (
    <TutorialContext.Provider value={{
      isActive,
      currentStep,
      steps: TUTORIAL_STEPS,
      nextStep,
      skipTutorial,
      startTutorial
    }}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) throw new Error('useTutorial must be used within a TutorialProvider');
  return context;
};
