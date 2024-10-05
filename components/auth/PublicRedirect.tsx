'use client';

import React from 'react';
import usePublicRedirect from '@/hooks/usePublicRedirect';

export function PublicRedirect<T>(Component: React.ComponentType<React.PropsWithChildren<T>>) {
    return function PublicComponent(props: React.PropsWithChildren<T>) {
        const shouldRedirect = usePublicRedirect();

        if (!shouldRedirect) {
            return <Component {...props} />;
        }

        return <></>;
    };
}
