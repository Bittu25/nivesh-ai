# Nivesh AI — Smart Investing for Bharat

An AI-native, all-in-one investment dashboard for Indian retail investors.
Built with vanilla JS, Node.js, and the Anthropic Claude API.

## Features
- **Onboarding** — 4-step personalised setup (name, income, goals, risk profile)
- **Dashboard** — Portfolio stats, growth chart, asset allocation, goal progress
- **Invest** — AI-curated fund discovery with SIP configuration modal
- **AI Advisor** — Live chat with Claude, personalised to your portfolio
- **Portfolio** — Holdings, SIP schedule, transaction history, performance chart
- **Learn** — SIP Calculator, Goal Planner, investment education articles
- **Notifications** — Real-time alerts drawer
- **Dark mode** — Automatic via CSS media query
- **Mobile responsive** — Bottom nav for mobile

## Setup

### 1. Install dependencies
```bash
# No npm install needed — pure Node.js with no dependencies!
```

### 2. Set your Anthropic API key
```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Run
```bash
node server.js
```

Open http://localhost:3000

## Project Structure
```
nivesh-ai/
├── server.js              # Node.js HTTP server + Claude API proxy
├── public/
│   ├── index.html         # App shell
│   ├── css/
│   │   ├── reset.css
│   │   ├── tokens.css     # Design tokens + dark mode
│   │   ├── components.css # Shared UI components
│   │   ├── layout.css     # Topbar, nav, grids
│   │   ├── onboarding.css
│   │   ├── dashboard.css
│   │   ├── invest.css
│   │   ├── advisor.css    # Also contains portfolio + learn styles
│   │   └── animations.css
│   ├── js/
│   │   ├── state.js       # Global app state
│   │   ├── utils.js       # Utilities + formatters
│   │   ├── api.js         # Claude API client
│   │   ├── charts.js      # Chart.js wrappers
│   │   ├── onboarding.js  # Onboarding flow
│   │   ├── notifications.js
│   │   ├── router.js      # Tab routing
│   │   ├── app.js         # Bootstrap
│   │   └── tabs/
│   │       ├── dashboard.js
│   │       ├── invest.js
│   │       ├── advisor.js
│   │       ├── portfolio.js
│   │       └── learn.js
│   └── assets/
│       └── favicon.svg
```

## Converting to APK
Use [Capacitor](https://capacitorjs.com/):
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Nivesh AI" "com.niveshai.app"
npx cap add android
npx cap copy
npx cap open android
```
Then build with Android Studio.

## Tech Stack
- **Frontend**: Vanilla JS (ES6), CSS custom properties, Chart.js
- **Backend**: Node.js built-in `http` module (zero dependencies)
- **AI**: Anthropic Claude claude-sonnet-4-20250514 via `/api/chat` proxy
- **Charts**: Chart.js 4.4.1 (CDN)
- **Fonts**: DM Sans + DM Serif Display (Google Fonts)
