import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ArrowRight, TrendingUp, TrendingDown, Flame } from "lucide-react";
import { useApp } from "../../context/AppContext";
import ProgressRing from "../../components/ProgressRing";
import AvatarGroup from "../../components/AvatarGroup";
import { SkeletonLines } from "../../components/SkeletonLoader";
import { askRupaiyaAI, buildContext } from "../../utils/api";
import { nextMilestone } from "../../utils/gamification";

export default function HomeScreen() {
  const nav = useNavigate();
  const { user, transactions, circles, investments, notifications } = useApp();

  const [nudge, setNudge] = useState(null);
  const [nudgeLoading, setNudgeLoading] = useState(true);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
    const spent = transactions.filter(t => t.type === "debit").reduce((s, t) => s + Math.abs(t.amount), 0);
    const saved = income - spent;
    return { income, spent, saved };
  }, [transactions]);

  const progressPct = Math.min(100, Math.round((user.savedAmount / user.goalAmount) * 100));
  const milestone = nextMilestone(user.coins);
  const milePct = Math.min(100, Math.round((user.coins / milestone.coins) * 100));
  const coinsToGo = Math.max(0, milestone.coins - user.coins);

  const investTotal = investments.reduce((s, i) => s + i.invested, 0);
  const investCurrent = investments.reduce((s, i) => s + i.current, 0);
  const investGain = investCurrent - investTotal;
  const investPct = investTotal ? ((investGain / investTotal) * 100).toFixed(1) : "0.0";

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const ctx = buildContext({ user, transactions, circles, investments });
        const reply = await askRupaiyaAI({
          sessionId: `home-nudge-${user.name}`,
          message: "Please give me one specific money tip right now.",
          context: ctx,
          useCase: "home_nudge",
        });
        if (!canceled) setNudge(reply);
      } catch {
        if (!canceled) setNudge("Bhai, network mein thoda issue hai. Thodi der mein try karo — meanwhile chai pi lo ☕");
      } finally {
        if (!canceled) setNudgeLoading(false);
      }
    })();
    return () => { canceled = true; };
    // eslint-disable-next-line
  }, []);

  const dateStr = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="rp-screen" data-testid="home-screen">
      {/* Header */}
      <div style={{ padding: "18px 18px 8px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--rp-ink)" }}>
            Namaste, {user.name.split(" ")[0]} 👋
          </div>
          <div style={{ fontSize: 12, color: "var(--rp-ink-soft)", marginTop: 2 }}>{dateStr}</div>
        </div>
        <button
          onClick={() => nav("/notifications")}
          style={{
            position: "relative", background: "#fff", border: "1.5px solid var(--rp-line)",
            width: 42, height: 42, borderRadius: 999, display: "flex",
            alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}
          data-testid="home-notif-btn"
        >
          <Bell size={18} color="#1A0A4A" />
          {unreadCount > 0 && (
            <span style={{
              position: "absolute", top: 6, right: 6, width: 10, height: 10,
              borderRadius: "50%", background: "var(--rp-danger)", border: "2px solid #fff",
            }} />
          )}
        </button>
        <div
          onClick={() => nav("/profile")}
          style={{
            width: 42, height: 42, borderRadius: 999, background: "var(--rp-yellow)",
            color: "var(--rp-deep)", display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontFamily: "Syne", fontSize: 18, cursor: "pointer",
          }}
          data-testid="home-avatar"
        >
          {user.avatar}
        </div>
      </div>

      {/* AI Nudge Card */}
      {!nudgeDismissed && (
        <div className="rp-section" style={{ marginTop: 8 }}>
          <div className="rp-card-purple rp-slide-up" style={{ borderLeft: "4px solid var(--rp-yellow)" }} data-testid="ai-nudge-card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                background: "var(--rp-yellow)", color: "var(--rp-deep)",
                padding: "4px 10px", borderRadius: 999, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
              }}>🤖 RUPAIYA AI</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--rp-lavender)" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--rp-green)", boxShadow: "0 0 8px var(--rp-green)" }} />
                Live
              </div>
            </div>
            {nudgeLoading ? (
              <SkeletonLines lines={3} />
            ) : (
              <div style={{ fontSize: 15, lineHeight: 1.55, color: "var(--rp-lavender)" }}>
                {nudge}
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button
                onClick={() => setNudgeDismissed(true)}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.12)", color: "#fff",
                  border: "none", padding: "10px", borderRadius: 999, fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}
                data-testid="nudge-dismiss"
              >
                Samjha ✓
              </button>
              <button
                onClick={() => nav("/ai")}
                style={{
                  flex: 1, background: "var(--rp-yellow)", color: "var(--rp-deep)",
                  border: "none", padding: "10px", borderRadius: 999, fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}
                data-testid="nudge-more"
              >
                Aur Batao →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cashflow row */}
      <h3 className="rp-h-section">Is mahine ka hisaab</h3>
      <div className="rp-section" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        <StatCard icon="💰" value={`₹${Math.round(stats.income / 1000)}k`} label="Aaya" color="var(--rp-green)" tid="stat-income" />
        <StatCard icon="💸" value={`₹${Math.round(stats.spent / 1000)}k`} label="Gaya" color="var(--rp-danger)" tid="stat-spent" />
        <StatCard icon="🪙" value={`₹${Math.round(stats.saved / 1000)}k`} label="Bacha" color="var(--rp-yellow)" darkBg tid="stat-saved" />
      </div>

      {/* Goal progress */}
      <h3 className="rp-h-section">Aapka Goal</h3>
      <div className="rp-section">
        <div className="rp-card-purple rp-slide-up" data-testid="goal-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ fontSize: 32 }}>{user.goalEmoji}</div>
            <div style={{ flex: 1 }}>
              <div className="font-display" style={{ fontSize: 20, fontWeight: 800 }}>{user.goal}</div>
              <div style={{ fontSize: 12, color: "var(--rp-lavender)" }}>Target: ₹{user.goalAmount.toLocaleString("en-IN")}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <ProgressRing size={130} value={progressPct} label={`${progressPct}%`} sublabel="Complete" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "var(--rp-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Saved</div>
              <div className="font-display" style={{ fontSize: 24, fontWeight: 800, color: "var(--rp-yellow)", lineHeight: 1.2 }}>
                ₹{user.savedAmount.toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: 11, color: "var(--rp-lavender)", marginTop: 10 }}>
                ETA: <b>8 mahine</b>
              </div>
              <div style={{ fontSize: 11, color: "var(--rp-muted)", marginTop: 2 }}>@ current savings rate</div>
            </div>
          </div>
          <div className="rp-bar-dark" style={{ marginTop: 16 }}>
            <div className="rp-bar-fill-yellow" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Streak badge + Circle */}
      <h3 className="rp-h-section">Mera Circle</h3>
      <div className="rp-section" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {circles.slice(0, 1).map(c => (
          <div
            key={c.id}
            className="rp-card-white rp-slide-up"
            style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
            onClick={() => nav("/circles")}
            data-testid="home-circle-card"
          >
            <AvatarGroup members={c.memberList} max={3} size={36} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: "var(--rp-ink)" }}>{c.name}</div>
              <div style={{ fontSize: 12, color: "var(--rp-ink-soft)" }}>
                {c.members} members · ₹{c.monthlyContribution}/month
              </div>
              <StatusPill status={c.status} />
            </div>
            <ArrowRight size={20} color="var(--rp-deep)" />
          </div>
        ))}

        <div className="rp-card-white" style={{ display: "flex", gap: 12, alignItems: "center" }} data-testid="streak-card">
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "linear-gradient(135deg, #FFAE00, #FF4D6B)", display: "flex",
            alignItems: "center", justifyContent: "center", color: "#fff",
          }}>
            <Flame size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: "var(--rp-ink)" }}>{user.streak}-mahine ka streak!</div>
            <div style={{ fontSize: 12, color: "var(--rp-ink-soft)" }}>Lagatar contribute kar rahe ho 🔥</div>
          </div>
        </div>
      </div>

      {/* Coins */}
      <div className="rp-section" style={{ marginTop: 14 }}>
        <div className="rp-card-purple" data-testid="coins-widget">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="rp-coin-bounce" style={{ fontSize: 40 }}>🪙</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "var(--rp-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Rupaiya Coins</div>
              <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: "var(--rp-yellow)" }}>
                {user.coins.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
          <div className="rp-bar-dark" style={{ marginTop: 12 }}>
            <div className="rp-bar-fill-yellow" style={{ width: `${milePct}%` }} />
          </div>
          <div style={{ fontSize: 12, color: "var(--rp-lavender)", marginTop: 8 }}>
            <b style={{ color: "var(--rp-yellow)" }}>{coinsToGo} coins aur</b> → {milestone.reward}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div style={{ display: "flex", alignItems: "center", padding: "0 18px" }}>
        <h3 className="rp-h-section" style={{ margin: "20px 0 10px", flex: 1 }}>Haal ka kharch</h3>
        <button
          onClick={() => nav("/transactions")}
          style={{ background: "transparent", border: "none", color: "var(--rp-deep)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
          data-testid="home-see-all-tx"
        >
          Sab dekhein →
        </button>
      </div>
      <div className="rp-section" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {transactions.slice(0, 5).map(t => (
          <TxRow key={t.id} t={t} />
        ))}
      </div>

      {/* Investment snapshot */}
      {investments.length > 0 && (
        <>
          <h3 className="rp-h-section">Invest Snapshot</h3>
          <div className="rp-section">
            <div
              className="rp-card-white"
              style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
              onClick={() => nav("/invest")}
              data-testid="home-invest-card"
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #F6E100, #FFAE00)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={22} color="#2A0A8C" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "var(--rp-ink-soft)" }}>Total Invested</div>
                <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: "var(--rp-ink)" }}>
                  ₹{investTotal.toLocaleString("en-IN")}
                </div>
                <div style={{ fontSize: 13, color: "var(--rp-green)", fontWeight: 700 }}>
                  +₹{investGain} ({investPct}%)
                </div>
              </div>
              <ArrowRight size={20} color="var(--rp-deep)" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, value, label, color, darkBg, tid }) {
  return (
    <div
      style={{
        background: darkBg ? "var(--rp-dark)" : "#fff",
        color: darkBg ? "#fff" : "var(--rp-ink)",
        borderRadius: 18,
        padding: 14,
        textAlign: "left",
        boxShadow: darkBg ? "0 6px 20px rgba(42,10,140,0.25)" : "0 2px 12px rgba(66,15,174,0.06)",
      }}
      className="rp-slide-up"
      data-testid={tid}
    >
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: darkBg ? "var(--rp-muted)" : "var(--rp-ink-soft)", marginTop: 2 }}>
        {label}
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    bidding_open: { label: "🟡 Bidding Open", color: "#B38E00", bg: "#FFF4A3" },
    active: { label: "🟢 Active", color: "#065F46", bg: "#D1FAE5" },
    completed: { label: "🔴 Completed", color: "#7F1D1D", bg: "#FEE2E2" },
  };
  const m = map[status] || map.active;
  return (
    <div style={{
      display: "inline-block", padding: "3px 10px", background: m.bg, color: m.color,
      borderRadius: 999, fontSize: 10, fontWeight: 700, marginTop: 6,
    }}>
      {m.label}
    </div>
  );
}

function TxRow({ t }) {
  const debit = t.type === "debit";
  return (
    <div
      className="rp-card-white"
      style={{ padding: 12, display: "flex", alignItems: "center", gap: 12 }}
      data-testid={`tx-row-${t.id}`}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 12, background: "var(--rp-bg)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
      }}>{t.emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: "var(--rp-ink)", fontSize: 14 }}>{t.merchant}</div>
        <div style={{ fontSize: 11, color: "var(--rp-ink-soft)" }}>{t.category} · {t.date}</div>
      </div>
      <div className="font-display" style={{ fontSize: 15, fontWeight: 800, color: debit ? "var(--rp-danger)" : "var(--rp-green)" }}>
        {debit ? "-" : "+"}₹{Math.abs(t.amount).toLocaleString("en-IN")}
      </div>
    </div>
  );
}
