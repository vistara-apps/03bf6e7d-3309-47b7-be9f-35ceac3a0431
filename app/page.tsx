import { AppShell } from '@/components/AppShell';
import { AgentChatCard } from '@/components/AgentChatCard';
import { SpendingGauge } from '@/components/SpendingGauge';
import { Zap, Shield, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-6 py-8 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full text-accent text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI Agents That Pay APIs</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-fg mb-4">
            No Crypto Knowledge
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-500">
              Required
            </span>
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Just ask in plain English. Our AI agents handle payments, API calls, and return results—all in seconds.
          </p>
        </div>

        {/* Main Chat Interface */}
        <div className="mb-8 animate-slide-up">
          <AgentChatCard />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="metric-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-fg">12</p>
                <p className="text-xs text-muted">Requests Today</p>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-fg">$2.40</p>
                <p className="text-xs text-muted">Spent This Week</p>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-fg">3</p>
                <p className="text-xs text-muted">Templates Created</p>
              </div>
            </div>
          </div>
        </div>

        {/* Spending Gauge */}
        <div className="max-w-md mx-auto">
          <SpendingGauge
            dailySpent={2.40}
            dailyCap={10.00}
            monthlySpent={8.50}
            monthlyCap={100.00}
          />
        </div>
      </div>
    </AppShell>
  );
}
