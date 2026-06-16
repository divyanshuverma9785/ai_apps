import React, { useEffect, useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import AvatarGroup from "../../components/AvatarGroup";
import { SkeletonLines } from "../../components/SkeletonLoader";
import { askRupaiyaAI, buildContext } from "../../utils/api";
import { GOAL_OPTIONS } from "../../data/mockData";
import { Plus, X, ChevronRight, Check, MessageSquareShare } from "lucide-react";

export default function CirclesScreen() {
  const { circles, addCircle, user, transactions, investments, earnCoins, triggerConfetti } = useApp();
  const [active, setActive] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  if (active !== null) {
    const c = circles.find(x => x.id === active);
    if (c) return <CircleDetail circle={c} onBack={() => setActive(null)} onEarn={(n, l) => earnCoins(n, l)} />;
  }

  return (
    <div className="rp-screen" data-testid="circles-screen">
      <div style={{ padding: "18px 18px 12px", display: "flex", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: "var(--rp-ink)", margin: 0 }}>
            Paisa Circles
          </h1>
          <div style={{ fontSize: 13, color: "var(--rp-ink-soft)", marginTop: 4 }}>
            Dosto ke saath save karo, smart tarike se
          </div>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          style={{
            width: 44, height: 44, borderRadius: 999, background: "var(--rp-yellow)",
            border: "none", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 6px 20px rgba(246,225,0,0.4)",
          }}
          data-testid="new-circle-btn"
        >
          <Plus size={22} color="var(--rp-deep)" />
        </button>
      </div>

      {circles.length === 0 ? (
        <div className="rp-section" style={{ marginTop: 40 }}>
          <div className="rp-card-white" style={{ textAlign: "center", padding: 32 }}>
            <div style={{ fontSize: 64, marginBottom: 10 }}>👥</div>
            <div className="font-display" style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
              Abhi koi circle nahi hai
            </div>
            <div style={{ fontSize: 14, color: "var(--rp-ink-soft)", marginBottom: 18 }}>
              Apne dosto ya family ke saath circle banao. Har mahine pooled savings.
            </div>
            <button className="rp-btn-primary" onClick={() => setCreateOpen(true)}>
              + Naya Circle Banao
            </button>
          </div>
        </div>
      ) : (
        <div className="rp-section" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {circles.map(c => (
            <CircleCard key={c.id} c={c} onOpen={() => setActive(c.id)} />
          ))}
        </div>
      )}

      {createOpen && (
        <CreateCircleSheet
          onClose={() => setCreateOpen(false)}
          onCreate={(data) => {
            addCircle(data);
            setCreateOpen(false);
            earnCoins(150, "Naya circle banaya");
            triggerConfetti();
          }}
        />
      )}
    </div>
  );
}

function CircleCard({ c, onOpen }) {
  const pool = c.members * c.monthlyContribution;
  const progressPct = Math.round((c.currentMonth / c.totalMonths) * 100);
  return (
    <div className="rp-card-purple rp-slide-up" onClick={onOpen} style={{ cursor: "pointer" }} data-testid={`circle-card-${c.id}`}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 28 }}>{c.goalEmoji}</div>
        <div style={{ flex: 1 }}>
          <div className="font-display" style={{ fontSize: 18, fontWeight: 800 }}>{c.name}</div>
          <div style={{ fontSize: 12, color: "var(--rp-lavender)" }}>{c.goal}</div>
        </div>
        <StatusPillDark status={c.status} />
      </div>

      <div style={{ fontSize: 13, color: "var(--rp-lavender)", marginBottom: 12 }}>
        {c.members} members · ₹{c.monthlyContribution.toLocaleString("en-IN")}/month ·
        <b style={{ color: "var(--rp-yellow)" }}> ₹{pool.toLocaleString("en-IN")} pool</b>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <AvatarGroup members={c.memberList} max={4} />
        <div style={{ fontSize: 12, color: "var(--rp-muted)" }}>
          {c.memberList.length > 4 ? `+${c.memberList.length - 4} aur log` : ""}
        </div>
      </div>

      <div className="rp-bar-dark">
        <div className="rp-bar-fill-yellow" style={{ width: `${progressPct}%` }} />
      </div>
      <div style={{ fontSize: 11, color: "var(--rp-muted)", marginTop: 6, display: "flex", justifyContent: "space-between" }}>
        <span>Month {c.currentMonth} / {c.totalMonths}</span>
        <span>{progressPct}% complete</span>
      </div>
    </div>
  );
}

function StatusPillDark({ status }) {
  const map = {
    bidding_open: { label: "🟡 Bidding Open", bg: "rgba(246,225,0,0.2)", color: "#F6E100" },
    active: { label: "🟢 Active", bg: "rgba(34,197,94,0.2)", color: "#4ADE80" },
    completed: { label: "🔴 Completed", bg: "rgba(255,77,107,0.2)", color: "#FF6B6B" },
  };
  const m = map[status] || map.active;
  return (
    <div style={{ background: m.bg, color: m.color, padding: "4px 10px", borderRadius: 999, fontSize: 10, fontWeight: 700 }}>
      {m.label}
    </div>
  );
}

function CircleDetail({ circle: c, onBack, onEarn }) {
  const { user, transactions } = useApp();
  const [advice, setAdvice] = useState(null);
  const [adviceLoading, setAdviceLoading] = useState(true);
  const pool = c.members * c.monthlyContribution;
  const [bidAmount, setBidAmount] = useState(Math.round(pool * 0.88));
  const [submitting, setSubmitting] = useState(false);
  const [bidDone, setBidDone] = useState(false);

  const discount = pool - bidAmount;
  const perMember = c.members > 1 ? Math.round(discount / (c.members - 1)) : 0;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ctx = buildContext({ user, transactions, circles: [c], investments: [] });
        const reply = await askRupaiyaAI({
          sessionId: `bid-${c.id}-${Date.now()}`,
          message: `My circle '${c.name}' has ${c.members} members contributing ₹${c.monthlyContribution} per month. Pool is ₹${pool}. Should I bid this month and at what amount?`,
          context: ctx,
          useCase: "bid_advice",
        });
        if (!cancelled) setAdvice(reply);
      } catch {
        if (!cancelled) setAdvice("AI abhi thoda busy hai. Thodi der mein dobara try karo 😅");
      } finally {
        if (!cancelled) setAdviceLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, []);

  const submitBid = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setBidDone(true);
      onEarn(50, "Bid lagayi");
    }, 1400);
  };

  return (
    <div className="rp-screen" data-testid={`circle-detail-${c.id}`}>
      <div style={{ padding: "18px 18px 10px", display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onBack}
          style={{
            background: "#fff", border: "1.5px solid var(--rp-line)",
            width: 40, height: 40, borderRadius: 999, display: "flex",
            alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}
          data-testid="circle-back"
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div className="font-display" style={{ fontSize: 20, fontWeight: 800, color: "var(--rp-ink)" }}>{c.name}</div>
          <div style={{ fontSize: 12, color: "var(--rp-ink-soft)" }}>{c.members} members · {c.goal}</div>
        </div>
      </div>

      {c.status === "bidding_open" && (
        <div className="rp-section" style={{ marginTop: 6 }}>
          <div style={{
            background: "var(--rp-yellow)", color: "var(--rp-deep)", padding: "12px 14px",
            borderRadius: 14, fontSize: 13, fontWeight: 700,
          }} data-testid="bidding-banner">
            🔔 Is mahine ki bidding khuli hai! Jaldi bid lagao.
          </div>
        </div>
      )}

      <div className="rp-section" style={{ marginTop: 12 }}>
        <div className="rp-card-purple" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "var(--rp-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Is mahine ka pool
          </div>
          <div className="font-display" style={{ fontSize: 44, fontWeight: 800, color: "var(--rp-yellow)", lineHeight: 1.1, marginTop: 4 }}>
            ₹{pool.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: 12, color: "var(--rp-lavender)", marginTop: 4 }}>
            Month {c.currentMonth} / {c.totalMonths}
          </div>
        </div>
      </div>

      {/* AI suggestion */}
      <div className="rp-section" style={{ marginTop: 12 }}>
        <div className="rp-card-dark" style={{ borderLeft: "4px solid var(--rp-yellow)" }} data-testid="ai-bid-advice">
          <div style={{ fontSize: 10, fontWeight: 800, color: "var(--rp-yellow)", letterSpacing: "0.08em", marginBottom: 6 }}>
            🤖 RUPAIYA AI SUGGESTION
          </div>
          {adviceLoading ? <SkeletonLines lines={2} /> : (
            <div style={{ fontSize: 14, lineHeight: 1.55, color: "var(--rp-lavender)" }}>{advice}</div>
          )}
        </div>
      </div>

      {/* Bid input */}
      {c.status === "bidding_open" && !bidDone && (
        <>
          <h3 className="rp-h-section">Apni bid lagao</h3>
          <div className="rp-section">
            <div className="rp-card-white">
              <div style={{ fontSize: 12, color: "var(--rp-ink-soft)", marginBottom: 8 }}>
                Bid amount (₹)
              </div>
              <input
                type="number"
                className="rp-input"
                value={bidAmount}
                min={Math.round(pool * 0.8)}
                max={Math.round(pool * 0.98)}
                onChange={e => setBidAmount(Number(e.target.value || 0))}
                data-testid="bid-input"
              />
              <input
                type="range"
                min={Math.round(pool * 0.8)}
                max={Math.round(pool * 0.98)}
                step={100}
                value={bidAmount}
                onChange={e => setBidAmount(Number(e.target.value))}
                style={{ width: "100%", marginTop: 14, accentColor: "#420FAE" }}
                data-testid="bid-slider"
              />
              <div style={{
                marginTop: 14, padding: 14, borderRadius: 12, background: "var(--rp-bg)",
                fontSize: 13, color: "var(--rp-ink)", lineHeight: 1.6,
              }}>
                Aap <b>₹{bidAmount.toLocaleString("en-IN")}</b> bid karte ho →{" "}
                <b style={{ color: "var(--rp-green)" }}>₹{discount.toLocaleString("en-IN")} discount</b>
                {" "}baaki members ko milega — <b>₹{perMember}/member</b>
              </div>
              <button
                className="rp-btn-primary"
                style={{ marginTop: 14 }}
                onClick={submitBid}
                disabled={submitting}
                data-testid="bid-submit"
              >
                {submitting ? "Bid Lag Rahi Hai..." : "Bid Lagao 🎯"}
              </button>
            </div>
          </div>
        </>
      )}

      {bidDone && (
        <div className="rp-section" style={{ marginTop: 12 }}>
          <div style={{
            background: "linear-gradient(135deg, #22C55E, #15803D)",
            color: "#fff", padding: 20, borderRadius: 18, textAlign: "center",
          }} data-testid="bid-success">
            <Check size={40} style={{ marginBottom: 8 }} />
            <div className="font-display" style={{ fontSize: 20, fontWeight: 800 }}>Bid Lag Gayi! ✓</div>
            <div style={{ fontSize: 13, marginTop: 4, opacity: 0.95 }}>
              Result kal raat 12 baje announce hoga
            </div>
          </div>
        </div>
      )}

      {/* Members grid */}
      <h3 className="rp-h-section">Members ka status</h3>
      <div className="rp-section" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {c.memberList.map((m, i) => (
          <div key={i} className="rp-card-white" style={{ padding: 12, display: "flex", alignItems: "center", gap: 10 }} data-testid={`member-${i}`}>
            <div style={{
              width: 36, height: 36, borderRadius: 999, background: m.color,
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700,
            }}>{m.initial}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--rp-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {m.name} {m.isYou ? "(You)" : ""}
              </div>
              <div style={{ fontSize: 11, color: m.paid ? "var(--rp-green)" : "var(--rp-danger)", fontWeight: 700 }}>
                {m.paid ? "✓ Paid" : "⏳ Pending"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Past bids */}
      {c.pastBids?.length > 0 && (
        <>
          <h3 className="rp-h-section">Past bids</h3>
          <div className="rp-section" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {c.pastBids.map((b, i) => (
              <div key={i} className="rp-card-white" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: "var(--rp-bg)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "var(--rp-deep)", fontFamily: "Syne",
                }}>M{b.month}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{b.winner} ne jeeta</div>
                  <div style={{ fontSize: 11, color: "var(--rp-ink-soft)" }}>
                    Bid ₹{b.bidAmount.toLocaleString("en-IN")} · ₹{b.perMember}/member
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--rp-green)" }}>
                  -₹{b.discount}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CreateCircleSheet({ onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(GOAL_OPTIONS[0]);
  const [contribution, setContribution] = useState(2000);
  const [memberCount, setMemberCount] = useState(10);
  const [biddingDay, setBiddingDay] = useState(5);
  const [members, setMembers] = useState([{ name: "You", initial: "Y", paid: true, isYou: true, color: "#F6E100" }]);
  const [phone, setPhone] = useState("");

  const addMember = () => {
    if (!phone || phone.length < 10) return;
    const initial = String.fromCharCode(65 + members.length);
    const colors = ["#FF6B9D", "#22C55E", "#7C3AED", "#06B6D4", "#F59E0B", "#EF4444", "#14B8A6"];
    setMembers([...members, {
      name: `+91 ${phone}`,
      initial,
      paid: false,
      color: colors[members.length % colors.length],
    }]);
    setPhone("");
  };

  const submit = () => {
    const filler = Array.from({ length: Math.max(0, memberCount - members.length) }).map((_, i) => {
      const colors = ["#7C3AED", "#06B6D4", "#F59E0B", "#EF4444", "#14B8A6", "#FF6B9D"];
      return {
        name: `Member ${i + members.length + 1}`,
        initial: String.fromCharCode(65 + ((i + members.length) % 26)),
        paid: false,
        color: colors[i % colors.length],
      };
    });
    onCreate({
      name: name || "Naya Circle",
      goal: goal.label,
      goalEmoji: goal.emoji,
      members: memberCount,
      monthlyContribution: contribution,
      currentMonth: 1,
      totalMonths: memberCount,
      status: "active",
      memberList: [...members, ...filler],
      pastBids: [],
      biddingDay,
    });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      zIndex: 200,
    }} onClick={onClose} data-testid="create-circle-sheet">
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", width: "100%", maxWidth: 430,
          borderRadius: "24px 24px 0 0", padding: 20, maxHeight: "92vh", overflowY: "auto",
          animation: "rpSlideUp 0.35s cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
          <div className="font-display" style={{ fontSize: 20, fontWeight: 800, flex: 1 }}>
            Naya Circle — Step {step}/4
          </div>
          <button onClick={onClose} style={{ background: "var(--rp-bg)", border: "none", width: 34, height: 34, borderRadius: 999, cursor: "pointer" }}>
            <X size={18} color="#1A0A4A" />
          </button>
        </div>

        <div className="rp-bar" style={{ marginBottom: 18 }}>
          <div className="rp-bar-fill" style={{ width: `${step * 25}%` }} />
        </div>

        {step === 1 && (
          <>
            <Field label="Circle Name">
              <input
                className="rp-input"
                placeholder="e.g. Teacher Group, Family Fund"
                value={name}
                onChange={e => setName(e.target.value)}
                data-testid="create-name"
              />
            </Field>
            <Field label="Goal">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {GOAL_OPTIONS.map(g => (
                  <button
                    key={g.label}
                    onClick={() => setGoal(g)}
                    style={{
                      padding: 12, borderRadius: 14,
                      border: goal.label === g.label ? "2px solid var(--rp-deep)" : "1.5px solid var(--rp-line)",
                      background: goal.label === g.label ? "rgba(66,15,174,0.06)" : "#fff",
                      cursor: "pointer", textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 22 }}>{g.emoji}</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{g.label}</div>
                  </button>
                ))}
              </div>
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="Monthly Contribution (₹)">
              <input
                type="number" className="rp-input" value={contribution}
                onChange={e => setContribution(Number(e.target.value || 0))}
                data-testid="create-contribution"
              />
            </Field>
            <Field label={`Members: ${memberCount}`}>
              <input
                type="range" min={5} max={20} value={memberCount}
                onChange={e => setMemberCount(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#420FAE" }}
              />
              <div style={{ fontSize: 13, color: "var(--rp-ink-soft)", marginTop: 4 }}>
                {memberCount} × ₹{contribution} = <b>₹{(memberCount * contribution).toLocaleString("en-IN")} pool</b> · {memberCount} months
              </div>
            </Field>
            <Field label="Bidding Day">
              <select className="rp-input" value={biddingDay} onChange={e => setBiddingDay(Number(e.target.value))}>
                {[1, 5, 10, 15, 20].map(d => <option key={d} value={d}>{d}th of month</option>)}
              </select>
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <Field label="Invite members">
              <button
                style={{
                  background: "#25D366", color: "#fff", border: "none",
                  padding: 14, borderRadius: 12, fontWeight: 700, width: "100%", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
                onClick={() => {
                  const url = `https://wa.me/?text=${encodeURIComponent(`Join my RUPAIYA circle "${name || "My Circle"}" — ₹${contribution}/month. Download app & use code RAMESH42.`)}`;
                  window.open(url, "_blank");
                }}
              >
                <MessageSquareShare size={18} /> Invite via WhatsApp
              </button>
            </Field>
            <Field label="Or add manually">
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  className="rp-input" placeholder="10-digit mobile"
                  value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                />
                <button className="rp-btn-outline" style={{ width: "auto", padding: "0 18px" }} onClick={addMember}>
                  Add
                </button>
              </div>
            </Field>
            <div style={{ fontSize: 13, color: "var(--rp-ink-soft)", marginBottom: 8 }}>
              {members.length} / {memberCount} added
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {members.map((m, i) => (
                <div key={i} style={{
                  padding: "6px 12px", background: "var(--rp-bg)", borderRadius: 999,
                  fontSize: 12, display: "flex", alignItems: "center", gap: 6,
                }}>
                  {m.name}
                  {!m.isYou && (
                    <X size={12} style={{ cursor: "pointer" }}
                      onClick={() => setMembers(members.filter((_, x) => x !== i))} />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="rp-card-white" style={{ background: "var(--rp-bg)", marginBottom: 14 }}>
              <Row label="Circle" value={name || "Naya Circle"} />
              <Row label="Goal" value={`${goal.emoji} ${goal.label}`} />
              <Row label="Members" value={memberCount} />
              <Row label="Monthly" value={`₹${contribution.toLocaleString("en-IN")}`} />
              <Row label="Pool" value={`₹${(memberCount * contribution).toLocaleString("en-IN")}`} />
              <Row label="Duration" value={`${memberCount} months`} />
              <Row label="Bidding" value={`${biddingDay}th of month`} />
            </div>
            <div className="rp-card-dark" style={{ fontSize: 13, lineHeight: 1.6 }}>
              🛡️ <b>2% micro-insurance</b> pool aapke paise ki raksha karega. Agar koi member default kare toh bhi aapka paisa safe hai.
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          {step > 1 && (
            <button className="rp-btn-outline" onClick={() => setStep(step - 1)}>← Wapas</button>
          )}
          <button
            className="rp-btn-primary"
            onClick={() => (step < 4 ? setStep(step + 1) : submit())}
            disabled={step === 1 && !name.trim()}
            data-testid={`create-step-${step}-next`}
          >
            <span>{step < 4 ? "Aage" : "Circle Shuru Karo 🚀"}</span>
            {step < 4 && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--rp-ink-soft)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
      {children}
    </div>
  );
}
function Row({ label, value }) {
  return (
    <div style={{ display: "flex", padding: "8px 0", borderBottom: "1px solid var(--rp-line)", fontSize: 14 }}>
      <div style={{ flex: 1, color: "var(--rp-ink-soft)" }}>{label}</div>
      <div style={{ fontWeight: 700, color: "var(--rp-ink)" }}>{value}</div>
    </div>
  );
}
