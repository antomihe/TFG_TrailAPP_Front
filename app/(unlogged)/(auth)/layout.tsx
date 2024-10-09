'use client';

import React, { ReactNode } from 'react';
import { PublicRedirect } from '@/components/auth/PublicRedirect';

const PublicLayout = ({ children }: { children: ReactNode }) => {
    const PublicWrapper = PublicRedirect(({ children }: { children: ReactNode }) => {
        return <>{children}</>;
    });

    return <PublicWrapper>{children}</PublicWrapper>;
};

export default PublicLayout;
