import { createFileRoute, redirect } from '@tanstack/react-router';

// The work wall is the home page; keep /work working for anyone who types it.
export const Route = createFileRoute('/work/')({
  beforeLoad: () => {
    throw redirect({ to: '/', statusCode: 301 });
  }
});
