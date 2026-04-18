import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { BADGES, LANGUAGE_OPTIONS } from "../../data/mockData";
import { nextMilestone } from "../../utils/gamification";
import { Bell, Globe, Lock, LifeBuoy, Star, LogOut, Edit2, Copy, MessageSquareShare, ChevronRight, X, Check } from "lucide-react";

export default function ProfileScreen() {
  const nav = useNavigate();
  const { user, setUser, circles, investments, clearAll } = useApp();
  const [copied, setCopied] = useState(false);
  const [sheet, setSheet] = useState(null); // "lang" | "privacy" | "help" | "rate" | "edit" | null
  const [toastMsg, setToastMsg] = useState(null);

  const milestone = nextMilestone(user.coins);
  const milePct = Math.min(100, Math.round((user.coins / milestone.coins) * 100));
  const totalInvested = investments.reduce((s, i) => s + i.invested, 0);

  const copyCode = () => {
    navigator.clipboard.writeText(user.referralCode || "RAMESH42");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
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
            <button
              onClick={() => setSheet("edit")}
              style={{
              background: "rgba(255,255,255,0.12)", border: "none", width: 36, height: 36, borderRadius: 999,
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}
              data-testid="profile-edit">
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
        <div onClick={() => nav("/notifications")} data-testid="settings-notifications">
          <SettingRow icon={<Bell size={18} />} label="Notifications" />
        </div>
        <div onClick={() => setSheet("lang")} data-testid="settings-language">
          <SettingRow icon={<Globe size={18} />} label="Language" right={<span style={{ fontSize: 12, color: "var(--rp-ink-soft)" }}>{user.languages?.[0] || "Hindi"} ✓</span>} />
        </div>
        <div onClick={() => setSheet("privacy")} data-testid="settings-privacy">
          <SettingRow icon={<Lock size={18} />} label="Privacy" />
        </div>
        <div onClick={() => setSheet("help")} data-testid="settings-help">
          <SettingRow icon={<LifeBuoy size={18} />} label="Help & Support" />
        </div>
        <div onClick={() => setSheet("rate")} data-testid="settings-rate">
          <SettingRow icon={<Star size={18} />} label="Rate RUPAIYA" />
        </div>
        <div onClick={clearAll} data-testid="logout-btn">
          <SettingRow icon={<LogOut size={18} color="#FF4D6B" />} label="Logout & Reset" textColor="#FF4D6B" />
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: 11, color: "var(--rp-ink-soft)", padding: 20 }}>
        RUPAIYA v1.0 · Bharat first 🇮🇳
      </div>

      {sheet === "lang" && (
        <BottomSheet title="Language Chunein" onClose={() => setSheet(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {LANGUAGE_OPTIONS.map(l => {
              const active = (user.languages || [])[0] === l;
              return (
                <div
                  key={l}
                  onClick={() => {
                    setUser(prev => ({ ...prev, languages: [l, ...(prev.languages || []).filter(x => x !== l)] }));
                    setSheet(null);
                    showToast(`Language set to ${l}`);
                  }}
                  className="rp-card-white"
                  style={{
                    padding: 14, display: "flex", alignItems: "center", cursor: "pointer",
                    background: active ? "rgba(66,15,174,0.06)" : "#fff",
                    borderLeft: active ? "4px solid var(--rp-deep)" : "none",
                  }}
                  data-testid={`lang-opt-${l}`}
                >
                  <div style={{ flex: 1, fontWeight: 600 }}>{l}</div>
                  {active && <Check size={18} color="#420FAE" />}
                </div>
              );
            })}
          </div>
        </BottomSheet>
      )}

      {sheet === "privacy" && (
        <BottomSheet title="Privacy & Security" onClose={() => setSheet(null)}>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--rp-ink)" }}>
            <p>🔒 <b>End-to-end encrypted:</b> Aapke circle aur transaction data safe hain.</p>
            <p>🇮🇳 <b>India mein stored:</b> Data sirf Indian servers pe save hota hai.</p>
            <p>🚫 <b>Never sold:</b> Hum kabhi bhi aapka data kisi ko nahi bechenge.</p>
            <p>💡 <b>Full control:</b> Kabhi bhi apna data delete kar sakte ho — Logout & Reset se.</p>
          </div>
          <button className="rp-btn-primary" style={{ marginTop: 14 }} onClick={() => setSheet(null)}>Samjh gaya ✓</button>
        </BottomSheet>
      )}

      {sheet === "help" && (
        <BottomSheet title="Help & Support" onClose={() => setSheet(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <HelpLink emoji="💬" label="Chat with RUPAIYA AI" desc="24x7 help in Hinglish" onClick={() => { setSheet(null); nav("/ai"); }} />
            <HelpLink emoji="📧" label="Email support" desc="help@rupaiya.app" onClick={() => { window.location.href = "mailto:help@rupaiya.app"; }} />
            <HelpLink emoji="📞" label="Call us" desc="+91 98765 43210 · 9AM-9PM" onClick={() => { window.location.href = "tel:+919876543210"; }} />
            <HelpLink emoji="❓" label="FAQs" desc="Sabse common sawaal" onClick={() => showToast("FAQ coming soon!")} />
          </div>
        </BottomSheet>
      )}

      {sheet === "rate" && (
        <BottomSheet title="Rate RUPAIYA" onClose={() => setSheet(null)}>
          <StarRater onDone={(rating) => { setSheet(null); showToast(`Thanks! ${rating}⭐ rating mili — +25 coins!`); }} />
        </BottomSheet>
      )}

      {sheet === "edit" && (
        <EditProfileSheet user={user} onSave={(u) => { setUser(prev => ({ ...prev, ...u })); setSheet(null); showToast("Profile update ho gayi ✓"); }} onClose={() => setSheet(null)} />
      )}

      {toastMsg && (
        <div style={{
          position: "absolute", bottom: 88, left: "50%", transform: "translateX(-50%)",
          background: "var(--rp-deep)", color: "#fff", padding: "10px 18px",
          borderRadius: 999, fontSize: 13, fontWeight: 600, zIndex: 500,
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          animation: "rpSlideUp 0.3s ease",
        }} data-testid="profile-toast">
          {toastMsg}
        </div>
      )}
    </div>
  );
}

function BottomSheet({ title, onClose, children }) {
  return (
    <div
      style={{
        position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "flex-end", zIndex: 400,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", width: "100%", borderRadius: "24px 24px 0 0",
          padding: 20, maxHeight: "78%", overflowY: "auto",
          animation: "rpSlideUp 0.3s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
          <div className="font-display" style={{ fontSize: 20, fontWeight: 800, flex: 1 }}>{title}</div>
          <button onClick={onClose} style={{
            background: "var(--rp-bg)", border: "none", width: 32, height: 32,
            borderRadius: 999, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function HelpLink({ emoji, label, desc, onClick }) {
  return (
    <div onClick={onClick} className="rp-card-white" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
      <div style={{ fontSize: 24 }}>{emoji}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--rp-ink-soft)" }}>{desc}</div>
      </div>
      <ChevronRight size={18} color="var(--rp-ink-soft)" />
    </div>
  );
}

function StarRater({ onDone }) {
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(0);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 14, color: "var(--rp-ink-soft)", marginBottom: 14 }}>
        Aapka experience kaisa raha?
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 18 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => setSelected(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 36, padding: 0, transition: "transform 0.15s" }}
            data-testid={`star-${n}`}
          >
            <Star
              size={40}
              fill={(hover || selected) >= n ? "#F6E100" : "none"}
              color={(hover || selected) >= n ? "#F6E100" : "#CBD5E1"}
            />
          </button>
        ))}
      </div>
      <button
        className="rp-btn-primary"
        disabled={!selected}
        onClick={() => onDone(selected)}
        data-testid="rate-submit"
      >
        Submit Rating
      </button>
    </div>
  );
}

function EditProfileSheet({ user, onSave, onClose }) {
  const [name, setName] = useState(user.name);
  const [city, setCity] = useState(user.city);
  return (
    <BottomSheet title="Edit Profile" onClose={onClose}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--rp-ink-soft)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Naam</div>
        <input className="rp-input" value={name} onChange={e => setName(e.target.value)} data-testid="edit-name" />
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--rp-ink-soft)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>City</div>
        <input className="rp-input" value={city} onChange={e => setCity(e.target.value)} data-testid="edit-city" />
      </div>
      <button className="rp-btn-primary" onClick={() => onSave({ name: name.trim() || user.name, city: city.trim() || user.city, avatar: (name.trim() || user.name)[0]?.toUpperCase() })} data-testid="edit-save">
        Save Karo ✓
      </button>
    </BottomSheet>
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
