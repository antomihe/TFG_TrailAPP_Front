'use client';

import React from 'react';
import useAuthRedirect from '@/hooks/useAuthRedirect';

export function AuthRedirect<T>(Component: React.ComponentType<React.PropsWithChildren<T>>) {
    return function AuthenticatedComponent(props: React.PropsWithChildren<T>) {
        const shouldRedirect = useAuthRedirect();

        if (!shouldRedirect) {
            return <Component {...props} />;
        }

        return <></>;
    };
}
