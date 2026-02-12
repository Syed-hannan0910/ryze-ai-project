# 🚀 Ryze AI — UI Generator

An AI-powered agent that converts natural language → working UI code + live preview.

## Architecture Overview

```
User Message
     │
     ▼
┌─────────────────────────────────────────────┐
│             AI AGENT PIPELINE               │
│                                             │
│  Step 1: PLANNER                            │
│  - Interprets user intent                   │
│  - Selects layout structure                 │
│  - Chooses components from whitelist        │
│  - Outputs structured JSON plan             │
│                                             │
│  Step 2: GENERATOR                          │
│  - Converts plan → React JSX code           │
│  - Uses ONLY rz-* component classes         │
│  - Handles modifications vs fresh builds    │
│                                             │
│  Step 3: EXPLAINER                          │
│  - Summarizes what was built/changed        │
│  - Plain English, user-facing               │
└─────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│  VALIDATION LAYER                           │
│  - Component whitelist enforcement          │
│  - Code structure check                     │
│  - Injection protection                     │
└─────────────────────────────────────────────┘
     │
     ▼
  Live Preview (iframe sandbox)
```

## Component System

All UIs use a fixed set of CSS classes prefixed with `rz-`:

| Category | Classes |
|---|---|
| Buttons | rz-btn, rz-btn-primary, rz-btn-secondary, rz-btn-danger |
| Cards | rz-card, rz-card-header, rz-card-title |
| Forms | rz-input, rz-label, rz-form-group |
| Tables | rz-table |
| Layout | rz-flex, rz-grid-2, rz-grid-3, rz-grid-4 |
| Stats | rz-stat, rz-stat-value, rz-stat-label |
| Navigation | rz-navbar, rz-sidebar |
| Feedback | rz-badge, rz-alert, rz-progress |
| Charts | rz-chart-bar, rz-bar |

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed (https://nodejs.org)
- An Anthropic API key (https://console.anthropic.com)

### 2. Install dependencies
```bash
cd ryze-ai-ui-generator
npm install
```

### 3. Add your API key
```bash
cp .env.local.example .env.local
# Open .env.local and replace: your_anthropic_api_key_here
```

### 4. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

### 5. Deploy to Vercel
```bash
npm install -g vercel
vercel
# Follow prompts, add ANTHROPIC_API_KEY in Vercel dashboard
```

## Agent Design & Prompts

Three separate, distinct prompts — visible in `src/pages/api/generate.js`:

- **PLANNER_PROMPT**: Structured JSON plan output
- **GENERATOR_PROMPT**: React JSX code generation with strict component rules
- **EXPLAINER_PROMPT**: Plain English explanation of decisions

## Known Limitations

- Chart data is mocked/static (no real data connections)
- No persistent storage between sessions
- Mobile layout not optimized
- Complex animations limited to CSS

## What I'd Improve With More Time

- Streaming AI responses for faster perceived performance
- Diff view showing exactly what changed between versions
- Component schema validation using Zod
- Replayable generation sessions
- Better error recovery with auto-retry
- Richer component library (date pickers, draggable lists)
