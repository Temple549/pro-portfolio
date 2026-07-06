"use client";

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 px-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">!</h1>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-zinc-500 mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}