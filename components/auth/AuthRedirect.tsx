'use client';

import React from 'react';
import useAuthRedirect from '@/hooks/useAuthRedirect';
import { Loading } from '@/components/pages';

export function AuthRedirect<T>(Component: React.ComponentType<React.PropsWithChildren<T>>) {
    return function AuthenticatedComponent(props: React.PropsWithChildren<T>) {
        const { shouldRedirect, loading } = useAuthRedirect();

        if (loading) {
            return <Loading />;
        }

        if (!shouldRedirect) {
            return <Component {...props} />;
        }

        return null;
    };
}
