// hooks\auth\usePublicRedirect.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import type { RolesEnum } from '@/lib/auth-types'; 

const defaultRedirectPath = (role: RolesEnum | undefined | null): string => {
  return '/dashboard';
};

export function usePublicRedirect(redirectTo?: string): { isAuthResolved: boolean; shouldAttemptRedirect: boolean } {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const router = useRouter();
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const [shouldAttemptRedirect, setShouldAttemptRedirect] = useState(false);

  useEffect(() => {
    if (isAuthLoading) {
      setIsAuthResolved(false); 
      setShouldAttemptRedirect(false); 
      return;
    }

    setIsAuthResolved(true);

    if (isAuthenticated) {
      setShouldAttemptRedirect(true);
      const path = redirectTo || defaultRedirectPath(user?.role);
      router.replace(path); 
    } else {
      setShouldAttemptRedirect(false);
    }
  }, [isAuthenticated, isAuthLoading, user, router, redirectTo]);

  return { isAuthResolved, shouldAttemptRedirect };
}
