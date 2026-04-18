import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  DEFAULT_USER,
  DEFAULT_TRANSACTIONS,
  DEFAULT_CIRCLES,
  DEFAULT_INVESTMENTS,
  DEFAULT_NOTIFICATIONS,
} from "../data/mockData";

const AppContext = createContext(null);
const STORAGE_KEY = "rupaiya_state_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persist(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function AppProvider({ children }) {
  const initial = loadState();

  const [onboarded, setOnboarded] = useState(initial?.onboarded || false);
  const [user, setUser] = useState(initial?.user || DEFAULT_USER);
  const [transactions, setTransactions] = useState(initial?.transactions || DEFAULT_TRANSACTIONS);
  const [circles, setCircles] = useState(initial?.circles || DEFAULT_CIRCLES);
  const [investments, setInvestments] = useState(initial?.investments || DEFAULT_INVESTMENTS);
  const [notifications, setNotifications] = useState(initial?.notifications || DEFAULT_NOTIFICATIONS);
  const [toast, setToast] = useState(null);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    persist({ onboarded, user, transactions, circles, investments, notifications });
  }, [onboarded, user, transactions, circles, investments, notifications]);

  const completeOnboarding = useCallback((newUser) => {
    setUser(prev => ({ ...prev, ...newUser }));
    setOnboarded(true);
  }, []);

  const earnCoins = useCallback((amount, label) => {
    setUser(prev => ({ ...prev, coins: (prev.coins || 0) + amount }));
    setToast({ amount, label });
    setTimeout(() => setToast(null), 2600);
  }, []);

  const triggerConfetti = useCallback(() => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2400);
  }, []);

  const addTransaction = useCallback((tx) => {
    setTransactions(prev => [{ ...tx, id: Date.now() }, ...prev]);
  }, []);

  const addCircle = useCallback((circle) => {
    setCircles(prev => [...prev, { ...circle, id: Date.now() }]);
  }, []);

  const addInvestment = useCallback((inv) => {
    setInvestments(prev => [{ ...inv, id: Date.now() }, ...prev]);
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }, []);

  const value = {
    onboarded,
    user,
    transactions,
    circles,
    investments,
    notifications,
    toast,
    confetti,
    setUser,
    completeOnboarding,
    earnCoins,
    triggerConfetti,
    addTransaction,
    addCircle,
    addInvestment,
    markNotificationsRead,
    clearAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be within AppProvider");
  return ctx;
}
