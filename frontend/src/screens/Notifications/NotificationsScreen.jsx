import React, { useEffect } from "react";
import { useApp } from "../../context/AppContext";
import TopBar from "../../components/TopBar";

export default function NotificationsScreen() {
  const { notifications, markNotificationsRead } = useApp();

  useEffect(() => {
    const t = setTimeout(() => markNotificationsRead(), 1200);
    return () => clearTimeout(t);
  }, [markNotificationsRead]);

  return (
    <div className="rp-screen" data-testid="notifications-screen">
      <TopBar
        title="Notifications"
        right={
          <button
            onClick={markNotificationsRead}
            style={{ background: "transparent", border: "none", color: "var(--rp-deep)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            data-testid="clear-all"
          >
            Sab clear
          </button>
        }
      />

      <div className="rp-section" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {notifications.length === 0 ? (
          <div className="rp-card-white" style={{ textAlign: "center", padding: 40 }}>
            <div style={{ fontSize: 48 }}>🔔</div>
            <div style={{ fontWeight: 600, marginTop: 6 }}>Sab clear hai!</div>
            <div style={{ fontSize: 13, color: "var(--rp-ink-soft)" }}>Koi nayi notification nahi</div>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              className="rp-card-white rp-slide-up"
              style={{
                padding: 14, display: "flex", gap: 12,
                borderLeft: !n.read ? `4px solid ${n.color}` : "none",
                background: !n.read ? "#fff" : "rgba(255,255,255,0.6)",
              }}
              data-testid={`notif-${n.id}`}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 999,
                background: n.color + "22", color: n.color,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                flexShrink: 0,
              }}>
                {n.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--rp-ink)" }}>
                  {n.title}
                </div>
                <div style={{ fontSize: 13, color: "var(--rp-ink-soft)", marginTop: 2, lineHeight: 1.45 }}>
                  {n.body}
                </div>
                <div style={{ fontSize: 11, color: "var(--rp-ink-soft)", marginTop: 6 }}>
                  {n.time}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
