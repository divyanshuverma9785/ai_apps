import React from "react";

export default function AvatarGroup({ members = [], max = 4, size = 32 }) {
  const visible = members.slice(0, max);
  const extra = members.length - max;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {visible.map((m, i) => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: m.color || "#7C3AED",
            color: m.initial === "R" && m.isYou ? "#1A0A4A" : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: size * 0.42,
            marginLeft: i === 0 ? 0 : -10,
            border: "2px solid #fff",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          {m.initial}
        </div>
      ))}
      {extra > 0 && (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: "#1A0A4A",
            color: "#F6E100",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: size * 0.38,
            marginLeft: -10,
            border: "2px solid #fff",
          }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
