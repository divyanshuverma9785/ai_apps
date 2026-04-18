import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TopBar({ title, onBack, right }) {
  const nav = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "16px 18px 12px",
        background: "var(--rp-bg)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
      data-testid="topbar"
    >
      {onBack !== false && (
        <button
          onClick={() => (onBack ? onBack() : nav(-1))}
          style={{
            background: "#fff",
            border: "1.5px solid var(--rp-line)",
            width: 40, height: 40, borderRadius: 999,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
          data-testid="topbar-back"
        >
          <ArrowLeft size={18} color="#1A0A4A" />
        </button>
      )}
      <div
        className="font-display"
        style={{ flex: 1, fontSize: 20, fontWeight: 700, color: "var(--rp-ink)", marginLeft: onBack === false ? 0 : 12 }}
      >
        {title}
      </div>
      {right}
    </div>
  );
}
