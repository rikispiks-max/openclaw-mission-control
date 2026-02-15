# OpenClaw Mission Control

Ultra-premium mission control dashboard for autonomous AI agents running on OpenClaw.

## Stack

- **Next.js 15** (App Router)
- **Convex** (real-time backend)
- **Tailwind CSS v4** (dark mode only)
- **Framer Motion** (animations)
- **ShadCN UI** (component primitives)
- **TypeScript** throughout

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Convex:
   ```bash
   npx convex dev
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Convex deployment URL
   # Set OPENCLAW_WORKSPACE_PATH to your agent's workspace directory
   ```

4. Seed the database:
   ```bash
   npx convex run seed:seedAll
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Architecture

The dashboard reads live data from two sources:

1. **Convex**: real-time database for structured data (tasks, contacts, content drafts, calendar events, activity logs)
2. **Local API routes** (`/api/*`): read files from the agent's workspace filesystem at `~/.openclaw/workspace/` and return JSON

## Features

- **Home**: System health, agent status, cron monitoring, revenue tracking
- **Ops**: Operations overview, strategic task suggestions, calendar
- **Agents**: Agent registry, model inventory, sub-agent management
- **Chat**: Direct communication with agents, command interface
- **Content**: Content pipeline management, draft review
- **Comms**: Communication hub, CRM pipeline
- **Knowledge**: Knowledge base search, ecosystem product grid
- **Code**: Repository monitoring, commit history

All views feature real-time updates, glass morphism design, and smooth animations.
