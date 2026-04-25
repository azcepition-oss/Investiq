const DAILY_LIMIT = 10;
const STORAGE_KEY = "investiq_ai_credits_v1";

interface CreditState {
  date: string;
  used: number;
}

const getTodayKey = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const readState = (): CreditState => {
  if (typeof window === "undefined") {
    return { date: getTodayKey(), used: 0 };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const today = getTodayKey();
    if (!raw) return { date: today, used: 0 };

    const parsed = JSON.parse(raw) as CreditState;
    if (!parsed?.date || typeof parsed.used !== "number") {
      return { date: today, used: 0 };
    }

    if (parsed.date !== today) {
      return { date: today, used: 0 };
    }

    return parsed;
  } catch {
    return { date: getTodayKey(), used: 0 };
  }
};

const writeState = (state: CreditState) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const getRemainingAiCredits = () => {
  const state = readState();
  return Math.max(0, DAILY_LIMIT - state.used);
};

export const getDailyAiLimit = () => DAILY_LIMIT;

export const consumeAiCredit = () => {
  const state = readState();
  if (state.used >= DAILY_LIMIT) {
    const error = new Error("DAILY_AI_LIMIT_REACHED");
    (error as any).code = "DAILY_AI_LIMIT_REACHED";
    throw error;
  }

  const next = { ...state, used: state.used + 1 };
  writeState(next);
  return {
    used: next.used,
    remaining: Math.max(0, DAILY_LIMIT - next.used),
    limit: DAILY_LIMIT,
  };
};
