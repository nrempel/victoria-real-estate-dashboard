'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="h-px bg-border/60 w-16 mx-auto mb-6" />
          <h2 className="font-display text-2xl font-medium text-foreground mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground">
            We encountered an error while loading the dashboard.
          </p>
        </div>

        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>

        {error.digest && (
          <p className="mt-4 text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
