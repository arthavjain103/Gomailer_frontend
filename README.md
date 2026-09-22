# GoMailer

High-performance bulk email delivery platform built with **Go**, **Redis**, **worker pools**, **retries**, and **rate limiting**.

![Build](https://img.shields.io/badge/status-ready-brightgreen)
![Stack](https://img.shields.io/badge/stack-Go%20%7C%20Redis%20%7C%20React%20%7C%20Tailwind%20%7C%20Framer%20Motion-blue)
![License](https://img.shields.io/badge/license-MIT-gray)

---

## Overview

GoMailer accepts a burst of emails, persists them to Redis, and delivers them through a fixed pool of Go goroutine workers with automatic retries, a dead-letter queue, idempotency keys, and per-domain rate limiting. The result is a system that can handle **10,000+ emails** without losing a single one.

The project has two parts:

| Part | What it is |
|---|---|
| **Landing page** (`src/`) | React + Tailwind + Framer Motion marketing site with interactive demos |
| **Admin console** (`src/`) | React dashboard for live monitoring, campaign control, queue inspection, template editing, and CSV upload |
| **Backend** (`/api`) | Go server (referenced via `vite.config.js` proxy) exposing REST endpoints |

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **Go** ≥ 1.22
- **Redis** ≥ 7

### 1. Clone and install

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd gofro
npm install
```

### 2. Start the frontend

```bash
npm run dev
```

The app runs at `http://localhost:5173`. Vite proxies `/api` requests to the Go backend on port 8080 automatically.

### 3. Start the Go backend

```bash
go run ./cmd/server
```

Make sure Redis is running (`redis-server`).

### 4. Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
gofro/
├── src/
│   ├── components/          # Shared React components
│   │   ├── Navbar.jsx        # Fixed top nav with logo + links
│   │   ├── Footer.jsx        # CTA footer with TextEmerge animation
│   │   ├── Hero.jsx          # Landing hero — RippleWave + VectorWordmark + stats
│   │   ├── PipelineCarousel.jsx  # Interactive drag/scroll SmoothScrollSlider
│   │   ├── LiveDemo.jsx      # Animated chat preview (IOSMessageList)
│   │   ├── Benefits.jsx      # Six benefit cards with TextEmerge heading
│   │   ├── DashboardLayout.jsx # Sidebar + outlet layout for console
│   │   ├── Sidebar.jsx       # Sidebar nav links (Dashboard, Upload, Campaign, etc.)
│   │   ├── IOSMessageList.jsx  # Animated iMessage-style chat component
│   │   ├── SmoothScrollSlider.jsx # Horizontal drag/scroll carousel
│   │   ├── RippleWave.jsx    # Per-character spring animation heading
│   │   ├── VectorWordmark.jsx # Interactive WebGL dotted wordmark
│   │   ├── TextEmerge.jsx    # GSAP ink-drop word stagger animation
│   │   ├── StatusPill.jsx    # Live status indicator pill
│   │   ├── StatCard.jsx      # Animated stat card with tone colors
│   │   ├── Banner.jsx        # Error/success banner
│   │   └── Spinner.jsx       # Loading spinner
│   ├── pages/               # Route-level pages
│   │   ├── LandingPage.jsx   # Composes hero + carousel + demo + benefits + footer
│   │   ├── Dashboard.jsx     # Live server stats, Redis status, campaign pause
│   │   ├── Monitoring.jsx    # Real-time logs + send/fail/retry/DLQ stat cards
│   │   ├── Queues.jsx        # Redis queue inspection with tabbed DLQ view
│   │   ├── Campaign.jsx      # Start / stop / pause campaign controls
│   │   ├── Upload.jsx        # CSV recipient upload with progress bar
│   │   ├── Template.jsx      # Email template editor + attachment upload
│   │   └── ...
│   ├── api/                 # API client layer
│   │   ├── client.js         # Axios instance with /api base
│   │   └── emailApi.js       # All API endpoints (status, stats, logs, queues, campaign, template, attachment, CSV)
│   ├── hooks/
│   │   └── usePolling.js     # Generic polling hook (fetches, retries on error, keeps last good data)
│   ├── index.css             # Tailwind directives + CSS variables + dashboard styles
│   ├── App.jsx               # React Router setup with lazy-loaded pages
│   └── main.jsx              # Entry point
├── index.html                # Vite entry HTML
├── package.json
├── vite.config.js            # Vite + Tailwind + proxy to Go backend :8080
├── .gitignore
└── README.md
```

---


## Admin Console (`/console`)

Protected by `DashboardLayout` (Sidebar + Outlet). Routes:

| Route | Page | Description |
|---|---|---|
| `/console` | **Dashboard** | Live server status, Redis status, campaign paused/running. 4 stat cards: Pending, Processing, Completed, Failed. Auto-refreshes every 4s |
| `/console/upload` | **Upload CSV** | Upload `.csv` files with recipient name + email columns. Progress bar shown. Also supports file attachment |
| `/console/campaign` | **Campaign** | Start / stop / pause campaign controls. Shows current recipient source. Auto-refreshes every 4s |
| `/console/monitoring` | **Monitoring** | Real-time log feed (sent / failed / retry / info). 4 stat cards: Sent, Failed, Retry, Queued. Auto-refreshes every 3s |
| `/console/template` | **Email template** | Edit raw email headers + body with `{{.Name}}`, `{{.Email}}`, `{{.Retry}}`, `{{.CampaignID}}` placeholders. Save template. Also manage file attachments |
| `/console/queues` | **Queues** | Inspect Redis queues including the Dead Letter Queue. Tabbed interface showing job ID, email, status, timestamp, error message |

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Client     │────▶│   Go API     │────▶│   Redis     │
│  (React)    │     │  (Gin / Go)  │     │  queue:email│
└─────────────┘     └──────┬───────┘     └──────┬──────┘
                           │                    │
                    ┌──────▼───────┐     ┌──────▼──────┐
                    │  5 Workers   │◀────│  BRPOP      │
                    │ (goroutines) │     │  blocking   │
                    └──────┬───────┘     └─────────────┘
                           │
                    ┌──────▼───────┐
                    │  SMTP Send   │
                    │  Idempotent  │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Retry ×3   │────▶ DLQ (dead letter)
                    │  Exp backoff │
                    └──────────────┘
```

**Data flow:** POST `/send` → validate + dedupe (idempotency key) → `LPUSH queue:email` → 5 workers `BRPOP` → rate limit (token bucket per domain) → SMTP send → on failure, retry with exponential backoff → after 3 attempts, move to `dlq:email` → inspect/replay without blocking main queue.

---

## Key Features

- **Go concurrency** — lightweight goroutine workers for maximum throughput
- **Redis persistent queues** — `LPUSH` / `BRPOP` with AOF persistence, crash-safe
- **Worker pools** — 5 concurrent goroutines, isolated failures, graceful shutdown
- **Retry with backoff** — 3 attempts with exponential backoff
- **Dead Letter Queue (DLQ)** — poison-safe quarantine for exhausted jobs
- **Idempotency** — `SETNX` key prevents duplicate sends on retry
- **Rate limiting** — token bucket per domain to protect sender reputation
- **Real-time monitoring** — `/status` endpoint with queued / sent / failed / DLQ counts

---

## Animations Used

| Component | Animation | Library |
|---|---|---|
| `RippleWave.jsx` | Per-character spring stagger entrance | Framer Motion |
| `SmoothScrollSlider.jsx` | Drag / scroll / wheel / inertial infinite carousel | Custom rAF |
| `IOSMessageList.jsx` | Staggered message appearance + typing dots loop | Framer Motion `useAnimate` |
| `TextEmerge.jsx` | Ink-drop word spread from center (blur → sharp) | GSAP |
| `VectorWordmark.jsx` | Interactive WebGL dotted text that responds to cursor | Raw WebGL |

---

## API Endpoints

All proxied through `/api` in `vite.config.js`.

| Endpoint | Method | Description |
|---|---|---|
| `/api/status` | GET | Server + Redis status |
| `/api/stats` | GET | Pending, processing, completed, failed counts |
| `/api/logs` | GET | Recent worker activity log entries |
| `/api/campaign/status` | GET | Current campaign state |
| `/api/campaign/start` | POST | Start sending |
| `/api/campaign/stop` | POST | Stop / pause campaign |
| `/api/template` | GET | Get current email template |
| `/api/template` | POST | Save email template |
| `/api/queues` | GET | List all Redis queues with job counts |
| `/api/upload` | POST | Upload CSV recipients (multipart) |
| `/api/attachment` | GET/POST/DELETE | Get / upload / remove email attachment |

---

## Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
```

---

## Browser Support

Modern browsers with ES modules, WebGL2, and `IntersectionObserver` support. Tested in Chrome, Firefox, Safari, and Edge.

---

## License

MIT
