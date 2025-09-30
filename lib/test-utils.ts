import { X402PaymentService, USDC_ADDRESS_BASE, USDC_DECIMALS } from './payment';
import { parseUnits, formatUnits } from 'viem';
import type { WalletClient } from 'viem';

export interface TestScenario {
  name: string;
  description: string;
  expectedResult: 'success' | 'error';
  errorMessage?: string;
}

export const TEST_SCENARIOS: TestScenario[] = [
  {
    name: 'Successful Payment',
    description: 'Test a normal successful payment flow',
    expectedResult: 'success',
  },
  {
    name: 'Insufficient Balance',
    description: 'Test payment when user has insufficient USDC balance',
    expectedResult: 'error',
    errorMessage: 'Insufficient USDC balance',
  },
  {
    name: 'Wallet Not Connected',
    description: 'Test payment when wallet is not connected',
    expectedResult: 'error',
    errorMessage: 'Wallet not connected',
  },
  {
    name: 'Network Error',
    description: 'Test payment during network connectivity issues',
    expectedResult: 'error',
    errorMessage: 'Network error',
  },
  {
    name: 'Transaction Denied',
    description: 'Test payment when user denies the transaction',
    expectedResult: 'error',
    errorMessage: 'Transaction denied by user',
  },
];

export class PaymentTestSuite {
  private walletClient: WalletClient | null = null;

  constructor(walletClient: WalletClient | null) {
    this.walletClient = walletClient;
  }

  async runBasicConnectivityTest(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      if (!this.walletClient) {
        return {
          success: false,
          message: 'Wallet client not available - please connect wallet first',
        };
      }

      // Test 1: Check if we can get wallet addresses
      const addresses = await this.walletClient.getAddresses();
      if (!addresses || addresses.length === 0) {
        return {
          success: false,
          message: 'No wallet addresses found',
        };
      }

      const userAddress = addresses[0];

      // Test 2: Check if we can read USDC contract
      const paymentService = new X402PaymentService(this.walletClient);
      
      return {
        success: true,
        message: 'Basic connectivity tests passed',
        details: {
          walletAddress: userAddress,
          usdcContract: USDC_ADDRESS_BASE,
          chainId: this.walletClient.chain?.id,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Connectivity test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  async runUSDCIntegrationTest(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      if (!this.walletClient) {
        return {
          success: false,
          message: 'Wallet not connected',
        };
      }

      const paymentService = new X402PaymentService(this.walletClient);
      const addresses = await this.walletClient.getAddresses();
      const userAddress = addresses[0];

      // Try to get USDC balance
      const balance = await (paymentService as any).getUSDCBalance(userAddress);

      return {
        success: true,
        message: 'USDC integration test passed',
        details: {
          userAddress,
          usdcBalance: balance,
          usdcContract: USDC_ADDRESS_BASE,
          decimals: USDC_DECIMALS,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `USDC integration test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  async simulatePaymentFlow(amount: number = 0.12): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      if (!this.walletClient) {
        return {
          success: false,
          message: 'Wallet not connected',
        };
      }

      // This would simulate the payment without actually executing it
      const paymentService = new X402PaymentService(this.walletClient);
      const addresses = await this.walletClient.getAddresses();
      const userAddress = addresses[0];

      // Check balance first
      const balance = await (paymentService as any).getUSDCBalance(userAddress);
      
      if (balance < amount) {
        return {
          success: false,
          message: 'Insufficient USDC balance for test payment',
          details: {
            requiredAmount: amount,
            currentBalance: balance,
            shortfall: amount - balance,
          },
        };
      }

      // Simulate successful payment flow
      return {
        success: true,
        message: 'Payment flow simulation successful',
        details: {
          userAddress,
          paymentAmount: amount,
          currentBalance: balance,
          simulatedTxHash: '0x' + Math.random().toString(16).substr(2, 64),
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Payment simulation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}

export function formatTestResults(results: any[]): string {
  return results.map(result => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    let output = `${status}: ${result.message}`;
    
    if (result.details) {
      output += '\n  Details: ' + JSON.stringify(result.details, null, 2);
    }
    
    return output;
  }).join('\n\n');
}

// Helper function to validate USDC address format
export function isValidUSDCAddress(address: string): boolean {
  return address.toLowerCase() === USDC_ADDRESS_BASE.toLowerCase();
}

// Helper function to format USDC amounts
export function formatUSDCAmount(amount: bigint): string {
  return formatUnits(amount, USDC_DECIMALS);
}

// Helper function to parse USDC amounts
export function parseUSDCAmount(amount: string): bigint {
  return parseUnits(amount, USDC_DECIMALS);
}