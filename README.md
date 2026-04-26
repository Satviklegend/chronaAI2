# ⚡ ChronaAI — Your Intelligent Time OS

> AI-powered calendar built with Next.js 14, PostgreSQL, and Google Gemini AI.
> Analyzes your schedule, detects inefficiencies, auto-schedules your goals.

---

## 🚀 Setup (3 steps)

### Prerequisites
- Node.js 18+ → [nodejs.org](https://nodejs.org)
- PostgreSQL database (already configured — Neon)
- Gemini API key (already configured)

### 1. Install & Setup (one command)
```bash
bash setup.sh
```
This automatically:
- Installs all npm packages
- Generates the Prisma client
- Creates all database tables
- Seeds demo data

### 2. Start the app
```bash
npm run dev
```

### 3. Open in browser
```
http://localhost:3000
```

**Demo login:** `demo@chrona.ai` / `demo12345`

---

## 🔑 Credentials (already in .env)

| Key | Value |
|-----|-------|
| Gemini API | Configured ✅ |
| Database | Neon PostgreSQL ✅ |
| JWT Secret | Set ✅ |

---

## ✨ Features

| Feature | Status |
|---------|--------|
| 3D Landing Page (Three.js) | ✅ |
| Auth (signup/login/JWT) | ✅ |
| Calendar (day/week/month) | ✅ |
| Event CRUD with categories | ✅ |
| Goals & habit tracking | ✅ |
| AI schedule analysis (Gemini) | ✅ |
| Productivity score + charts | ✅ |
| AI auto-scheduling | ✅ |
| Smart notifications | ✅ |
| Neon dark theme | ✅ |

---

## 🗂 Project Structure

```
chrona-ai/
├── prisma/
│   ├── schema.prisma      # DB schema (6 tables)
│   └── seed.ts            # Demo data seeder
├── src/
│   ├── app/
│   │   ├── api/           # All API routes
│   │   │   ├── auth/      # signup, login, logout, me
│   │   │   ├── events/    # CRUD + [id]
│   │   │   ├── goals/     # Goals CRUD
│   │   │   ├── habits/    # Habits CRUD
│   │   │   ├── ai/        # analyze + auto-schedule
│   │   │   ├── insights/  # Saved AI reports
│   │   │   └── notifications/
│   │   ├── auth/          # Login + Signup pages
│   │   ├── dashboard/     # App pages
│   │   │   ├── page.tsx       # Overview
│   │   │   ├── calendar/      # Full calendar
│   │   │   ├── goals/         # Goals & habits
│   │   │   └── insights/      # AI insights
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # 3D Landing page
│   ├── components/        # Reusable components
│   ├── lib/               # Core utilities
│   │   ├── ai.ts          # Gemini integration
│   │   ├── auth.ts        # JWT utilities
│   │   ├── prisma.ts      # DB client
│   │   ├── store.ts       # Zustand state
│   │   └── utils.ts       # Helpers + categories
│   ├── styles/            # Global CSS + neon system
│   └── middleware.ts      # Route protection
├── .env                   # ← credentials live here
├── setup.sh               # One-command setup
└── package.json
```

---

## 🤖 AI Prompt Used

```
You are ChronaAI, an elite productivity coach.
Analyze this user's weekly schedule for:
1. Time distribution across categories
2. Peak-hour alignment (deep work in morning?)
3. Schedule density and overload risk
4. Goal-calendar alignment
5. Work-life balance
6. Missing critical blocks
Return JSON: productivityScore, summary, suggestions[], timeBreakdown, overloadWarning, balanceScore, focusBlocks[]
```

---

## 🎨 Design System

- **Font:** Orbitron (display) + Space Grotesk (body) + JetBrains Mono (code)
- **Colors:** Neon cyan `#00fff7`, Pink `#ff2d78`, Green `#39ff14`, Purple `#bf00ff`, Yellow `#ffee00`
- **Effects:** Glass morphism, neon glows, CRT scanlines, 3D Three.js scene
- **Animation:** Float, glow pulse, fade-up, scale-in

---

Built with Next.js 14 · Gemini AI · PostgreSQL · Three.js · Tailwind CSS
