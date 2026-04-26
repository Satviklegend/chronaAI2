#!/bin/bash
# ╔═══════════════════════════════════════════════════════════════╗
# ║           ChronaAI — Automated Setup Script                  ║
# ║   Runs: install → db setup → seed → launch                   ║
# ╚═══════════════════════════════════════════════════════════════╝

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
RESET='\033[0m'

echo ""
echo -e "${CYAN}${BOLD}"
echo "  ██████╗██╗  ██╗██████╗  ██████╗ ███╗   ██╗ █████╗      █████╗ ██╗"
echo " ██╔════╝██║  ██║██╔══██╗██╔═══██╗████╗  ██║██╔══██╗    ██╔══██╗██║"
echo " ██║     ███████║██████╔╝██║   ██║██╔██╗ ██║███████║    ███████║██║"
echo " ██║     ██╔══██║██╔══██╗██║   ██║██║╚██╗██║██╔══██║    ██╔══██║██║"
echo " ╚██████╗██║  ██║██║  ██║╚██████╔╝██║ ╚████║██║  ██║    ██║  ██║██║"
echo "  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝"
echo -e "${RESET}"
echo -e "${CYAN}        Your Intelligent Time OS — Automated Setup (Next.js 15)${RESET}"
echo ""

# ── Step 1: Check Node.js ────────────────────────────────────────
echo -e "${YELLOW}[1/5] Checking Node.js...${RESET}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}ERROR: Node.js not found. Install from https://nodejs.org (v18+)${RESET}"
  exit 1
fi
NODE_VER=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VER" -lt 18 ]; then
  echo -e "${RED}ERROR: Node.js 18+ required. Current: $(node --version)${RESET}"
  exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${RESET}"

# ── Step 2: Install dependencies ────────────────────────────────
echo ""
echo -e "${YELLOW}[2/5] Installing dependencies...${RESET}"
npm install --legacy-peer-deps --silent
echo -e "${GREEN}✓ Dependencies installed${RESET}"

# ── Step 3: Generate Prisma client ──────────────────────────────
echo ""
echo -e "${YELLOW}[3/5] Generating Prisma client...${RESET}"
npx prisma generate
echo -e "${GREEN}✓ Prisma client generated${RESET}"

# ── Step 4: Push database schema ────────────────────────────────
echo ""
echo -e "${YELLOW}[4/5] Setting up database (creating tables)...${RESET}"
npx prisma db push
echo -e "${GREEN}✓ Database tables created${RESET}"

# ── Step 5: Seed demo data ───────────────────────────────────────
echo ""
echo -e "${YELLOW}[5/5] Seeding demo data...${RESET}"
npx tsx prisma/seed.ts
echo -e "${GREEN}✓ Demo data loaded${RESET}"

# ── Done! ────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}${BOLD}════════════════════════════════════════${RESET}"
echo -e "${GREEN}${BOLD}  ✓ ChronaAI is ready to launch!${RESET}"
echo -e "${CYAN}${BOLD}════════════════════════════════════════${RESET}"
echo ""
echo -e "  ${BOLD}Start the app:${RESET}  npm run dev"
echo -e "  ${BOLD}Open browser:${RESET}   http://localhost:3000"
echo ""
echo -e "  ${BOLD}Demo login:${RESET}"
echo -e "    Email:     ${CYAN}demo@chrona.ai${RESET}"
echo -e "    Password:  ${CYAN}demo12345${RESET}"
echo ""
echo -e "${YELLOW}  Run the AI analysis after logging in to see insights!${RESET}"
echo ""
