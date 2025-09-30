import { base } from 'wagmi/chains';
import { parseUnits, formatUnits, createPublicClient, http } from 'viem';
import type { WalletClient } from 'viem';

// USDC contract address on Base network
export const USDC_ADDRESS_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// USDC has 6 decimals
export const USDC_DECIMALS = 6;

export interface PaymentParams {
  amount: number; // Amount in USD
  recipient: string; // Recipient address
  description?: string;
}

export interface PaymentResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

// Create a public client for reading blockchain data
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export class X402PaymentService {
  private walletClient: WalletClient;

  constructor(walletClient: WalletClient) {
    this.walletClient = walletClient;
  }

  async initiatePayment(params: PaymentParams): Promise<PaymentResult> {

    try {
      // Convert USD amount to USDC (assuming 1:1 parity)
      const usdcAmount = parseUnits(params.amount.toString(), USDC_DECIMALS);
      
      // Get user's address
      const [userAddress] = await this.walletClient.getAddresses();
      
      if (!userAddress) {
        return { success: false, error: 'No wallet address found' };
      }

      // Check USDC balance
      const balance = await this.getUSDCBalance(userAddress);
      if (balance < params.amount) {
        return { success: false, error: 'Insufficient USDC balance' };
      }

      // Prepare USDC transfer transaction
      const txHash = await this.transferUSDC({
        from: userAddress,
        to: params.recipient,
        amount: usdcAmount,
      });

      return { success: true, txHash };
    } catch (error) {
      console.error('Payment failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private async getUSDCBalance(address: string): Promise<number> {
    try {
      // Call USDC balanceOf function using public client
      const balance = await publicClient.readContract({
        address: USDC_ADDRESS_BASE as `0x${string}`,
        abi: [
          {
            name: 'balanceOf',
            type: 'function',
            stateMutability: 'view',
            inputs: [{ name: 'account', type: 'address' }],
            outputs: [{ name: '', type: 'uint256' }],
          },
        ],
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      });

      // Convert from USDC units to USD (assuming 1:1 parity)
      return parseFloat(formatUnits(balance as bigint, USDC_DECIMALS));
    } catch (error) {
      console.error('Failed to get USDC balance:', error);
      return 0;
    }
  }

  private async transferUSDC(params: {
    from: string;
    to: string;
    amount: bigint;
  }): Promise<string> {
    // Create transaction request for USDC transfer
    const request = await publicClient.simulateContract({
      address: USDC_ADDRESS_BASE as `0x${string}`,
      abi: [
        {
          name: 'transfer',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' },
          ],
          outputs: [{ name: '', type: 'bool' }],
        },
      ],
      functionName: 'transfer',
      args: [params.to as `0x${string}`, params.amount],
      account: params.from as `0x${string}`,
    });

    // Execute the transaction using wallet client
    const txHash = await this.walletClient.writeContract(request.request);

    return txHash;
  }

  async waitForConfirmation(txHash: string, maxRetries = 30): Promise<boolean> {
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        const receipt = await publicClient.getTransactionReceipt({
          hash: txHash as `0x${string}`,
        });
        
        if (receipt) {
          return receipt.status === 'success';
        }
      } catch (error) {
        // Transaction might not be mined yet
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      retries++;
    }
    
    return false;
  }
}

// x402-axios integration
export async function createX402Request(
  apiEndpoint: string,
  paymentAmount: number,
  walletClient: WalletClient
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  txHash?: string;
}> {

  try {
    // For now, we'll implement a simple payment flow
    // In a real x402 implementation, this would interact with x402-enabled APIs
    const paymentService = new X402PaymentService(walletClient);
    
    // This would be the x402 payment server address in a real implementation
    const paymentRecipient = '0x742d35cc6635c0532925a3b8d99d25aa2731ccA9'; // Example address
    
    const paymentResult = await paymentService.initiatePayment({
      amount: paymentAmount,
      recipient: paymentRecipient,
      description: `Payment for API call to ${apiEndpoint}`,
    });

    if (!paymentResult.success) {
      return { success: false, error: paymentResult.error };
    }

    // Wait for transaction confirmation
    const confirmed = paymentResult.txHash 
      ? await paymentService.waitForConfirmation(paymentResult.txHash) 
      : false;

    if (!confirmed) {
      return { success: false, error: 'Transaction failed to confirm' };
    }

    // Simulate API call after successful payment
    // In a real x402 implementation, the API would verify the payment on-chain
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock API response
    const mockApiResponse = {
      weather: {
        temperature: 72,
        condition: 'Sunny',
        location: 'New York City',
      },
      timestamp: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockApiResponse,
      txHash: paymentResult.txHash,
    };
  } catch (error) {
    console.error('x402 request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}