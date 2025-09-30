'use client';

import { ReactNode } from 'react';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Avatar, Name, Address } from '@coinbase/onchainkit/identity';
import { Bot, Sparkles, TrendingUp, Settings2, TestTube } from 'lucide-react';
import Link from 'next/link';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      
      {/* Header */}
      <header className="relative border-b border-border/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-yellow-500 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-200">
                <Bot className="w-6 h-6 text-bg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-fg">PayBot</h1>
                <p className="text-xs text-muted">AI Agents That Pay</p>
              </div>
            </Link>

            <Wallet>
              <ConnectWallet className="btn-primary">
                <Avatar className="w-6 h-6" />
                <Name className="text-sm font-medium" />
              </ConnectWallet>
            </Wallet>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border/50 backdrop-blur-sm bg-surface/80 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-around">
            <Link href="/" className="flex flex-col items-center gap-1 text-accent hover:text-accent-hover transition-colors duration-200">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-medium">Chat</span>
            </Link>
            <Link href="/templates" className="flex flex-col items-center gap-1 text-muted hover:text-accent transition-colors duration-200">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-medium">Templates</span>
            </Link>
            <Link href="/test" className="flex flex-col items-center gap-1 text-muted hover:text-accent transition-colors duration-200">
              <TestTube className="w-5 h-5" />
              <span className="text-xs font-medium">Tests</span>
            </Link>
            <Link href="/settings" className="flex flex-col items-center gap-1 text-muted hover:text-accent transition-colors duration-200">
              <Settings2 className="w-5 h-5" />
              <span className="text-xs font-medium">Settings</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
