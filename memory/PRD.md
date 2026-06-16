# RUPAIYA — India's AI Money Companion (PRD)

## Problem Statement
High-fidelity interactive prototype for a founder pitch. Bharat-first AI fintech mobile web app with Hinglish copy, AI nudges (Gemini), savings circles (committee/chit-fund), micro-investments (Gold/FD/Liquid), gamification (Rupaiya Coins, streaks, badges).

## Stack
- Frontend: React (CRA) + React Router + Context + localStorage
- Backend: FastAPI + MongoDB + emergentintegrations (Gemini 2.5 Flash)
- Font: Syne (display) + DM Sans (body)
- Palette: Deep purple (#420FAE) + Yellow (#F6E100) on light lavender bg (#F4F1FA)

## Architecture
- Mobile-first, max-width 430px phone frame on desktop
- 5-tab bottom nav: Home | Circles | Invest | Rupaiya AI | Profile
- Extra screens: Onboarding, Transactions, Notifications
- AI endpoint: POST /api/chat with session_id + use_case (chat|home_nudge|bid_advice|invest_advice)

## Implemented (2026-02)
- 3-slide onboarding + setup form (name/mobile/income/city/langs/goal)
- Home: AI nudge (Gemini), cashflow stats, goal ring, circle preview, streak, coins, recent tx, invest snapshot
- Circles: list, detail with bidding (real Gemini bid advice), member grid, past bids, 4-step create wizard
- Invest: 3 products (Digital Gold / Short FD / Liquid Fund) + portfolio view + AI recommendation + confetti on success
- AI Chat: full Hinglish chat UI with quick-reply chips + session memory on backend
- Profile: avatar, coins progress, 6 badges, stats grid, referral (WhatsApp share), settings
- Transactions: list (grouped by date), pills filter, search, FAB add sheet
- Notifications: read/unread with color-coded icons

## Backlog (P1/P2)
- Auth: JWT/OTP login (currently local only)
- Real SMS parsing for auto-tx extraction
- Actual Gold/FD integrations (Augmont, bank partners)
- Push notifications (FCM)
- Multi-language UI (Marathi/Tamil devanagari)
- Admin dashboard to manage circles
