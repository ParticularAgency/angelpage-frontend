'use client';

import { useEffect } from 'react';
import { reportError } from '@/lib/reportError';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#FCF2FF',
          color: '#0B0112',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        <main style={{ textAlign: 'center', padding: 24 }}>
          <h1 style={{ fontFamily: 'Lustria, serif', fontWeight: 400 }}>
            Something went wrong
          </h1>
          <p>Angelpage hit an unexpected error.</p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 16,
              border: 0,
              borderRadius: 999,
              background: '#611192',
              color: '#fff',
              padding: '12px 22px',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
