'use client';

import { XCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="glass-card rounded-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-error" />
        </div>
        <h2 className="text-2xl font-bold text-fg mb-2">Something went wrong!</h2>
        <p className="text-muted mb-6">{error.message}</p>
        <button onClick={reset} className="btn-primary w-full">
          Try Again
        </button>
      </div>
    </div>
  );
}
