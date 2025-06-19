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
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const clearSessionInternal = useCallback(async () => {
        setUser(null);
        setToken(null);
        await clearAuthCookiesAction();
    }, []);

    useEffect(() => {
        const rehydrate = async () => {
            setIsLoading(true);
            const authDataFromCookies = await getAuthDataFromCookies();

            if (authDataFromCookies) {
                const { user: cookieUser, access_token } = authDataFromCookies;
                try {
                    const api = apiClient(access_token);
                    const response = await api.post<TokenValidResponseDto>(`/auth/token-validation`);
                    if (response.data?.userId === cookieUser.id) {
                        setUser(cookieUser);
                        setToken(access_token);
                    } else {
                        await clearSessionInternal();
                    }
                } catch (error) {
                    console.warn("Token validation failed:", error);
                    await clearSessionInternal();
                }
            } else {
                await clearSessionInternal();
            }
            setIsLoading(false);
        };
        rehydrate();
    }, [clearSessionInternal]);

    const login = useCallback(async (authDataToSet: AuthData, redirectTo: string = '/dashboard') => {
        setIsLoading(true);
        try {
            setUser(authDataToSet.user);
            setToken(authDataToSet.access_token);
            await setAuthDataCookiesAction(authDataToSet);
            toast.success('Inicio de sesión exitoso!');
            router.push(redirectTo);
        } catch (error: any) {
            console.error('Error processing login data in useProvideAuth:', error);
            toast.error('Error al procesar los datos de sesión.');
            await clearSessionInternal();
        } finally {
            setIsLoading(false);
        }
    }, [router, clearSessionInternal]);

    const logout = useCallback(async () => {
        setIsLoading(true);
        await clearSessionInternal();
        toast.info('Sesión cerrada.');
        router.push('/');
        setIsLoading(false);
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
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUserInContext,
    };
};