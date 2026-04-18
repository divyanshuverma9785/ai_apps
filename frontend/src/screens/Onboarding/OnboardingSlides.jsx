import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { INCOME_OPTIONS, LANGUAGE_OPTIONS, GOAL_OPTIONS } from "../../data/mockData";
import { ChevronRight } from "lucide-react";

const SLIDES = [
  {
    badge: "₹",
    title: "RUPAIYA",
    sub: "Paisa samjho. Paisa badhao.",
    body: "India's smartest AI money companion. Built for the way Bharat saves.",
    cta: "Shuru Karein",
  },
  {
    title: "Teen cheezein jo paisa badlati hain",
    cards: [
      { icon: "🪞", heading: "DHAN DARPAN", desc: "AI aapka kharch track karta hai — bina kuch likhe" },
      { icon: "⭕", heading: "PAISA CIRCLE", desc: "Dosto ke saath committee — digital, safe, smart" },
      { icon: "🌱", heading: "MUNAFA ENGINE", desc: "Bachat apne aap invest ho jaati hai" },
    ],
    cta: "Aage Badhein",
  },
  {
    title: "Har smart move pe reward",
    stats: [
      { value: "₹50", label: "Circle contribution" },
      { value: "₹200", label: "Savings goal beat" },
      { value: "₹500", label: "3-month streak" },
    ],
    body: "Rupaiya Coins collect karo. Circle fees maaf karwao. Cashback pao.",
    cta: "Account Banao",
  },
];

export default function OnboardingSlides() {
  const [idx, setIdx] = useState(0);
  const [setupMode, setSetupMode] = useState(false);
  const touchStartX = React.useRef(null);
  const nav = useNavigate();

  if (setupMode) return <SetupForm onDone={() => nav("/home")} />;

  const slide = SLIDES[idx];

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0 && idx < SLIDES.length - 1) setIdx(idx + 1);
      else if (dx > 0 && idx > 0) setIdx(idx - 1);
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="rp-screen"
      style={{
        flex: 1,
        minHeight: "100%",
        background: "linear-gradient(180deg, #2A0A8C 0%, #420FAE 50%, #5A1FD1 100%)",
        color: "#fff",
        padding: "0 20px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        touchAction: "pan-y",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      data-testid={`onboarding-slide-${idx}`}
    >
      {/* Floating decorative circles */}
      <DecorBg />

      <div style={{ paddingTop: 64, paddingBottom: 20, flex: 1, display: "flex", flexDirection: "column" }}>
        {idx === 0 && (
          <div style={{ textAlign: "center", marginTop: 40 }} className="rp-slide-up">
            <div
              className="rp-float"
              style={{
                width: 120, height: 120, margin: "0 auto 28px",
                borderRadius: "50%", background: "var(--rp-yellow)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 60px rgba(246,225,0,0.5)",
                color: "#2A0A8C", fontFamily: "Syne", fontWeight: 800, fontSize: 68,
              }}
            >
              ₹
            </div>
            <h1 className="font-display" style={{ fontSize: 48, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
              {slide.title}
            </h1>
            <div style={{ fontSize: 18, color: "var(--rp-yellow)", fontWeight: 600, marginBottom: 20 }}>
              {slide.sub}
            </div>
            <p style={{ fontSize: 15, color: "var(--rp-lavender)", maxWidth: 300, margin: "0 auto", lineHeight: 1.55 }}>
              {slide.body}
            </p>
          </div>
        )}

        {idx === 1 && (
          <div className="rp-slide-up" style={{ marginTop: 8 }}>
            <h2 className="font-display" style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.15, marginBottom: 26 }}>
              {slide.title}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {slide.cards.map((c, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderLeft: "4px solid var(--rp-yellow)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 16,
                    padding: 18,
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                    animation: `rpSlideUp 0.5s ease ${i * 0.08}s both`,
                  }}
                >
                  <div style={{ fontSize: 36 }}>{c.icon}</div>
                  <div>
                    <div className="font-display" style={{ fontSize: 16, fontWeight: 800, color: "var(--rp-yellow)", letterSpacing: "0.05em" }}>
                      {c.heading}
                    </div>
                    <div style={{ fontSize: 14, color: "var(--rp-lavender)", marginTop: 4, lineHeight: 1.5 }}>
                      {c.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {idx === 2 && (
          <div className="rp-slide-up" style={{ marginTop: 12, textAlign: "center" }}>
            <div style={{ fontSize: 68, marginBottom: 16, filter: "drop-shadow(0 8px 40px rgba(246,225,0,0.5))" }}>🏆</div>
            <h2 className="font-display" style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.15, marginBottom: 28 }}>
              {slide.title}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
              {slide.stats.map((s, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 16, padding: "16px 8px",
                  animation: `rpSlideUp 0.4s ease ${i * 0.1}s both`,
                }}>
                  <div className="font-display" style={{ fontSize: 26, fontWeight: 800, color: "var(--rp-yellow)" }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--rp-muted)", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 15, color: "var(--rp-lavender)", lineHeight: 1.55 }}>{slide.body}</p>
          </div>
        )}
      </div>

      {/* Dots - clickable */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
        {SLIDES.map((_, i) => (
          <div
            key={i}
            onClick={() => setIdx(i)}
            style={{
              width: i === idx ? 28 : 8,
              height: 8,
              background: i === idx ? "var(--rp-yellow)" : "rgba(255,255,255,0.3)",
              borderRadius: 999,
              transition: "width 0.3s ease",
              cursor: "pointer",
            }}
            data-testid={`onboarding-dot-${i}`}
          />
        ))}
      </div>

      <div style={{ padding: "0 0 28px" }}>
        <button
          className="rp-btn-primary"
          onClick={() => (idx < SLIDES.length - 1 ? setIdx(idx + 1) : setSetupMode(true))}
          data-testid={`onboarding-cta-${idx}`}
        >
          <span>{slide.cta}</span>
          <ChevronRight size={18} />
        </button>
        {idx < SLIDES.length - 1 && (
          <button
            onClick={() => setSetupMode(true)}
            style={{
              background: "transparent", color: "var(--rp-muted)", border: "none",
              width: "100%", marginTop: 10, padding: 8, fontSize: 13, cursor: "pointer",
            }}
            data-testid="onboarding-skip"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}

function DecorBg() {
  return (
    <>
      <div className="rp-float" style={{
        position: "absolute", top: 80, right: -30, width: 120, height: 120,
        background: "var(--rp-yellow)", opacity: 0.08, borderRadius: "50%", filter: "blur(20px)",
      }} />
      <div style={{
        position: "absolute", bottom: 180, left: -40, width: 160, height: 160,
        background: "#7C3AED", opacity: 0.25, borderRadius: "50%", filter: "blur(30px)",
        animation: "rpFloatY 5s ease-in-out infinite",
      }} />
    </>
  );
}

function SetupForm({ onDone }) {
  const { completeOnboarding } = useApp();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [income, setIncome] = useState("");
  const [city, setCity] = useState("");
  const [langs, setLangs] = useState([]);
  const [goal, setGoal] = useState(null);
  const [error, setError] = useState("");

  const toggleLang = (l) =>
    setLangs(prev => (prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]));

  const submit = () => {
    if (!name.trim() || mobile.length < 10 || !income || !city.trim() || !goal) {
      setError("Saari details bharo please!");
      return;
    }
    completeOnboarding({
      name: name.trim(),
      mobile,
      city: city.trim(),
      income,
      languages: langs.length ? langs : ["Hindi"],
      goal: goal.label,
      goalEmoji: goal.emoji,
      goalAmount: goal.amount,
      avatar: name.trim()[0]?.toUpperCase() || "R",
    });
    onDone();
  };

  return (
    <div
      className="rp-screen"
      style={{
        flex: 1,
        minHeight: "100%",
        overflowY: "auto",
        background: "linear-gradient(180deg, #2A0A8C 0%, #420FAE 100%)",
        color: "#fff",
        padding: "56px 22px 28px",
      }}
      data-testid="onboarding-setup"
    >
      <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
        Apni details bataiye 📝
      </h2>
      <p style={{ fontSize: 14, color: "var(--rp-muted)", marginBottom: 26 }}>
        Sirf ek baar. Aapka data safe hai.
      </p>

      <Field label="Pura Naam">
        <input
          className="rp-input rp-input-dark"
          placeholder="Ramesh Kumar"
          value={name}
          onChange={e => setName(e.target.value)}
          data-testid="setup-name"
        />
      </Field>

      <Field label="Mobile Number">
        <input
          className="rp-input rp-input-dark"
          type="tel"
          maxLength={10}
          placeholder="9876543210"
          value={mobile}
          onChange={e => setMobile(e.target.value.replace(/[^0-9]/g, ""))}
          data-testid="setup-mobile"
        />
      </Field>

      <Field label="Monthly Income">
        <select
          className="rp-input rp-input-dark"
          value={income}
          onChange={e => setIncome(e.target.value)}
          data-testid="setup-income"
        >
          <option value="">Select karo</option>
          {INCOME_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </Field>

      <Field label="Your City">
        <input
          className="rp-input rp-input-dark"
          placeholder="Nashik, Pune, Lucknow..."
          value={city}
          onChange={e => setCity(e.target.value)}
          data-testid="setup-city"
        />
      </Field>

      <Field label="Primary Languages">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {LANGUAGE_OPTIONS.map(l => (
            <button
              key={l}
              type="button"
              className={`rp-pill ${langs.includes(l) ? "active" : ""}`}
              style={{
                background: langs.includes(l) ? "var(--rp-yellow)" : "rgba(255,255,255,0.06)",
                color: langs.includes(l) ? "var(--rp-deep)" : "#fff",
                borderColor: langs.includes(l) ? "var(--rp-yellow)" : "rgba(255,255,255,0.12)",
              }}
              onClick={() => toggleLang(l)}
              data-testid={`setup-lang-${l}`}
            >
              {l}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Savings Goal">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {GOAL_OPTIONS.map(g => (
            <button
              key={g.label}
              type="button"
              onClick={() => setGoal(g)}
              style={{
                padding: "14px 8px",
                borderRadius: 14,
                border: goal?.label === g.label ? "2px solid var(--rp-yellow)" : "1.5px solid rgba(255,255,255,0.1)",
                background: goal?.label === g.label ? "rgba(246,225,0,0.15)" : "rgba(255,255,255,0.04)",
                color: "#fff",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "DM Sans",
                fontWeight: 600,
              }}
              data-testid={`setup-goal-${g.label}`}
            >
              <div style={{ fontSize: 24, marginBottom: 4 }}>{g.emoji}</div>
              {g.label}
            </button>
          ))}
        </div>
      </Field>

      {error && (
        <div style={{ color: "var(--rp-danger)", fontSize: 13, margin: "4px 0 10px" }} className="rp-shake">
          {error}
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button className="rp-btn-primary" onClick={submit} data-testid="setup-submit">
          App Shuru Karo 🚀
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--rp-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </div>
      {children}
    </div>
  );
}
