'use client';

import { TrendingUp, Users, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Template } from '@/lib/types';

interface TemplateCardProps {
  template: Template;
  variant?: 'list' | 'featured';
  onSelect?: () => void;
}

export function TemplateCard({ template, variant = 'list', onSelect }: TemplateCardProps) {
  const categoryIcons = {
    weather: '🌤️',
    crypto: '₿',
    scraper: '🕷️',
    sentiment: '💭',
    custom: '⚡',
  };

  if (variant === 'featured') {
    return (
      <div className="glass-card rounded-lg p-6 border-2 border-accent/30 hover:border-accent/60 transition-all duration-200 cursor-pointer group" onClick={onSelect}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-yellow-500 flex items-center justify-center text-2xl shadow-glow">
              {categoryIcons[template.category]}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-fg group-hover:text-accent transition-colors duration-200">
                {template.name}
              </h3>
              <p className="text-xs text-muted">{template.category}</p>
            </div>
          </div>
          {template.featured && (
            <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full">
              Featured
            </span>
          )}
        </div>
        
        <p className="text-sm text-muted mb-4 line-clamp-2">{template.description}</p>
        
        <div className="flex items-center gap-4 text-xs text-muted">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{template.use_count.toLocaleString()} uses</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span>{formatCurrency(template.default_payment_amount)}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-success" />
            <span>{formatCurrency(template.revenue_generated)} earned</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg p-4 hover:bg-surface-hover transition-all duration-200 cursor-pointer" onClick={onSelect}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-yellow-500 flex items-center justify-center text-xl">
          {categoryIcons[template.category]}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-fg">{template.name}</h4>
          <div className="flex items-center gap-3 text-xs text-muted mt-1">
            <span>{template.use_count.toLocaleString()} uses</span>
            <span>•</span>
            <span>{formatCurrency(template.default_payment_amount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
