import * as Sentry from '@sentry/nextjs';

export function reportError(error: unknown) {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
  if (!dsn) {
    console.error(error);
    return;
  }
  Sentry.captureException(error);
}
