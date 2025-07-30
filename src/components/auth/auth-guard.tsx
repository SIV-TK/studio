'use client';

import { useSession } from '@/hooks/use-session';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession();

  useEffect(() => {
    if (!loading && !session) {
      window.location.href = '/login';
    }
  }, [session, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}