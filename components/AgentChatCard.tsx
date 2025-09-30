'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
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
    setShowCostPreview(false);
    setIsProcessing(true);

    // Simulate agent processing
    const processingMessage: Message = {
      id: Date.now().toString(),
      type: 'agent',
      content: 'Processing your request and executing payment...',
      timestamp: new Date().toISOString(),
      status: 'processing',
    };
    setMessages(prev => [...prev, processingMessage]);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate successful response
    const resultMessage: Message = {
      id: Date.now().toString(),
      type: 'agent',
      content: 'NYC: 72°F, Sunny ☀️\n\nPayment confirmed! Transaction: 0x1234...5678',
      timestamp: new Date().toISOString(),
      cost: estimatedCost,
      status: 'completed',
    };

    setMessages(prev => [...prev.slice(0, -1), resultMessage]);
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
          disabled={isProcessing || !input.trim()}
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
