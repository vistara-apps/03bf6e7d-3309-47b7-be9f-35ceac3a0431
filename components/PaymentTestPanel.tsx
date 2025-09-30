'use client';

import { useState } from 'react';
import { useWalletClient, useAccount } from 'wagmi';
import { Play, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { PaymentTestSuite, formatTestResults, TEST_SCENARIOS } from '@/lib/test-utils';

interface TestResult {
  name: string;
  success: boolean;
  message: string;
  details?: any;
}

export function PaymentTestPanel() {
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const runTests = async () => {
    if (!walletClient || !isConnected) {
      setTestResults([{
        name: 'Prerequisites',
        success: false,
        message: 'Please connect your wallet first',
      }]);
      return;
    }

    setIsRunning(true);
    setTestResults([]);

    const testSuite = new PaymentTestSuite(walletClient);
    const results: TestResult[] = [];

    try {
      // Test 1: Basic connectivity
      const connectivityResult = await testSuite.runBasicConnectivityTest();
      results.push({
        name: 'Connectivity Test',
        ...connectivityResult,
      });

      // Test 2: USDC integration
      const usdcResult = await testSuite.runUSDCIntegrationTest();
      results.push({
        name: 'USDC Integration Test',
        ...usdcResult,
      });

      // Test 3: Payment flow simulation
      const paymentResult = await testSuite.simulatePaymentFlow();
      results.push({
        name: 'Payment Flow Simulation',
        ...paymentResult,
      });

    } catch (error) {
      results.push({
        name: 'Test Suite Error',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle2 className="w-5 h-5 text-green-400" />
    ) : (
      <XCircle className="w-5 h-5 text-red-400" />
    );
  };

  return (
    <div className="glass-card rounded-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-fg">Payment System Tests</h2>
          <p className="text-sm text-muted">Verify x402 payment flow implementation</p>
        </div>
        <button
          onClick={runTests}
          disabled={isRunning || !isConnected}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {isRunning ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>Run Tests</span>
        </button>
      </div>

      {/* Test Scenarios Info */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-fg mb-3">Test Scenarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {TEST_SCENARIOS.map((scenario) => (
            <div key={scenario.name} className="p-3 bg-surface/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${
                  scenario.expectedResult === 'success' ? 'bg-green-400' : 'bg-amber-400'
                }`} />
                <span className="text-xs font-medium text-fg">{scenario.name}</span>
              </div>
              <p className="text-xs text-muted">{scenario.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-fg mb-3">Test Results</h3>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div key={index} className="p-4 bg-surface/30 rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(result.success)}
                  <span className="font-medium text-fg">{result.name}</span>
                </div>
                <p className="text-sm text-muted mb-2">{result.message}</p>
                {result.details && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-accent hover:text-accent/80">
                      View Details
                    </summary>
                    <pre className="mt-2 p-2 bg-bg/50 rounded text-muted overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connection Status */}
      {!isConnected && (
        <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-amber-400">
            <XCircle className="w-4 h-4" />
            <span className="text-sm">Connect your wallet to run payment tests</span>
          </div>
        </div>
      )}
    </div>
  );
}