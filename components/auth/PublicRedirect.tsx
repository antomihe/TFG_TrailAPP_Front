// components\auth\PublicRedirect.tsx
'use client';

import React from 'react';
import { usePublicRedirect } from '@/hooks/auth/usePublicRedirect';
import { Loading } from '@/components/pages';

interface PublicRedirectOptions {
  redirectTo?: string;
}

export function PublicRedirect<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: PublicRedirectOptions
) {
  function WithPublicRedirect(props: P) {
    const { isAuthResolved, shouldAttemptRedirect } = usePublicRedirect(options?.redirectTo);

    if (!isAuthResolved) {
      return <Loading />;
    }

    if (shouldAttemptRedirect) {
      return <Loading />; 
    }

    return <WrappedComponent {...props} />;
  }

  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithPublicRedirect.displayName = `PublicRedirect(${displayName})`;

  return WithPublicRedirect;
}
