import React, { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Mic } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { askRupaiyaAI, buildContext } from "../../utils/api";
import { ChatDots } from "../../components/SkeletonLoader";

const QUICK_CHIPS = [
  { text: "Mera budget batao", emoji: "💰" },
  { text: "Circle advice do", emoji: "⭕" },
  { text: "Best investment mere liye?", emoji: "📈" },
  { text: "Kharch kahan gaya?", emoji: "💸" },
  { text: "Goal track karo", emoji: "🎯" },
];

export default function AIChatScreen() {
  const { user, transactions, circles, investments } = useApp();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceToast, setVoiceToast] = useState(false);
  const scrollerRef = useRef(null);
  const sessionId = useRef(`chat-${user.name}-${Date.now()}`);

  useEffect(() => {
    setMessages([
      {
        from: "ai",
        text: `Namaste ${user.name.split(" ")[0]} ji! 🙏 Main RUPAIYA hoon — aapka personal AI money advisor. Mujhse puchh sakte ho:
• Kitna save karna chahiye?
• Circle mein kab bid lagaun?
• Kaunsa investment best hai mere liye?
• Is mahine ka budget kya ho?

Batao kya jaanna chahte ho! 😊`,
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { from: "user", text: msg, time }]);
    setInput("");
    setLoading(true);
    try {
      const ctx = buildContext({ user, transactions, circles, investments });
      const reply = await askRupaiyaAI({
        sessionId: sessionId.current,
        message: msg,
        context: ctx,
        useCase: "chat",
      });
      setMessages(prev => [...prev, {
        from: "ai", text: reply,
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        from: "ai", text: "Network issue! Thodi der mein try karo 😊",
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const showVoice = () => {
    setVoiceToast(true);
    setTimeout(() => setVoiceToast(false), 1800);
  };

  return (
    <div
      className="rp-screen"
      style={{
        background: "linear-gradient(180deg, #2A0A8C 0%, #420FAE 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: 0,
        flex: 1,
        minHeight: 0,
        position: "relative",
      }}
      data-testid="ai-chat-screen"
    >
      {/* Header */}
      <div style={{
        padding: "18px 18px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center", gap: 12,
        position: "sticky", top: 0,
        background: "rgba(42,10,140,0.95)", backdropFilter: "blur(10px)",
        zIndex: 10,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 999, background: "var(--rp-yellow)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "var(--rp-deep)",
        }}>
          <Sparkles size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>RUPAIYA AI</div>
          <div style={{ fontSize: 12, color: "var(--rp-lavender)", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--rp-green)", boxShadow: "0 0 6px var(--rp-green)" }} />
            Online · Hinglish support
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div
        ref={scrollerRef}
        className="rp-hide-scroll"
        style={{ flex: 1, overflowY: "auto", padding: "16px 14px 140px" }}
      >
        {messages.map((m, i) => <Bubble key={i} m={m} />)}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginTop: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--rp-yellow)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--rp-deep)" }}>
              <Sparkles size={15} />
            </div>
            <div style={{ background: "var(--rp-dark)", padding: "14px 16px", borderRadius: "16px 16px 16px 4px" }}>
              <ChatDots />
            </div>
          </div>
        )}
      </div>

      {/* Quick chips (only before first user message) */}
      {messages.filter(m => m.from === "user").length === 0 && (
        <div
          className="rp-hide-scroll"
          style={{
            position: "absolute", bottom: 76, left: 0, right: 0,
            padding: "0 14px 8px", display: "flex", gap: 8, overflowX: "auto",
          }}
        >
          {QUICK_CHIPS.map(c => (
            <button
              key={c.text}
              onClick={() => send(c.text)}
              style={{
                flexShrink: 0,
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "9px 14px",
                borderRadius: 999,
                fontSize: 13,
                cursor: "pointer",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
              data-testid={`chip-${c.emoji}`}
            >
              {c.emoji} {c.text}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div style={{
        flexShrink: 0,
        padding: "12px 14px", background: "rgba(42,10,140,0.95)",
        backdropFilter: "blur(10px)", borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex", gap: 8, alignItems: "center",
      }}>
        <button
          onClick={showVoice}
          style={{
            width: 42, height: 42, borderRadius: 999,
            background: "rgba(255,255,255,0.1)", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", cursor: "pointer",
          }}
          data-testid="chat-mic"
        >
          <Mic size={18} />
        </button>
        <input
          className="rp-input rp-input-dark"
          style={{ borderRadius: 999, padding: "12px 18px" }}
          placeholder="Kuch bhi puchho paisa ke baare mein..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          data-testid="chat-input"
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          style={{
            width: 46, height: 46, borderRadius: 999,
            background: input.trim() ? "var(--rp-yellow)" : "rgba(255,255,255,0.15)",
            color: "var(--rp-deep)", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: input.trim() ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
          }}
          data-testid="chat-send"
        >
          <Send size={18} />
        </button>
      </div>

      {voiceToast && (
        <div style={{
          position: "absolute", bottom: 90, left: "50%", transform: "translateX(-50%)",
          background: "#fff", color: "var(--rp-deep)", padding: "10px 18px",
          borderRadius: 999, fontSize: 13, fontWeight: 600,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)", zIndex: 100,
        }}>
          🎤 Voice input coming soon!
        </div>
      )}
    </div>
  );
}

function Bubble({ m }) {
  const isAI = m.from === "ai";
  return (
    <div style={{
      display: "flex", gap: 8, alignItems: "flex-end",
      justifyContent: isAI ? "flex-start" : "flex-end",
      marginBottom: 10,
    }} className="rp-slide-up">
      {isAI && (
        <div style={{
          width: 26, height: 26, borderRadius: "50%", background: "var(--rp-yellow)",
          display: "flex", alignItems: "center", justifyContent: "center", color: "var(--rp-deep)", flexShrink: 0,
        }}>
          <Sparkles size={14} />
        </div>
      )}
      <div style={{
        maxWidth: "78%",
        background: isAI ? "var(--rp-dark)" : "var(--rp-yellow)",
        color: isAI ? "var(--rp-lavender)" : "var(--rp-deep)",
        padding: "12px 16px",
        borderRadius: isAI ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
        fontSize: 14,
        lineHeight: 1.55,
        whiteSpace: "pre-wrap",
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
      }}>
        {m.text}
        <div style={{ fontSize: 10, opacity: 0.5, marginTop: 4, textAlign: isAI ? "left" : "right" }}>
          {m.time}
        </div>
      </div>
    </div>
  );
}
