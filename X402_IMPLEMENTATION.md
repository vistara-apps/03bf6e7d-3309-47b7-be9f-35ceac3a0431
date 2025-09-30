# x402 Payment Flow Implementation

This document outlines the implementation of the x402 payment protocol for the PayBot application.

## Overview

The x402 payment flow has been successfully implemented using:
- **wagmi v2** with `useWalletClient` hook
- **x402-axios** package for payment protocol
- **USDC on Base** network for stablecoin payments
- **Comprehensive error handling** and transaction confirmation

## Key Components

### 1. Payment Service (`lib/payment.ts`)

The core payment service handles:
- USDC balance checking
- Transaction simulation and execution
- Transaction confirmation monitoring
- Error handling for various failure scenarios

```typescript
class X402PaymentService {
  // Initiates payment with USDC on Base
  async initiatePayment(params: PaymentParams): Promise<PaymentResult>
  
  // Checks user's USDC balance
  private async getUSDCBalance(address: string): Promise<number>
  
  // Executes USDC transfer transaction
  private async transferUSDC(params): Promise<string>
  
  // Waits for transaction confirmation
  async waitForConfirmation(txHash: string): Promise<boolean>
}
```

### 2. Wagmi Configuration (`lib/wagmi.ts`)

Configured wagmi with:
- Base network support
- Coinbase Wallet connector
- Proper TypeScript types

### 3. Agent Chat Integration (`components/AgentChatCard.tsx`)

Enhanced the chat interface with:
- Wallet connection status checks
- Real-time payment processing
- Transaction hash display with Base explorer links
- Comprehensive error handling

### 4. Test Suite (`lib/test-utils.ts` & `components/PaymentTestPanel.tsx`)

Comprehensive testing tools including:
- Connectivity tests
- USDC integration verification
- Payment flow simulation
- Error scenario testing

## Implementation Details

### USDC on Base Integration

- **Contract Address**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Decimals**: 6
- **Network**: Base (Chain ID: 8453)

### Transaction Flow

1. **Wallet Connection**: User connects wallet via Coinbase OnchainKit
2. **Balance Check**: Verify sufficient USDC balance
3. **Transaction Simulation**: Simulate transfer to catch errors early
4. **Transaction Execution**: Execute USDC transfer using wallet client
5. **Confirmation**: Monitor transaction until confirmed
6. **Result Display**: Show success/failure with transaction hash

### Error Handling

The implementation handles multiple error scenarios:

- **Wallet Not Connected**: Prompts user to connect wallet
- **Insufficient Balance**: Shows balance shortfall
- **Network Errors**: Handles RPC failures gracefully
- **Transaction Rejection**: User denial scenarios
- **Confirmation Timeout**: Transaction mining issues

## Testing

### Test Scenarios

1. **Successful Payment**: Normal payment flow
2. **Insufficient Balance**: Payment with low USDC balance
3. **Wallet Disconnected**: Payment without wallet connection
4. **Network Issues**: Connectivity problems
5. **User Rejection**: Transaction denial by user

### Running Tests

1. Navigate to `/test` page in the application
2. Connect your wallet
3. Click "Run Tests" to execute the test suite
4. Review results for each test scenario

## Security Considerations

- **Balance Verification**: Always check balance before attempting payment
- **Transaction Simulation**: Simulate transactions to catch errors early
- **User Confirmation**: Require explicit user approval for all payments
- **Error Boundaries**: Graceful error handling prevents application crashes

## Usage Example

```typescript
import { createX402Request } from '@/lib/payment';
import { useWalletClient } from 'wagmi';

const { data: walletClient } = useWalletClient();

const result = await createX402Request(
  'https://api.example.com/data',
  0.12, // $0.12 USDC
  walletClient
);

if (result.success) {
  console.log('Payment successful:', result.txHash);
  console.log('API data:', result.data);
} else {
  console.error('Payment failed:', result.error);
}
```

## Deployment Requirements

### Environment Variables

```env
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Dependencies

```json
{
  "wagmi": "^2.14.11",
  "viem": "^2.27.2",
  "@coinbase/onchainkit": "^0.38.19",
  "x402-axios": "latest"
}
```

## Verification Checklist

- [x] **wagmi useWalletClient Integration**: ✅ Implemented
- [x] **x402-axios Integration**: ✅ Implemented  
- [x] **USDC on Base Support**: ✅ Verified
- [x] **End-to-End Payment Flow**: ✅ Tested
- [x] **Transaction Confirmations**: ✅ Monitored
- [x] **Error Handling**: ✅ Comprehensive
- [x] **Test Suite**: ✅ Available at `/test`

## Next Steps

The x402 payment flow is now fully implemented and ready for production use. All Linear issue requirements have been satisfied:

1. ✅ Use wagmi useWalletClient + x402-axios
2. ✅ Test payment flow end-to-end  
3. ✅ Verify USDC on Base integration
4. ✅ Check transaction confirmations
5. ✅ Test error handling

The implementation is production-ready with comprehensive testing and error handling.