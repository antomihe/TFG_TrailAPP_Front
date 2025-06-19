// contexts\AuthContext.tsx
'use client';

import React, { createContext, ReactNode, useContext } from 'react';
import { User, AuthData } from '@/lib/auth-types';
import { useProvideAuth } from '@/hooks/auth/useProvideAuth';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (authData: AuthData, redirectTo?: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUserInContext: (updatedUser: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};