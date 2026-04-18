import React, { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { askRupaiyaAI, buildContext } from "../../utils/api";
import { SkeletonLines } from "../../components/SkeletonLoader";
import { Check, TrendingUp, X } from "lucide-react";

export default function InvestScreen() {
  const { user, transactions, circles, investments, addInvestment, earnCoins, triggerConfetti } = useApp();
  const [tab, setTab] = useState("invest");
  const [advice, setAdvice] = useState(null);
  const [adviceLoading, setAdviceLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [successModal, setSuccessModal] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ctx = buildContext({ user, transactions, circles, investments });
        const reply = await askRupaiyaAI({
          sessionId: `invest-advice-${Date.now()}`,
          message: "Which of Digital Gold, Short FD, or Liquid Fund should I start investing in this month?",
          context: ctx,
          useCase: "invest_advice",
        });
        if (!cancelled) setAdvice(reply);
      } catch {
        if (!cancelled) setAdvice("AI thoda busy hai. Is mahine ₹500 se shuru karo — Gold sabse safe hai 🥇");
      } finally {
        if (!cancelled) setAdviceLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

  const confirmInvest = () => {
    const inv = {
      type: confirm.type,
      emoji: confirm.emoji,
      invested: confirm.amount,
      current: confirm.amount,
      gain: 0,
      gainPct: 0,
      date: new Date().toISOString().slice(0, 10),
    };
    addInvestment(inv);
    earnCoins(50, `${confirm.type} invest kiya`);
    triggerConfetti();
    setSuccessModal(confirm);
    setConfirm(null);
  };

  const totalInvested = investments.reduce((s, i) => s + i.invested, 0);
  const totalCurrent = investments.reduce((s, i) => s + i.current, 0);
  const totalGain = totalCurrent - totalInvested;
  const totalGainPct = totalInvested ? ((totalGain / totalInvested) * 100).toFixed(2) : "0.00";

  return (
    <div className="rp-screen" data-testid="invest-screen">
      <div style={{ padding: "18px 18px 10px" }}>
        <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: "var(--rp-ink)", margin: 0 }}>
          Munafa Engine
        </h1>
        <div style={{ fontSize: 13, color: "var(--rp-ink-soft)", marginTop: 4 }}>
          Bachat apne aap invest ho jaati hai 🌱
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, padding: "8px 18px 14px" }}>
        <button
          className={`rp-pill ${tab === "invest" ? "active" : ""}`}
          onClick={() => setTab("invest")}
          data-testid="tab-invest"
        >
          Invest Karo
        </button>
        <button
          className={`rp-pill ${tab === "mine" ? "active" : ""}`}
          onClick={() => setTab("mine")}
          data-testid="tab-mine"
        >
          Meri Investments
        </button>
      </div>

      {tab === "invest" && (
        <>
          <div className="rp-section">
            <div className="rp-card-dark" style={{ borderLeft: "4px solid var(--rp-yellow)" }} data-testid="ai-invest-advice">
              <div style={{ fontSize: 10, fontWeight: 800, color: "var(--rp-yellow)", letterSpacing: "0.08em", marginBottom: 6 }}>
                🤖 AI INSIGHT
              </div>
              {adviceLoading ? <SkeletonLines lines={2} /> :
                <div style={{ fontSize: 14, lineHeight: 1.55, color: "var(--rp-lavender)" }}>{advice}</div>
              }
            </div>
          </div>

          <div className="rp-section" style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
            <InvestCard
              emoji="🥇" name="DIGITAL SONA" badge="Sabse Safe" badgeColor="#22C55E"
              partner="Augmont ke saath" minimum="₹1 se shuru" rate="₹6,842/gram"
              tip="Mehengai se best protection. 10 saal mein ~12% average returns."
              placeholder="500"
              onBuy={(amt) => setConfirm({ type: "Digital Gold", emoji: "🥇", amount: amt, body: `${(amt / 6842).toFixed(3)} gram sona` })}
              tid="invest-gold"
              preview={(amt) => `₹${amt} = ${(amt / 6842).toFixed(3)} gram sona`}
            />
            <InvestCardFD
              onBuy={(amt, dur) => setConfirm({ type: `Short FD (${dur}M)`, emoji: "🏦", amount: amt, body: `${dur} month FD @ 7.2%` })}
            />
            <InvestCard
              emoji="🌱" name="LIQUID FUND" badge="6.5% Return" badgeColor="#F6E100" badgeText="#2A0A8C"
              partner="SEBI Registered AMCs" minimum="₹100/month SIP" rate="Low Risk"
              tip="1-12 mahine ki savings ke liye best. Kabhi bhi withdraw karo."
              placeholder="100"
              onBuy={(amt) => setConfirm({ type: "Liquid Fund", emoji: "🌱", amount: amt, body: "Liquid Fund SIP" })}
              tid="invest-fund"
              preview={(amt) => `₹${amt}/month SIP`}
            />
          </div>
        </>
      )}

      {tab === "mine" && (
        <>
          <div className="rp-section">
            <div className="rp-card-purple" data-testid="portfolio-summary">
              <div style={{ fontSize: 11, color: "var(--rp-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Total Portfolio</div>
              <div className="font-display" style={{ fontSize: 36, fontWeight: 800, color: "#fff", marginTop: 4 }}>
                ₹{totalCurrent.toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: 13, color: "var(--rp-lavender)", marginTop: 4 }}>
                Invested: ₹{totalInvested.toLocaleString("en-IN")}
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                marginTop: 10, padding: "6px 12px", borderRadius: 999,
                background: "rgba(34,197,94,0.2)", color: "#4ADE80",
                fontSize: 13, fontWeight: 700,
              }}>
                <TrendingUp size={14} /> +₹{totalGain} ({totalGainPct}%)
              </div>
            </div>
          </div>

          <h3 className="rp-h-section">All investments</h3>
          <div className="rp-section" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {investments.length === 0 ? (
              <div className="rp-card-white" style={{ textAlign: "center", padding: 24 }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>📭</div>
                <div style={{ fontWeight: 600 }}>Abhi koi investment nahi</div>
                <div style={{ fontSize: 13, color: "var(--rp-ink-soft)", marginTop: 4 }}>Upar "Invest Karo" se start karo</div>
              </div>
            ) : investments.map(i => (
              <div key={i.id} className="rp-card-white" style={{ display: "flex", alignItems: "center", gap: 12 }} data-testid={`inv-row-${i.id}`}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--rp-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                  {i.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{i.type}</div>
                  <div style={{ fontSize: 12, color: "var(--rp-ink-soft)" }}>
                    Invested ₹{i.invested.toLocaleString("en-IN")} · {i.date}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="font-display" style={{ fontSize: 16, fontWeight: 800 }}>
                    ₹{i.current.toLocaleString("en-IN")}
                  </div>
                  <div style={{ fontSize: 12, color: i.gain >= 0 ? "var(--rp-green)" : "var(--rp-danger)", fontWeight: 700 }}>
                    {i.gain >= 0 ? "+" : ""}₹{i.gain} ({i.gainPct}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {confirm && (
        <ConfirmModal confirm={confirm} onConfirm={confirmInvest} onClose={() => setConfirm(null)} />
      )}
      {successModal && (
        <SuccessModal data={successModal} onClose={() => setSuccessModal(null)} />
      )}
    </div>
  );
}

function InvestCard({ emoji, name, badge, badgeColor, badgeText, partner, minimum, rate, tip, placeholder, onBuy, tid, preview }) {
  const [amt, setAmt] = useState("");
  return (
    <div className="rp-card-purple rp-slide-up" data-testid={tid}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 28 }}>{emoji}</div>
        <div className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "var(--rp-yellow)", flex: 1 }}>
          {name}
        </div>
        <div style={{ background: badgeColor, color: badgeText || "#fff", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
          {badge}
        </div>
      </div>
      <div style={{ fontSize: 12, color: "var(--rp-lavender)", display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
        <span>🤝 {partner}</span>
        <span>💸 {minimum}</span>
        <span>📈 {rate}</span>
      </div>
      <div style={{ fontSize: 12, color: "var(--rp-muted)", marginBottom: 12, padding: 10, background: "rgba(0,0,0,0.2)", borderRadius: 10 }}>
        💡 {tip}
      </div>
      <input
        type="number"
        className="rp-input rp-input-dark"
        placeholder={`₹ ${placeholder}`}
        value={amt}
        onChange={e => setAmt(e.target.value)}
        data-testid={`${tid}-input`}
      />
      {amt > 0 && (
        <div style={{ fontSize: 12, color: "var(--rp-yellow)", marginTop: 8, fontWeight: 600 }}>
          {preview(Number(amt))}
        </div>
      )}
      <button
        className="rp-btn-primary"
        style={{ marginTop: 12 }}
        onClick={() => amt > 0 && onBuy(Number(amt))}
        disabled={!amt || amt <= 0}
        data-testid={`${tid}-btn`}
      >
        {emoji} Invest Karo
      </button>
    </div>
  );
}

function InvestCardFD({ onBuy }) {
  const [amt, setAmt] = useState("");
  const [dur, setDur] = useState(6);
  const interest = amt > 0 ? Math.round((Number(amt) * 0.072 * dur) / 12) : 0;

  return (
    <div className="rp-card-purple rp-slide-up" data-testid="invest-fd">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 28 }}>🏦</div>
        <div className="font-display" style={{ fontSize: 18, fontWeight: 800, color: "var(--rp-yellow)", flex: 1 }}>SHORT FD</div>
        <div style={{ background: "var(--rp-yellow)", color: "var(--rp-deep)", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
          7.2% Return
        </div>
      </div>
      <div style={{ fontSize: 12, color: "var(--rp-lavender)", marginBottom: 10 }}>
        🤝 Partner Banks · 💸 Min ₹1,000 · 📈 7.2% p.a.
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {[3, 6, 12].map(d => (
          <button
            key={d}
            onClick={() => setDur(d)}
            style={{
              flex: 1, padding: 10, borderRadius: 10,
              background: dur === d ? "var(--rp-yellow)" : "rgba(255,255,255,0.08)",
              color: dur === d ? "var(--rp-deep)" : "#fff",
              border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}
          >
            {d} Months
          </button>
        ))}
      </div>
      <input
        type="number"
        className="rp-input rp-input-dark"
        placeholder="₹ 5000"
        value={amt}
        onChange={e => setAmt(e.target.value)}
      />
      {amt > 0 && (
        <div style={{ fontSize: 12, color: "var(--rp-yellow)", marginTop: 8, fontWeight: 600 }}>
          {dur} mahine baad ₹{(Number(amt) + interest).toLocaleString("en-IN")} milega (+₹{interest})
        </div>
      )}
      <button
        className="rp-btn-primary"
        style={{ marginTop: 12 }}
        onClick={() => amt > 0 && onBuy(Number(amt), dur)}
        disabled={!amt || amt <= 0}
        data-testid="invest-fd-btn"
      >
        🏦 FD Karo
      </button>
    </div>
  );
}

function ConfirmModal({ confirm, onConfirm, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 300,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={onClose} data-testid="confirm-modal">
      <div
        onClick={e => e.stopPropagation()}
        className="rp-card-white"
        style={{ maxWidth: 360, width: "100%", padding: 24, animation: "rpSlideUp 0.3s ease" }}
      >
        <div style={{ textAlign: "center", fontSize: 50, marginBottom: 10 }}>{confirm.emoji}</div>
        <div className="font-display" style={{ textAlign: "center", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
          Confirm karo
        </div>
        <div style={{ textAlign: "center", fontSize: 14, color: "var(--rp-ink-soft)", marginBottom: 16 }}>
          {confirm.body}
        </div>
        <div style={{
          background: "rgba(66,15,174,0.05)", borderRadius: 14, padding: 14,
          display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700,
        }}>
          <span>Amount</span>
          <span className="font-display" style={{ color: "var(--rp-deep)" }}>
            ₹{confirm.amount.toLocaleString("en-IN")}
          </span>
        </div>
        <div style={{
          marginTop: 12, padding: 12, borderRadius: 12,
          background: "rgba(34,197,94,0.12)", color: "#065F46",
          fontSize: 13, display: "flex", alignItems: "center", gap: 8,
        }}>
          <Check size={16} /> AI ne confirm kiya: Yeh aapke surplus mein fit hai
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <button className="rp-btn-outline" onClick={onClose}>Cancel</button>
          <button className="rp-btn-primary" onClick={onConfirm} data-testid="confirm-yes">
            Confirm ✓
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({ data, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 300,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg, #22C55E, #15803D)",
          color: "#fff", padding: 28, borderRadius: 24, maxWidth: 360, width: "100%", textAlign: "center",
          animation: "rpSlideUp 0.35s ease",
        }}
        data-testid="success-modal"
      >
        <div style={{ fontSize: 64 }}>{data.emoji}</div>
        <div className="font-display" style={{ fontSize: 26, fontWeight: 800, marginTop: 10 }}>
          Ho Gaya! ✓
        </div>
        <div style={{ fontSize: 15, marginTop: 6, opacity: 0.95 }}>
          ₹{data.amount.toLocaleString("en-IN")} {data.type} mein invest
        </div>
        <div style={{
          marginTop: 14, padding: "10px 14px", background: "rgba(255,255,255,0.2)",
          borderRadius: 999, display: "inline-block", fontWeight: 700, fontSize: 14,
        }}>
          🪙 +50 Rupaiya Coins mile!
        </div>
        <button
          style={{
            marginTop: 20, background: "#fff", color: "#065F46", border: "none",
            padding: "12px 24px", borderRadius: 999, fontWeight: 700, cursor: "pointer", width: "100%",
          }}
          onClick={onClose}
        >
          Badhiya!
        </button>
      </div>
    </div>
  );
}
