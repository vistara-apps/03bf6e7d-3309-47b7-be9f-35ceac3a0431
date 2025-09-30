'use client';

import { useState } from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface SpendingGaugeProps {
  dailySpent: number;
  dailyCap: number;
  monthlySpent: number;
  monthlyCap: number;
}

export function SpendingGauge({ dailySpent, dailyCap, monthlySpent, monthlyCap }: SpendingGaugeProps) {
  const [view, setView] = useState<'daily' | 'monthly'>('daily');
  
  const spent = view === 'daily' ? dailySpent : monthlySpent;
  const cap = view === 'daily' ? dailyCap : monthlyCap;
  const percentage = (spent / cap) * 100;
  const isWarning = percentage >= 80;

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-fg">Spending</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setView('daily')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
              view === 'daily' 
                ? 'bg-accent text-bg' 
                : 'text-muted hover:text-fg'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setView('monthly')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
              view === 'monthly' 
                ? 'bg-accent text-bg' 
                : 'text-muted hover:text-fg'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Radial Progress */}
      <div className="relative w-48 h-48 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-surface"
          />
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 80}`}
            strokeDashoffset={`${2 * Math.PI * 80 * (1 - percentage / 100)}`}
            className={`transition-all duration-500 ${
              isWarning ? 'text-warning' : 'text-accent'
            }`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-fg">{percentage.toFixed(0)}%</span>
          <span className="text-xs text-muted mt-1">of {view} cap</span>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Spent</span>
          <span className="text-fg font-semibold">{formatCurrency(spent)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Remaining</span>
          <span className="text-accent font-semibold">{formatCurrency(cap - spent)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Cap</span>
          <span className="text-fg font-semibold">{formatCurrency(cap)}</span>
        </div>
      </div>

      {/* Warning */}
      {isWarning && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warning">Approaching limit</p>
            <p className="text-xs text-muted mt-1">
              You've used {percentage.toFixed(0)}% of your {view} spending cap
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
