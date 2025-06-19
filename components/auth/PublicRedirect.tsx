// components\auth\PublicRedirect.tsx
'use client';

import React from 'react';
import usePublicRedirect from '@/hooks/auth/usePublicRedirect'; 
import { Loading } from '@/components/pages'; 

interface PublicRedirectOptions {
  redirectTo?: string; 
}

export function PublicRedirect<P extends object>( 
  Component: React.ComponentType<P>,
  options?: PublicRedirectOptions
) {
  return function PublicComponent(props: P) { 
    const { shouldRedirect, loading } = usePublicRedirect(options?.redirectTo);

    if (loading) {
      return <Loading />;
    }

    if (shouldRedirect) {
      return null;
    }

    return <Component {...props} />;
  };
}