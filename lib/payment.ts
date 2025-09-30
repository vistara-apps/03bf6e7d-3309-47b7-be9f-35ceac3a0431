'use client';

import axios from 'axios';
import { WalletClient } from 'viem';
import { base } from 'wagmi/chains';

// USDC token address on Base network
export const USDC_BASE_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

export interface PaymentRequest {
  amount: number; // Amount in USDC (e.g., 0.12 for $0.12)
  recipient: string; // API provider's wallet address
  description: string; // Payment description
  apiEndpoint?: string; // Optional API endpoint for x402 flow
}

export interface PaymentResult {
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  amount: number;
  timestamp: string;
}

export class PaymentService {
  private walletClient: WalletClient | null = null;
  private axiosInstance = axios.create();

  constructor() {
    // Initialize x402-axios interceptors
    this.setupX402Interceptors();
  }

  setWalletClient(client: WalletClient | null) {
    this.walletClient = client;
  }

  private setupX402Interceptors() {
    // Request interceptor to handle x402 payment headers
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add x402 payment headers if needed
        if (config.headers && config.headers['x402-payment-required']) {
          config.headers['Accept'] = 'application/vnd.x402+json';
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle 402 Payment Required responses
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 402) {
          const paymentInfo = error.response.data;
          
          if (paymentInfo && this.walletClient) {
            try {
              // Handle x402 payment flow
              const paymentResult = await this.processX402Payment(paymentInfo);
              
              // Retry the original request with payment proof
              const originalRequest = error.config;
              originalRequest.headers['x402-payment-proof'] = paymentResult.txHash;
              
              return this.axiosInstance.request(originalRequest);
            } catch (paymentError) {
              console.error('Payment failed:', paymentError);
              throw paymentError;
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private async processX402Payment(paymentInfo: any): Promise<PaymentResult> {
    if (!this.walletClient) {
      throw new Error('Wallet client not connected');
    }

    const { amount, recipient, description } = paymentInfo;
    
    try {
      // Convert amount to wei (USDC has 6 decimals)
      const amountWei = BigInt(Math.floor(amount * 1000000));
      
      // Prepare USDC transfer transaction
      const txHash = await this.walletClient.writeContract({
        address: USDC_BASE_ADDRESS as `0x${string}`,
        abi: [
          {
            name: 'transfer',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'to', type: 'address' },
              { name: 'amount', type: 'uint256' }
            ],
            outputs: [{ name: '', type: 'bool' }]
          }
        ] as const,
        functionName: 'transfer',
        args: [recipient as `0x${string}`, amountWei],
        account: this.walletClient.account!,
        chain: base,
      });

      return {
        txHash,
        status: 'pending',
        amount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new Error(`Payment transaction failed: ${error}`);
    }
  }

  async makePayment(request: PaymentRequest): Promise<PaymentResult> {
    if (!this.walletClient) {
      throw new Error('Wallet client not connected');
    }

    try {
      // Convert amount to wei (USDC has 6 decimals)
      const amountWei = BigInt(Math.floor(request.amount * 1000000));
      
      // Execute USDC transfer
      const txHash = await this.walletClient.writeContract({
        address: USDC_BASE_ADDRESS as `0x${string}`,
        abi: [
          {
            name: 'transfer',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'to', type: 'address' },
              { name: 'amount', type: 'uint256' }
            ],
            outputs: [{ name: '', type: 'bool' }]
          }
        ] as const,
        functionName: 'transfer',
        args: [request.recipient as `0x${string}`, amountWei],
        account: this.walletClient.account!,
        chain: base,
      });

      return {
        txHash,
        status: 'pending',
        amount: request.amount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Payment failed:', error);
      throw new Error(`Payment failed: ${error}`);
    }
  }

  async makeX402Request(url: string, config: any = {}): Promise<any> {
    try {
      const response = await this.axiosInstance.request({
        url,
        ...config,
      });
      return response.data;
    } catch (error) {
      console.error('X402 request failed:', error);
      throw error;
    }
  }

  // Note: Transaction status checking is now handled in the usePayment hook
  // using the public client instead of wallet client
}

// Global payment service instance
export const paymentService = new PaymentService();