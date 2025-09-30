'use client';

import { useState, useEffect } from 'react';
import { Send, Loader2, CheckCircle2, XCircle, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { usePayment } from '@/hooks/usePayment';
import type { AgentRequest } from '@/lib/types';

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  cost?: number;
  status?: AgentRequest['status'];
}

export function AgentChatCard() {
  const { isConnected, isLoading, makePayment, makeX402Request, checkTransactionStatus, error } = usePayment();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to PayBot! Ask me anything and I\'ll handle the API payments for you.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCostPreview, setShowCostPreview] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0.12);
  const [currentTxHash, setCurrentTxHash] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

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
    if (!isConnected) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'agent',
        content: 'Please connect your wallet to make payments.',
        timestamp: new Date().toISOString(),
        status: 'failed',
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    setShowCostPreview(false);
    setIsProcessing(true);

    // Add processing message
    const processingMessage: Message = {
      id: Date.now().toString(),
      type: 'agent',
      content: 'Processing your request and executing payment...',
      timestamp: new Date().toISOString(),
      status: 'processing',
    };
    setMessages(prev => [...prev, processingMessage]);

    try {
      // Make payment using USDC on Base
      const paymentResult = await makePayment({
        amount: estimatedCost,
        recipient: '0x742d35Cc6634C0532925a3b8D4c8c1f8b8A9d9b8', // Demo API provider address
        description: `PayBot API request: ${input}`,
      });

      setCurrentTxHash(paymentResult.txHash);

      // Update message with transaction hash
      const txMessage: Message = {
        id: Date.now().toString(),
        type: 'agent',
        content: `Payment submitted! Transaction: ${paymentResult.txHash.slice(0, 10)}...${paymentResult.txHash.slice(-8)}\n\nWaiting for confirmation...`,
        timestamp: new Date().toISOString(),
        status: 'processing',
      };
      setMessages(prev => [...prev.slice(0, -1), txMessage]);

      // Poll for transaction confirmation
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds
      
      const pollStatus = async () => {
        if (attempts >= maxAttempts) {
          throw new Error('Transaction confirmation timeout');
        }

        const status = await checkTransactionStatus(paymentResult.txHash);
        
        if (status === 'confirmed') {
          // Simulate API call after payment confirmation
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const resultMessage: Message = {
            id: Date.now().toString(),
            type: 'agent',
            content: 'NYC: 72°F, Sunny ☀️\n\nPayment confirmed! Your request has been processed successfully.',
            timestamp: new Date().toISOString(),
            cost: estimatedCost,
            status: 'completed',
          };
          setMessages(prev => [...prev.slice(0, -1), resultMessage]);
          return;
        } else if (status === 'failed') {
          throw new Error('Transaction failed');
        }

        // Still pending, wait and try again
        attempts++;
        setTimeout(pollStatus, 1000);
      };

      await pollStatus();

    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'agent',
        content: `Payment failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
        status: 'failed',
      };
      setMessages(prev => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setIsProcessing(false);
      setCurrentTxHash(null);
    }
  };

  return (
    <div className="glass-card rounded-lg p-6 max-w-3xl mx-auto">
      {/* Wallet Status */}
      {!isConnected && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-2">
          <Wallet className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-yellow-500">Connect your wallet to make payments</span>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-500">{error}</span>
        </div>
      )}

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
                : 'bg-surface/80'
            }`}
          >
            <div className="flex items-start gap-3">
              {message.type === 'agent' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-yellow-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-bg text-sm font-bold">AI</span>
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

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything... (e.g., 'Get weather in NYC')"
          className="input-field flex-1"
          disabled={isProcessing}
        />
        <button
          type="submit"
          disabled={isProcessing || !input.trim() || !isConnected}
          className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          title={!isConnected ? "Connect wallet to send messages" : ""}
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
