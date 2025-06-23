// hooks\auth\useProvideAuth.ts

import { useState, useEffect, useCallback } from 'react';
import { User, AuthData } from '@/lib/auth-types';
import {
    setAuthDataCookiesAction,
    clearAuthCookiesAction,
    updateUserDetailsCookieAction,
    getAuthDataFromCookies
} from '@/lib/actions';
import apiClient from '@/config/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { TokenValidResponseDto } from '@/types/api';

export const useProvideAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    const clearSessionInternal = useCallback(async () => {
        setUser(null);
        setToken(null);
        if (apiClient().defaults.headers.common['Authorization']) {
            delete apiClient().defaults.headers.common['Authorization'];
        }
        await clearAuthCookiesAction();
    }, []);

    useEffect(() => {
        const rehydrate = async () => {
            const authDataFromCookies = await getAuthDataFromCookies();

            if (authDataFromCookies) {
                const { user: cookieUser, access_token } = authDataFromCookies;
                try {
                    const api = apiClient(access_token);
                    const response = await api.post<TokenValidResponseDto>(`/auth/token-validation`);

                    if (response.data?.userId === cookieUser.id) {
                        setUser(cookieUser);
                        setToken(access_token);
                        apiClient().defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                    } else {
                        await clearSessionInternal();
                    }
                } catch (error) {
                    await clearSessionInternal();
                }
            }
            setIsLoading(false);
        };
        if (!isLoggingOut) { 
            rehydrate();
        } else {
            setIsLoading(false); 
        }
    }, [clearSessionInternal, isLoggingOut]); 

    const login = useCallback(async (authDataToSet: AuthData, redirectTo: string = '/dashboard') => {
        setIsLoading(true);
        try {
            setUser(authDataToSet.user);
            setToken(authDataToSet.access_token);
            apiClient().defaults.headers.common['Authorization'] = `Bearer ${authDataToSet.access_token}`;
            await setAuthDataCookiesAction(authDataToSet);
            router.push(redirectTo);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Error al procesar los datos de sesión.';
            toast.error('Error de Inicio de Sesión', { description: errorMessage });
            await clearSessionInternal();
        } finally {
            setIsLoading(false);
        }
    }, [router, clearSessionInternal]);

    const logout = useCallback(async () => {
        setIsLoading(true);
        setIsLoggingOut(true);
        await clearSessionInternal();
        router.push('/');
        Promise.resolve().then(() => {
            setIsLoading(false);
            setIsLoggingOut(false);
        });
    }, [router, clearSessionInternal]);

    const updateUserInContext = useCallback(async (updatedUserInfo: Partial<User>) => {
        setUser((prevUser) => {
            if (!prevUser) return null;
            const newUser = { ...prevUser, ...updatedUserInfo };
            updateUserDetailsCookieAction(newUser);
            return newUser;
        });
    }, []);

    return {
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        updateUserInContext,
    };
};