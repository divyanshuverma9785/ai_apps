import React, { useEffect, useState } from "react";

export default function ProgressRing({ size = 140, stroke = 12, value = 0, label, sublabel }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setProgress(value), 60);
    return () => clearTimeout(t);
  }, [value]);

  const offset = circ - (progress / 100) * circ;

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} fill="none"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="#F6E100" strokeWidth={stroke} fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)" }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        color: "#fff",
      }}>
        <div className="font-display" style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>
          {label}
        </div>
        {sublabel && (
          <div style={{ fontSize: 12, color: "#E8E0FF", marginTop: 4 }}>{sublabel}</div>
        )}
      </div>
    </div>
  );
}
