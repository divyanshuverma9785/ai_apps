import React from "react";
import { useApp } from "../../context/AppContext";
import { BADGES } from "../../data/mockData";
import { nextMilestone } from "../../utils/gamification";
import { Bell, Globe, Lock, LifeBuoy, Star, LogOut, Edit2, Copy, MessageSquareShare, ChevronRight } from "lucide-react";

export default function ProfileScreen() {
  const { user, circles, investments, clearAll } = useApp();
  const [copied, setCopied] = React.useState(false);

  const milestone = nextMilestone(user.coins);
  const milePct = Math.min(100, Math.round((user.coins / milestone.coins) * 100));
  const totalInvested = investments.reduce((s, i) => s + i.invested, 0);

  const copyCode = () => {
    navigator.clipboard.writeText(user.referralCode || "RAMESH42");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const shareWhatsapp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`Bhai, RUPAIYA app try karo! Smart savings aur AI advice. Use my code ${user.referralCode || "RAMESH42"} aur hume dono ko ₹100 cashback milega 💸`)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="rp-screen" data-testid="profile-screen">
      {/* Profile card */}
      <div className="rp-section" style={{ paddingTop: 20 }}>
        <div className="rp-card-purple">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 78, height: 78, borderRadius: 999, background: "var(--rp-yellow)",
              color: "var(--rp-deep)", display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Syne", fontWeight: 800, fontSize: 36,
              boxShadow: "0 8px 24px rgba(246,225,0,0.4)",
            }}>
              {user.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div className="font-display" style={{ fontSize: 22, fontWeight: 800 }}>{user.name}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                <Tag>{user.city?.split(",")[0]}</Tag>
                {(user.languages || []).slice(0, 2).map(l => <Tag key={l}>{l}</Tag>)}
              </div>
              <div style={{ fontSize: 12, color: "var(--rp-muted)", marginTop: 6 }}>
                Since {user.joinDate}
              </div>
            </div>
            <button style={{
              background: "rgba(255,255,255,0.12)", border: "none", width: 36, height: 36, borderRadius: 999,
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
              <Edit2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Coins */}
      <div className="rp-section" style={{ marginTop: 12 }}>
        <div className="rp-card-dark" data-testid="profile-coins">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="rp-coin-bounce" style={{ fontSize: 40 }}>🪙</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "var(--rp-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Rupaiya Coins
              </div>
              <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: "var(--rp-yellow)" }}>
                {user.coins.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
          <div className="rp-bar-dark" style={{ marginTop: 14 }}>
            <div className="rp-bar-fill-yellow" style={{ width: `${milePct}%` }} />
          </div>
          <div style={{ fontSize: 12, color: "var(--rp-lavender)", marginTop: 6 }}>
            <b style={{ color: "var(--rp-yellow)" }}>{Math.max(0, milestone.coins - user.coins)} coins aur</b> → {milestone.reward}
          </div>
        </div>
      </div>

      {/* Badges */}
      <h3 className="rp-h-section">Achievements</h3>
      <div
        className="rp-hide-scroll"
        style={{ padding: "0 18px", display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}
      >
        {BADGES.map(b => (
          <div
            key={b.id}
            title={b.desc}
            style={{
              flexShrink: 0, width: 92, height: 112,
              background: b.unlocked ? "linear-gradient(180deg, #5A1FD1, #2A0A8C)" : "var(--rp-line)",
              color: b.unlocked ? "#fff" : "#8b84a8",
              border: b.unlocked ? "2px solid var(--rp-yellow)" : "none",
              borderRadius: 16, padding: 10, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 4,
              filter: b.unlocked ? "none" : "grayscale(1) opacity(0.6)",
            }}
            data-testid={`badge-${b.id}`}
          >
            <div style={{ fontSize: 28 }}>{b.emoji}</div>
            <div style={{ fontSize: 11, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>
              {b.label}
            </div>
            {!b.unlocked && <Lock size={11} />}
          </div>
        ))}
      </div>

      {/* Stats grid */}
      <h3 className="rp-h-section">Stats</h3>
      <div className="rp-section" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <StatTile value={circles.length} label="Circles Joined" />
        <StatTile value={`₹${(totalInvested / 1000).toFixed(1)}k`} label="Total Invested" />
        <StatTile value={user.coins} label="Coins Earned" />
        <StatTile value="1" label="Friends Referred" />
      </div>

      {/* Referral */}
      <h3 className="rp-h-section">Dosto ko invite karo</h3>
      <div className="rp-section">
        <div className="rp-card-purple" data-testid="referral-card">
          <div style={{ fontSize: 14, color: "var(--rp-lavender)", marginBottom: 12 }}>
            Har dost jo join kare → aapko <b style={{ color: "var(--rp-yellow)" }}>₹100 cashback + 1,000 Coins</b>
          </div>
          <div style={{
            display: "flex", alignItems: "center", background: "var(--rp-yellow)",
            padding: "10px 14px", borderRadius: 999, justifyContent: "space-between",
          }}>
            <div style={{
              color: "var(--rp-deep)", fontWeight: 800, fontSize: 18, fontFamily: "Syne",
              letterSpacing: "0.08em",
            }}>
              {user.referralCode || "RAMESH42"}
            </div>
            <button
              onClick={copyCode}
              style={{ background: "transparent", border: "none", color: "var(--rp-deep)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: 700 }}
              data-testid="copy-code"
            >
              <Copy size={16} /> {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <button
            onClick={shareWhatsapp}
            style={{
              marginTop: 12, width: "100%", background: "#25D366", color: "#fff",
              border: "none", padding: 14, borderRadius: 999, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
            data-testid="share-whatsapp"
          >
            <MessageSquareShare size={18} /> WhatsApp pe share karo
          </button>
        </div>
      </div>

      {/* Settings */}
      <h3 className="rp-h-section">Settings</h3>
      <div className="rp-section" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <SettingRow icon={<Bell size={18} />} label="Notifications" />
        <SettingRow icon={<Globe size={18} />} label="Language" right={<span style={{ fontSize: 12, color: "var(--rp-ink-soft)" }}>{user.languages?.[0] || "Hindi"} ✓</span>} />
        <SettingRow icon={<Lock size={18} />} label="Privacy" />
        <SettingRow icon={<LifeBuoy size={18} />} label="Help & Support" />
        <SettingRow icon={<Star size={18} />} label="Rate RUPAIYA" />
        <div onClick={clearAll} data-testid="logout-btn">
          <SettingRow icon={<LogOut size={18} color="#FF4D6B" />} label="Logout & Reset" textColor="#FF4D6B" />
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: 11, color: "var(--rp-ink-soft)", padding: 20 }}>
        RUPAIYA v1.0 · Bharat first 🇮🇳
      </div>
    </div>
  );
}

function Tag({ children }) {
  return (
    <span style={{
      background: "rgba(255,255,255,0.12)", padding: "3px 10px", borderRadius: 999,
      fontSize: 11, color: "#fff", fontWeight: 500,
    }}>{children}</span>
  );
}
function StatTile({ value, label }) {
  return (
    <div className="rp-card-white" style={{ padding: 14 }}>
      <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: "var(--rp-deep)" }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--rp-ink-soft)", marginTop: 2 }}>{label}</div>
    </div>
  );
}
function SettingRow({ icon, label, right, textColor }) {
  return (
    <div className="rp-card-white" style={{ padding: 14, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: "var(--rp-bg)",
        display: "flex", alignItems: "center", justifyContent: "center", color: "var(--rp-deep)",
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, fontWeight: 600, color: textColor || "var(--rp-ink)", fontSize: 14 }}>{label}</div>
      {right}
      <ChevronRight size={18} color="var(--rp-ink-soft)" />
    </div>
  );
}
