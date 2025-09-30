'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/wagmi';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider 
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || 'cdp_demo_key'} 
          chain={base}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
