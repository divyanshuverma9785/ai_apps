import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, TrendingUp, Sparkles, User } from "lucide-react";

const tabs = [
  { key: "/home", label: "Home", icon: Home, tid: "nav-home" },
  { key: "/circles", label: "Circles", icon: Users, tid: "nav-circles" },
  { key: "/invest", label: "Invest", icon: TrendingUp, tid: "nav-invest" },
  { key: "/ai", label: "Rupaiya AI", icon: Sparkles, tid: "nav-ai" },
  { key: "/profile", label: "Profile", icon: User, tid: "nav-profile" },
];

export default function BottomNav() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="rp-bottom-nav" data-testid="bottom-nav">
      {tabs.map(t => {
        const Icon = t.icon;
        const active = pathname.startsWith(t.key);
        return (
          <div
            key={t.key}
            className={`rp-nav-item ${active ? "active" : ""}`}
            onClick={() => nav(t.key)}
            data-testid={t.tid}
          >
            <div className="rp-nav-icon">
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            </div>
            <span>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}
