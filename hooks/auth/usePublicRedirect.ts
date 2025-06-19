// hooks\auth\usePublicRedirect.ts
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth'; 
import { RolesEnum } from '@/lib/auth-types'; 

const defaultRedirectPath = (role: RolesEnum | undefined | null): string => {
  switch (role) {
    case RolesEnum.NATIONALFEDERATION:
      return '/dashboard';
    case RolesEnum.FEDERATION:
      return '/dashboard';
    case RolesEnum.ORGANIZER:
      return '/dashboard';
    case RolesEnum.ATHLETE:
      return '/dashboard'; 
    case RolesEnum.OFFICIAL:
      return '/dashboard';
    default:
      return '/dashboard'; 
  }
};

type UsePublicRedirectOutput = {
  shouldRedirect: boolean;
  loading: boolean;
};

function usePublicRedirect(redirectTo?: string): UsePublicRedirectOutput {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthLoading) {
      setLoading(false);
      return;
    }

    setLoading(true); 
    if (isAuthenticated) {
      setShouldRedirect(true);
      const path = redirectTo || defaultRedirectPath(user?.role);
      router.replace(path);
    } else {
      setShouldRedirect(false);
    }
    setLoading(false);
  }, [isAuthenticated, isAuthLoading, user, router, redirectTo]);

  return { shouldRedirect, loading };
}

export default usePublicRedirect;