import React from "react";

export function SkeletonLines({ lines = 3, width = "100%" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="rp-skeleton"
          style={{ height: 12, width: i === lines - 1 ? "60%" : width }}
        />
      ))}
    </div>
  );
}

export function ChatDots() {
  return (
    <div className="rp-dots">
      <span></span><span></span><span></span>
    </div>
  );
}
