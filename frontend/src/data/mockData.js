export const DEFAULT_USER = {
  name: "Ramesh Kumar",
  mobile: "9876543210",
  city: "Nashik, Maharashtra",
  languages: ["Hindi", "Marathi"],
  income: "Rs. 25,000 – 50,000",
  goal: "Scooter",
  goalEmoji: "🛵",
  goalAmount: 75000,
  savedAmount: 25400,
  coins: 1250,
  avatar: "R",
  joinDate: "April 2025",
  streak: 3,
  referralCode: "RAMESH42",
};

export const DEFAULT_TRANSACTIONS = [
  { id: 1, merchant: "Chai Point", category: "Food", emoji: "☕", amount: -120, date: "2025-04-15", type: "debit" },
  { id: 2, merchant: "Salary Credit", category: "Income", emoji: "💰", amount: 32000, date: "2025-04-01", type: "credit" },
  { id: 3, merchant: "DMart Nashik", category: "Groceries", emoji: "🛒", amount: -2400, date: "2025-04-14", type: "debit" },
  { id: 4, merchant: "Rapido Ride", category: "Transport", emoji: "🛵", amount: -85, date: "2025-04-14", type: "debit" },
  { id: 5, merchant: "Bajaj EMI", category: "EMI", emoji: "🏦", amount: -3200, date: "2025-04-05", type: "debit" },
  { id: 6, merchant: "Swiggy", category: "Food", emoji: "🍕", amount: -340, date: "2025-04-13", type: "debit" },
  { id: 7, merchant: "Medical Shop", category: "Health", emoji: "💊", amount: -280, date: "2025-04-12", type: "debit" },
  { id: 8, merchant: "PhonePe Transfer", category: "Transfer", emoji: "📱", amount: -5000, date: "2025-04-02", type: "debit" },
  { id: 9, merchant: "Movie Tickets", category: "Entertainment", emoji: "🎬", amount: -600, date: "2025-04-10", type: "debit" },
  { id: 10, merchant: "Electricity Bill", category: "Bills", emoji: "⚡", amount: -850, date: "2025-04-08", type: "debit" },
  { id: 11, merchant: "Tata Tea Store", category: "Food", emoji: "☕", amount: -160, date: "2025-04-11", type: "debit" },
  { id: 12, merchant: "Mobile Recharge", category: "Bills", emoji: "📱", amount: -299, date: "2025-04-07", type: "debit" },
];

export const DEFAULT_CIRCLES = [
  {
    id: 1,
    name: "Teacher Group",
    goal: "Emergency Fund",
    goalEmoji: "🏥",
    members: 8,
    monthlyContribution: 1500,
    currentMonth: 4,
    totalMonths: 8,
    status: "bidding_open",
    biddingDeadline: "2025-04-20T23:59:00",
    memberList: [
      { name: "Ramesh Kumar", initial: "R", paid: true, isYou: true, color: "#F6E100" },
      { name: "Priya Sharma", initial: "P", paid: true, color: "#FF6B9D" },
      { name: "Suresh Patil", initial: "S", paid: true, color: "#22C55E" },
      { name: "Anita Joshi", initial: "A", paid: false, color: "#7C3AED" },
      { name: "Manoj Gupta", initial: "M", paid: true, color: "#06B6D4" },
      { name: "Rekha Devi", initial: "R", paid: true, color: "#F59E0B" },
      { name: "Vikram Rao", initial: "V", paid: false, color: "#EF4444" },
      { name: "Sunita More", initial: "S", paid: true, color: "#14B8A6" },
    ],
    pastBids: [
      { month: 1, winner: "Anita Joshi", bidAmount: 10500, discount: 1500, perMember: 214 },
      { month: 2, winner: "Manoj Gupta", bidAmount: 10800, discount: 1200, perMember: 171 },
      { month: 3, winner: "Suresh Patil", bidAmount: 11000, discount: 1000, perMember: 142 },
    ],
  },
  {
    id: 2,
    name: "Colony Savings",
    goal: "Diwali Fund",
    goalEmoji: "🪔",
    members: 10,
    monthlyContribution: 2000,
    currentMonth: 2,
    totalMonths: 10,
    status: "active",
    memberList: [
      { name: "Ramesh Kumar", initial: "R", paid: true, isYou: true, color: "#F6E100" },
      { name: "Raj Verma", initial: "R", paid: true, color: "#22C55E" },
      { name: "Sunita Devi", initial: "S", paid: false, color: "#7C3AED" },
      { name: "Ashok Mehta", initial: "A", paid: true, color: "#06B6D4" },
      { name: "Geeta Rani", initial: "G", paid: true, color: "#F59E0B" },
      { name: "Amit Shah", initial: "A", paid: true, color: "#EF4444" },
      { name: "Neha Iyer", initial: "N", paid: true, color: "#14B8A6" },
      { name: "Rohit Das", initial: "R", paid: false, color: "#FF6B9D" },
      { name: "Kavita Singh", initial: "K", paid: true, color: "#8B5CF6" },
      { name: "Deepak Jain", initial: "D", paid: true, color: "#10B981" },
    ],
    pastBids: [
      { month: 1, winner: "Raj Verma", bidAmount: 18500, discount: 1500, perMember: 166 },
    ],
  },
];

export const DEFAULT_INVESTMENTS = [
  { id: 1, type: "Digital Gold", emoji: "🥇", invested: 5000, current: 5380, gain: 380, gainPct: 7.6, date: "2025-01-15" },
  { id: 2, type: "Liquid Fund", emoji: "🌱", invested: 4000, current: 4215, gain: 215, gainPct: 5.4, date: "2025-02-01" },
  { id: 3, type: "Short FD (6M)", emoji: "🏦", invested: 3400, current: 3555, gain: 155, gainPct: 4.6, date: "2025-03-10" },
];

export const DEFAULT_NOTIFICATIONS = [
  { id: 1, type: "circle", emoji: "⭕", title: "Teacher Group mein bidding khuli!", body: "Aaj raat 11:59 tak bid lagao. Pool ₹12,000 hai.", time: "2 ghante pehle", read: false, color: "#F6E100" },
  { id: 2, type: "invest", emoji: "💰", title: "Gold investment successful!", body: "₹500 ka sona kharida gaya. +50 Rupaiya Coins mile!", time: "Kal", read: false, color: "#22C55E" },
  { id: 3, type: "streak", emoji: "🔥", title: "3-Month Streak!", body: "Wah! Lagatar 3 mahine contribute kiya. 500 coins mile!", time: "3 din pehle", read: true, color: "#F59E0B" },
  { id: 4, type: "report", emoji: "📊", title: "April report ready hai", body: "Is mahine ₹13,600 bachaye. Last month se 8% zyada!", time: "1 hafte pehle", read: true, color: "#7C3AED" },
  { id: 5, type: "social", emoji: "👥", title: "Priya ne circle join ki", body: "Teacher Group mein naya member aaya.", time: "1 hafte pehle", read: true, color: "#06B6D4" },
];

export const INCOME_OPTIONS = [
  "Rs. 10,000 se kam",
  "Rs. 10,000 – 25,000",
  "Rs. 25,000 – 50,000",
  "Rs. 50,000 – 1,00,000",
  "Rs. 1,00,000+",
];

export const LANGUAGE_OPTIONS = ["Hindi", "Marathi", "Tamil", "Telugu", "Bengali", "English"];

export const GOAL_OPTIONS = [
  { label: "Scooter", emoji: "🛵", amount: 75000 },
  { label: "Ghar", emoji: "🏠", amount: 500000 },
  { label: "Shaadi", emoji: "💍", amount: 300000 },
  { label: "Padhai", emoji: "📚", amount: 100000 },
  { label: "Business", emoji: "💼", amount: 200000 },
  { label: "Emergency", emoji: "🏥", amount: 50000 },
];

export const BADGES = [
  { id: "first_circle", emoji: "🔥", label: "Pehla Circle", unlocked: true, desc: "Apna pehla circle join karo" },
  { id: "first_invest", emoji: "💰", label: "First Invest", unlocked: true, desc: "Pehli investment karo" },
  { id: "streak_3", emoji: "📅", label: "3-Month Streak", unlocked: true, desc: "3 mahine lagatar save karo" },
  { id: "champion", emoji: "🏆", label: "Circle Champion", unlocked: false, desc: "Ek circle complete karo" },
  { id: "referral_king", emoji: "⭐", label: "Referral King", unlocked: false, desc: "5 dosto ko refer karo" },
  { id: "gold_saver", emoji: "🥇", label: "Gold Saver", unlocked: false, desc: "₹10,000 gold mein invest karo" },
];
