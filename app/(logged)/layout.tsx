'use client'

import React, { ReactNode } from 'react';
import { AuthRedirect } from '@/components/auth/AuthRedirect';

const AuthLayout = ({ children }: { children: ReactNode }) => {
    const AuthWrapper = AuthRedirect(({ children }: { children: ReactNode }) => (
        <>{children}</>
    ));

    return (
        <AuthWrapper>
            {children}
        </AuthWrapper>
    );
};

export default AuthLayout;
