'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useWalletClient, useAccount } from 'wagmi';
import { formatCurrency } from '@/lib/utils';
import { createX402Request } from '@/lib/payment';
import type { AgentRequest } from '@/lib/types';

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system' | 'error';
  content: string;
  timestamp: string;
  cost?: number;
  status?: AgentRequest['status'];
  txHash?: string;
}

export function AgentChatCard() {
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to PayBot! Ask me anything and I\'ll handle the API payments for you. Make sure to connect your wallet first.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCostPreview, setShowCostPreview] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0.12);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    // Check if wallet is connected
    if (!isConnected) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'error',
        content: 'Please connect your wallet first to make payments.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowCostPreview(true);
  };

  const handleConfirmPayment = async () => {
    setShowCostPreview(false);
    setIsProcessing(true);

    // Show processing message
    const processingMessage: Message = {
      id: Date.now().toString(),
      type: 'agent',
      content: 'Processing your request and executing x402 payment...',
      timestamp: new Date().toISOString(),
      status: 'processing',
    };
    setMessages(prev => [...prev, processingMessage]);

    try {
      // Execute x402 payment with real API call
      if (!walletClient) {
        throw new Error('Wallet client not available');
      }
      
      const result = await createX402Request(
        'https://api.openweathermap.org/data/2.5/weather', // Example API endpoint
        estimatedCost,
        walletClient
      );

      if (result.success) {
        // Show successful result
        const resultMessage: Message = {
          id: Date.now().toString(),
          type: 'agent',
          content: `✅ Request completed successfully!\n\n${JSON.stringify(result.data, null, 2)}\n\n💳 Payment confirmed!`,
          timestamp: new Date().toISOString(),
          cost: estimatedCost,
          status: 'completed',
          txHash: result.txHash,
        };
        setMessages(prev => [...prev.slice(0, -1), resultMessage]);
      } else {
        // Show error message
        const errorMessage: Message = {
          id: Date.now().toString(),
          type: 'error',
          content: `❌ Payment failed: ${result.error || 'Unknown error'}`,
          timestamp: new Date().toISOString(),
          status: 'failed',
        };
        setMessages(prev => [...prev.slice(0, -1), errorMessage]);
      }
    } catch (error) {
      // Handle unexpected errors
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'error',
        content: `❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
        status: 'failed',
      };
      setMessages(prev => [...prev.slice(0, -1), errorMessage]);
    }

    setIsProcessing(false);
  };

  return (
    <div className="glass-card rounded-lg p-6 max-w-3xl mx-auto">
      {/* Messages */}
      <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`agent-message ${
              message.type === 'user' 
                ? 'ml-auto max-w-[80%] bg-primary/20' 
                : message.type === 'system'
                ? 'bg-surface/50 border border-accent/20'
                : message.type === 'error'
                ? 'bg-red-900/20 border border-red-500/30'
                : 'bg-surface/80'
            }`}
          >
            <div className="flex items-start gap-3">
              {message.type === 'agent' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-yellow-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-bg text-sm font-bold">AI</span>
                </div>
              )}
              {message.type === 'error' && (
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm text-fg whitespace-pre-wrap">{message.content}</p>
                {message.cost && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Cost: {formatCurrency(message.cost)}</span>
                  </div>
                )}
                {message.txHash && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                    <span>Transaction:</span>
                    <a 
                      href={`https://basescan.org/tx/${message.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 truncate max-w-32"
                    >
                      {message.txHash.slice(0, 8)}...{message.txHash.slice(-6)}
                    </a>
                  </div>
                )}
                {message.status === 'processing' && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-accent">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cost Preview Modal */}
      {showCostPreview && (
        <div className="mb-4 p-4 glass-card rounded-lg border-2 border-accent animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-fg">Cost Preview</h3>
            <button
              onClick={() => setShowCostPreview(false)}
              className="text-muted hover:text-fg transition-colors duration-200"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-muted">API Cost</span>
              <span className="text-fg">{formatCurrency(0.10)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Platform Fee</span>
              <span className="text-fg">{formatCurrency(0.02)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-semibold">
              <span className="text-fg">Total</span>
              <span className="text-accent">{formatCurrency(estimatedCost)}</span>
            </div>
          </div>
          <button
            onClick={handleConfirmPayment}
            className="btn-primary w-full"
          >
            Confirm Payment
          </button>
        </div>
      )}

      {/* Wallet Status */}
      {!isConnected && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-amber-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Connect your wallet to make payments and use PayBot</span>
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isConnected ? "Ask anything... (e.g., 'Get weather in NYC')" : "Connect wallet first..."}
          className="input-field flex-1"
          disabled={isProcessing || !isConnected}
        />
        <button
          type="submit"
          disabled={isProcessing || !input.trim() || !isConnected}
          className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}
