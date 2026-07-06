"use client"; // This must be the very first line

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to your server monitoring system here
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center' }}>
        <h2>Something went wrong globally!</h2>
        <button
          onClick={() => reset()}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}