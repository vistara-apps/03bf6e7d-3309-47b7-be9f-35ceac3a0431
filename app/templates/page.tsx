import { AppShell } from '@/components/AppShell';
import { TemplateCard } from '@/components/TemplateCard';
import { Search, Plus } from 'lucide-react';
import type { Template } from '@/lib/types';

const featuredTemplates: Template[] = [
  {
    id: '1',
    creator_id: 'user1',
    name: 'Weather Bot',
    description: 'Get real-time weather data for any city worldwide. Powered by OpenWeatherMap API.',
    category: 'weather',
    prompt_template: 'Get weather in {city}',
    api_config: { endpoint: 'openweathermap.org' },
    default_payment_amount: 0.12,
    use_count: 1234,
    revenue_generated: 148.08,
    is_public: true,
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    creator_id: 'user2',
    name: 'Crypto Price Checker',
    description: 'Real-time cryptocurrency prices and market data. Supports 100+ coins.',
    category: 'crypto',
    prompt_template: 'Get {coin} price',
    api_config: { endpoint: 'coingecko.com' },
    default_payment_amount: 0.15,
    use_count: 890,
    revenue_generated: 133.50,
    is_public: true,
    featured: true,
    created_at: new Date().toISOString(),
  },
];

const allTemplates: Template[] = [
  ...featuredTemplates,
  {
    id: '3',
    creator_id: 'user3',
    name: 'Web Scraper',
    description: 'Extract data from any website with AI-powered parsing.',
    category: 'scraper',
    prompt_template: 'Scrape {url}',
    api_config: { endpoint: 'scrapingbee.com' },
    default_payment_amount: 0.25,
    use_count: 456,
    revenue_generated: 114.00,
    is_public: true,
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    creator_id: 'user4',
    name: 'Sentiment Analyzer',
    description: 'Analyze sentiment of text, reviews, or social media posts.',
    category: 'sentiment',
    prompt_template: 'Analyze sentiment: {text}',
    api_config: { endpoint: 'meaningcloud.com' },
    default_payment_amount: 0.18,
    use_count: 234,
    revenue_generated: 42.12,
    is_public: true,
    featured: false,
    created_at: new Date().toISOString(),
  },
];

export default function TemplatesPage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-6 py-8 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-fg mb-2">Templates</h1>
            <p className="text-muted">Launch production-ready agents in 60 seconds</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>Create</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search templates..."
              className="input-field pl-12"
            />
          </div>
        </div>

        {/* Featured Templates */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-fg mb-4">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                variant="featured"
              />
            ))}
          </div>
        </div>

        {/* All Templates */}
        <div>
          <h2 className="text-xl font-semibold text-fg mb-4">All Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                variant="list"
              />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
