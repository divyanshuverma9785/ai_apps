import React, { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import TopBar from "../../components/TopBar";
import { Search, Plus, X } from "lucide-react";

const CATEGORIES = [
  { label: "Food", emoji: "🍕" },
  { label: "Transport", emoji: "🛵" },
  { label: "Groceries", emoji: "🛒" },
  { label: "Bills", emoji: "⚡" },
  { label: "Entertainment", emoji: "🎬" },
  { label: "Health", emoji: "💊" },
  { label: "EMI", emoji: "🏦" },
  { label: "Transfer", emoji: "📱" },
];

export default function TransactionsScreen() {
  const { transactions, addTransaction } = useApp();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filter === "this") {
      const m = new Date().getMonth();
      list = list.filter(t => new Date(t.date).getMonth() === m);
    } else if (filter === "last") {
      const m = new Date().getMonth() - 1;
      list = list.filter(t => new Date(t.date).getMonth() === m);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(t => t.merchant.toLowerCase().includes(s) || String(t.amount).includes(s));
    }
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filter, search]);

  // Group by date
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(t => {
      const key = t.date;
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [filtered]);

  return (
    <div className="rp-screen" data-testid="transactions-screen">
      <TopBar title="Mere Transactions" />

      <div
        className="rp-hide-scroll"
        style={{ padding: "0 18px 12px", display: "flex", gap: 8, overflowX: "auto" }}
      >
        <button className={`rp-pill ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")} data-testid="filter-all">Sab</button>
        <button className={`rp-pill ${filter === "this" ? "active" : ""}`} onClick={() => setFilter("this")} data-testid="filter-this">Is Mahine</button>
        <button className={`rp-pill ${filter === "last" ? "active" : ""}`} onClick={() => setFilter("last")} data-testid="filter-last">Pichle Mahine</button>
      </div>

      <div className="rp-section" style={{ marginBottom: 12 }}>
        <div style={{ position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--rp-ink-soft)" }} />
          <input
            className="rp-input"
            style={{ paddingLeft: 40 }}
            placeholder="Merchant ya amount khojein..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            data-testid="tx-search"
          />
        </div>
      </div>

      <div className="rp-section" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {Object.keys(grouped).length === 0 && (
          <div className="rp-card-white" style={{ textAlign: "center", padding: 24 }}>
            <div style={{ fontSize: 44 }}>🔍</div>
            <div style={{ fontWeight: 600, marginTop: 6 }}>Kuch nahi mila</div>
          </div>
        )}
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <div style={{ fontSize: 12, color: "var(--rp-ink-soft)", marginBottom: 6, fontWeight: 600 }}>
              {formatDateLabel(date)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map(t => (
                <div
                  key={t.id}
                  className="rp-card-white"
                  style={{ padding: 12, display: "flex", alignItems: "center", gap: 12 }}
                  data-testid={`tx-${t.id}`}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, background: "var(--rp-bg)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                  }}>{t.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: "var(--rp-ink)", fontSize: 14 }}>{t.merchant}</div>
                    <div style={{ fontSize: 11, color: "var(--rp-ink-soft)" }}>{t.category}</div>
                  </div>
                  <div className="font-display" style={{ fontSize: 16, fontWeight: 800, color: t.type === "debit" ? "var(--rp-danger)" : "var(--rp-green)" }}>
                    {t.type === "debit" ? "-" : "+"}₹{Math.abs(t.amount).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => setAddOpen(true)}
        style={{
          position: "absolute", bottom: 88, right: 20, width: 56, height: 56,
          borderRadius: 999, background: "var(--rp-yellow)", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          boxShadow: "0 10px 30px rgba(246,225,0,0.5)", zIndex: 20,
        }}
        data-testid="fab-add-tx"
      >
        <Plus size={26} color="var(--rp-deep)" />
      </button>

      {addOpen && <AddTxSheet onClose={() => setAddOpen(false)} onAdd={(tx) => {
        addTransaction(tx);
        setAddOpen(false);
      }} />}
    </div>
  );
}

function formatDateLabel(date) {
  const d = new Date(date);
  const today = new Date();
  const yest = new Date(); yest.setDate(yest.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Aaj";
  if (d.toDateString() === yest.toDateString()) return "Kal";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long" });
}

function AddTxSheet({ onClose, onAdd }) {
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState(CATEGORIES[0]);
  const [merchant, setMerchant] = useState("");
  const [note, setNote] = useState("");

  const submit = () => {
    if (!amount || !merchant.trim()) return;
    onAdd({
      merchant: merchant.trim(),
      category: cat.label,
      emoji: cat.emoji,
      amount: -Math.abs(Number(amount)),
      date: new Date().toISOString().slice(0, 10),
      type: "debit",
      note,
    });
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 200,
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", width: "100%", maxWidth: 430,
          borderRadius: "24px 24px 0 0", padding: 20,
          animation: "rpSlideUp 0.3s ease",
        }}
        data-testid="add-tx-sheet"
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <div className="font-display" style={{ fontSize: 20, fontWeight: 800, flex: 1 }}>
            Naya kharcha
          </div>
          <button onClick={onClose} style={{ background: "var(--rp-bg)", border: "none", width: 32, height: 32, borderRadius: 999, cursor: "pointer" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: "var(--rp-ink-soft)" }}>Amount (₹)</div>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{
              border: "none", outline: "none", fontSize: 42, fontWeight: 800,
              fontFamily: "Syne", color: "var(--rp-deep)", textAlign: "center",
              width: "100%", background: "transparent", marginTop: 4,
            }}
            placeholder="0"
            data-testid="add-amount"
          />
        </div>

        <div style={{ fontSize: 12, color: "var(--rp-ink-soft)", marginBottom: 8, fontWeight: 600 }}>Category</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
          {CATEGORIES.map(c => (
            <button
              key={c.label}
              onClick={() => setCat(c)}
              style={{
                padding: "10px 4px", borderRadius: 12,
                border: cat.label === c.label ? "2px solid var(--rp-deep)" : "1.5px solid var(--rp-line)",
                background: cat.label === c.label ? "rgba(66,15,174,0.06)" : "#fff",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 20 }}>{c.emoji}</div>
              <div style={{ fontSize: 10, fontWeight: 600, marginTop: 2 }}>{c.label}</div>
            </button>
          ))}
        </div>

        <input
          className="rp-input"
          placeholder="Kahan kharcha kiya? (e.g. Swiggy)"
          value={merchant}
          onChange={e => setMerchant(e.target.value)}
          style={{ marginBottom: 10 }}
          data-testid="add-merchant"
        />
        <input
          className="rp-input"
          placeholder="Note (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
        />

        <button className="rp-btn-primary" style={{ marginTop: 16 }} onClick={submit} data-testid="add-tx-submit">
          Save Karo ✓
        </button>
      </div>
    </div>
  );
}
