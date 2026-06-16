import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = BACKEND_URL ? `${BACKEND_URL}/api` : null;

export async function askRupaiyaAI({ sessionId, message, context, useCase = "chat" }) {
  if (!API) {
    // Graceful fallback when backend is not deployed
    return "Abhi AI backend connect nahi hai 🛠️ Lekin aap app explore kar sakte ho — circles, investments, transactions sab dekho! Backend jald aa raha hai ✨";
  }
  const payload = {
    session_id: sessionId,
    message,
    context: context || null,
    use_case: useCase,
  };
  try {
    const { data } = await axios.post(`${API}/chat`, payload, { timeout: 30000 });
    return data.reply;
  } catch (err) {
    console.error("AI chat error:", err);
    return "Oops! Server se baat nahi ho payi 😅 Thodi der baad try karo.";
  }
}


export function buildContext({ user, transactions, circles, investments }) {
  const debits = (transactions || []).filter(t => t.type === "debit");
  const totalSpent = debits.reduce((s, t) => s + Math.abs(t.amount), 0);
  const topCategories = {};
  debits.forEach(t => {
    topCategories[t.category] = (topCategories[t.category] || 0) + Math.abs(t.amount);
  });
  const topSorted = Object.fromEntries(
    Object.entries(topCategories).sort((a, b) => b[1] - a[1]).slice(0, 3)
  );
  return {
    name: user?.name,
    city: user?.city,
    income: user?.income,
    goal: user?.goal,
    goalAmount: user?.goalAmount,
    savedAmount: user?.savedAmount,
    totalSpent,
    topCategories: topSorted,
    circlesCount: (circles || []).length,
    monthlyCommitment: (circles || []).reduce((s, c) => s + c.monthlyContribution, 0),
    totalInvested: (investments || []).reduce((s, i) => s + i.invested, 0),
  };
}
