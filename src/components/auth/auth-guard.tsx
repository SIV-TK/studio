'use client';

import { useEffect, useState } from 'react';
import { AuthService } from '@/lib/auth-service';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const userId = localStorage.getItem('currentUserId');
      if (!userId) {
        window.location.href = '/home';
        return;
      }
      setIsAuthenticated(true);
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return <>{children}</>;
}