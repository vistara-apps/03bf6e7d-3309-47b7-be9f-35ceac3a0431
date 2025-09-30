# PayBot - AI Agents That Pay APIs

A Next.js Base Mini App that lets users request data in plain English while AI agents handle API payments with stablecoins on the Kite blockchain.

## Features

- 🤖 **Natural Language Interface**: Just ask in plain English
- 💰 **Autonomous Payments**: Agents handle stablecoin payments automatically
- 🛡️ **Cost Guardrails**: Set daily/monthly spending caps with real-time alerts
- 📦 **Template Marketplace**: Pre-built agents for common use cases
- 🎨 **Professional Finance Theme**: Dark navy + gold accents
- 📱 **Mobile-First Design**: Optimized for Base Mini App experience

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via OnchainKit)
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (Auth + PostgreSQL)
- **AI**: OpenAI GPT-4 for intent parsing
- **Payments**: Kite SDK for stablecoin transactions

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your API keys:
   - OnchainKit API key from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
   - Supabase credentials from [Supabase Dashboard](https://supabase.com/dashboard)
   - OpenAI API key from [OpenAI Platform](https://platform.openai.com/)

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

## Project Structure

```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx            # Home page with agent chat
├── templates/          # Template marketplace
├── settings/           # User settings
├── providers.tsx       # OnchainKit + React Query setup
└── globals.css         # Custom design system

components/
├── AppShell.tsx        # Main app layout with navigation
├── AgentChatCard.tsx   # Chat interface with payment flow
├── TemplateCard.tsx    # Template display component
└── SpendingGauge.tsx   # Spending visualization

lib/
├── types.ts            # TypeScript interfaces
├── supabase.ts         # Supabase client
└── utils.ts            # Utility functions
```

## Design System

The app uses a professional finance theme with:
- **Background**: Dark navy (#0a1628)
- **Accent**: Gold (#ffd700)
- **Surface**: Dark blue (#0f1f3a)
- **Border**: Medium blue (#1e3a5f)

All design tokens are defined as CSS variables in `globals.css` and mapped to Tailwind classes.

## Key Features Implementation

### 1. Agent Chat Interface
- Natural language input
- Cost preview before payment
- Real-time status updates
- Transaction confirmation

### 2. Template Marketplace
- Featured templates with stats
- Category filtering
- One-click template usage
- Revenue tracking for creators

### 3. Spending Controls
- Radial progress gauge
- Daily/monthly view toggle
- Alert thresholds at 80% and 100%
- Adjustable caps

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=     # OnchainKit API key
NEXT_PUBLIC_SUPABASE_URL=           # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Supabase anon key
OPENAI_API_KEY=                     # OpenAI API key
OPENWEATHERMAP_API_KEY=             # Weather API key (demo)
```

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel deploy
```

Make sure to set all environment variables in your Vercel project settings.

## License

MIT
