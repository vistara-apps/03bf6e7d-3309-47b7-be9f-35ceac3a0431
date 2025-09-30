export interface User {
  id: string;
  farcaster_fid?: number;
  wallet_address: string;
  created_at: string;
  spending_cap_daily: number;
  spending_cap_monthly: number;
  notifications_enabled: boolean;
}

export interface AgentRequest {
  id: string;
  user_id: string;
  template_id?: string;
  raw_query: string;
  parsed_intent?: Record<string, any>;
  api_endpoint?: string;
  payment_amount: number;
  payment_tx_hash?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result_data?: Record<string, any>;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export interface Payment {
  id: string;
  agent_request_id: string;
  kite_tx_hash: string;
  amount_usd: number;
  api_cost: number;
  platform_fee: number;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
  confirmed_at?: string;
}

export interface Template {
  id: string;
  creator_id: string;
  name: string;
  description: string;
  category: 'weather' | 'crypto' | 'scraper' | 'sentiment' | 'custom';
  prompt_template: string;
  api_config: Record<string, any>;
  default_payment_amount: number;
  use_count: number;
  revenue_generated: number;
  is_public: boolean;
  featured: boolean;
  created_at: string;
}

export interface SpendingAlert {
  id: string;
  user_id: string;
  alert_type: 'daily_80' | 'daily_100' | 'monthly_80' | 'monthly_100';
  triggered_at: string;
  acknowledged: boolean;
}
