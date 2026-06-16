import React from "react";
import { useApp } from "../context/AppContext";

export default function CoinToast() {
  const { toast, confetti } = useApp();

  return (
    <>
      {toast && (
        <div className="rp-coin-toast" data-testid="coin-toast">
          🪙 +{toast.amount} Rupaiya Coins!
        </div>
      )}
      {confetti && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10000 }}>
          {Array.from({ length: 28 }).map((_, i) => {
            const emojis = ["🎉", "💰", "🪙", "✨", "🥇"];
            const left = Math.random() * 100;
            const delay = Math.random() * 0.6;
            const dur = 1.8 + Math.random() * 1.2;
            return (
              <span
                key={i}
                className="rp-confetti-piece"
                style={{ left: `${left}%`, animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
              >
                {emojis[i % emojis.length]}
              </span>
            );
          })}
        </div>
      )}
    </>
  );
}
