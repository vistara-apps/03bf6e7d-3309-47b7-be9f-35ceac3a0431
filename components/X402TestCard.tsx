'use client';

import { useState } from 'react';
import { usePayment } from '@/hooks/usePayment';
import { Loader2, CheckCircle2, XCircle, TestTube } from 'lucide-react';

export function X402TestCard() {
  const { isConnected, makeX402Request, error } = usePayment();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [testError, setTestError] = useState<string | null>(null);

  const testX402Flow = async () => {
    if (!isConnected) {
      setTestError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setTestError(null);

    try {
      // Test GET request to x402 endpoint
      const response = await makeX402Request('/api/test-x402', {
        method: 'GET',
      });

      setResult(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Test failed';
      setTestError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const testX402Post = async () => {
    if (!isConnected) {
      setTestError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setTestError(null);

    try {
      // Test POST request to x402 endpoint
      const response = await makeX402Request('/api/test-x402', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          query: 'Test query from x402 flow'
        }
      });

      setResult(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Test failed';
      setTestError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <TestTube className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-fg">X402 Payment Flow Test</h2>
          <p className="text-sm text-muted">Test the automated payment system</p>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-4 p-3 rounded-lg border flex items-center gap-2">
        {isConnected ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-500">Wallet Connected</span>
          </>
        ) : (
          <>
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-500">Wallet Not Connected</span>
          </>
        )}
      </div>

      {/* Test Buttons */}
      <div className="space-y-3 mb-6">
        <button
          onClick={testX402Flow}
          disabled={!isConnected || isLoading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          Test X402 GET Request
        </button>

        <button
          onClick={testX402Post}
          disabled={!isConnected || isLoading}
          className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          Test X402 POST Request
        </button>
      </div>

      {/* Error Display */}
      {(error || testError) && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-500">Error</span>
          </div>
          <p className="text-sm text-red-400">{error || testError}</p>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">Success</span>
          </div>
          <pre className="text-xs text-fg bg-surface/50 p-3 rounded overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h3 className="text-sm font-medium text-blue-400 mb-2">Test Instructions:</h3>
        <ol className="text-xs text-blue-300 space-y-1">
          <li>1. Connect your wallet using the button in the header</li>
          <li>2. Ensure you have USDC on Base network for payments</li>
          <li>3. Click a test button to trigger the x402 payment flow</li>
          <li>4. The system will automatically handle payment and retry the request</li>
          <li>5. Check the result to verify the flow worked correctly</li>
        </ol>
      </div>
    </div>
  );
}