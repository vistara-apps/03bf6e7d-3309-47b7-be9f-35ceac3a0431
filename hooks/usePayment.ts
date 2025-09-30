'use client';

import { useEffect, useState, useCallback } from 'react';
import { useWalletClient, useAccount, usePublicClient } from 'wagmi';
import { paymentService, PaymentRequest, PaymentResult } from '@/lib/payment';

export interface UsePaymentReturn {
  isConnected: boolean;
  isLoading: boolean;
  makePayment: (request: PaymentRequest) => Promise<PaymentResult>;
  makeX402Request: (url: string, config?: any) => Promise<any>;
  checkTransactionStatus: (txHash: string) => Promise<'pending' | 'confirmed' | 'failed'>;
  error: string | null;
}

export function usePayment(): UsePaymentReturn {
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update payment service with wallet client when it changes
  useEffect(() => {
    paymentService.setWalletClient(walletClient || null);
  }, [walletClient]);

  const makePayment = useCallback(async (request: PaymentRequest): Promise<PaymentResult> => {
    if (!isConnected || !walletClient) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await paymentService.makePayment(request);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, walletClient]);

  const makeX402Request = useCallback(async (url: string, config: any = {}): Promise<any> => {
    if (!isConnected || !walletClient) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await paymentService.makeX402Request(url, config);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'X402 request failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, walletClient]);

  const checkTransactionStatus = useCallback(async (txHash: string): Promise<'pending' | 'confirmed' | 'failed'> => {
    try {
      // Use public client to check transaction receipt
      const receipt = await publicClient?.getTransactionReceipt({
        hash: txHash as `0x${string}`,
      });

      if (receipt) {
        return receipt.status === 'success' ? 'confirmed' : 'failed';
      }
      return 'pending';
    } catch (error) {
      console.error('Error checking transaction status:', error);
      return 'pending';
    }
  }, [publicClient]);

  return {
    isConnected,
    isLoading,
    makePayment,
    makeX402Request,
    checkTransactionStatus,
    error,
  };
}