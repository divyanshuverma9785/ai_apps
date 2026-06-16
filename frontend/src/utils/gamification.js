export const REWARDS = {
  circle_contribution: 50,
  investment_made: 50,
  savings_goal_beat: 200,
  streak_3_month: 500,
  referral_success: 1000,
  first_circle: 150,
  first_investment: 100,
};

export const MILESTONES = [
  { coins: 500, reward: "₹50 cashback" },
  { coins: 1000, reward: "1 month free circle fee" },
  { coins: 2000, reward: "₹100 cashback" },
  { coins: 5000, reward: "RUPAIYA Pro 1 month free" },
];

export function nextMilestone(coins) {
  return MILESTONES.find(m => m.coins > coins) || MILESTONES[MILESTONES.length - 1];
}
