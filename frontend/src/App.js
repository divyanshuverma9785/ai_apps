import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import BottomNav from "./components/BottomNav";
import CoinToast from "./components/CoinToast";

import OnboardingSlides from "./screens/Onboarding/OnboardingSlides";
import HomeScreen from "./screens/Home/HomeScreen";
import CirclesScreen from "./screens/Circles/CirclesScreen";
import InvestScreen from "./screens/Invest/InvestScreen";
import AIChatScreen from "./screens/AIChat/AIChatScreen";
import ProfileScreen from "./screens/Profile/ProfileScreen";
import TransactionsScreen from "./screens/Transactions/TransactionsScreen";
import NotificationsScreen from "./screens/Notifications/NotificationsScreen";

function Shell() {
  const { onboarded } = useApp();
  const { pathname } = useLocation();

  const hideNav = !onboarded || pathname === "/onboarding";
  // AI chat has its own fixed input, so it handles scroll internally — no outer scroll
  const fullHeightScreen = pathname === "/ai" || pathname === "/onboarding";

  return (
    <div className="rp-phone-shell">
      <div className="rp-phone">
        <div
          className="rp-phone-content"
          style={fullHeightScreen ? { display: "flex", flexDirection: "column", overflow: "hidden" } : undefined}
        >
          <Routes>
            <Route path="/" element={<Navigate to={onboarded ? "/home" : "/onboarding"} replace />} />
            <Route path="/onboarding" element={<OnboardingSlides />} />
            <Route path="/home" element={onboarded ? <HomeScreen /> : <Navigate to="/onboarding" replace />} />
            <Route path="/circles" element={onboarded ? <CirclesScreen /> : <Navigate to="/onboarding" replace />} />
            <Route path="/invest" element={onboarded ? <InvestScreen /> : <Navigate to="/onboarding" replace />} />
            <Route path="/ai" element={onboarded ? <AIChatScreen /> : <Navigate to="/onboarding" replace />} />
            <Route path="/profile" element={onboarded ? <ProfileScreen /> : <Navigate to="/onboarding" replace />} />
            <Route path="/transactions" element={onboarded ? <TransactionsScreen /> : <Navigate to="/onboarding" replace />} />
            <Route path="/notifications" element={onboarded ? <NotificationsScreen /> : <Navigate to="/onboarding" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        {!hideNav && <BottomNav />}
        <CoinToast />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AppProvider>
  );
}
