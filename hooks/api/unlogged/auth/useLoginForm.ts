// hooks\api\unlogged\auth\useLoginForm.ts

import { useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import { AuthData, RolesEnum } from '@/lib/auth-types'; 
import type { LoginRequestDto, LoginResponseDto, UserRole } from '@/types/api';

export type LoginFormValues = LoginRequestDto;

export const FIELD_NAMES: { [K in keyof LoginFormValues]: K } = {
    email: 'email',
    password: 'password',
};

export const loginSchema = Yup.object().shape({
    [FIELD_NAMES.email]: Yup.string()
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'El email no es válido.'
        )
        .required('El email es obligatorio.'),
    [FIELD_NAMES.password]: Yup.string().required('La contraseña es obligatoria.'),
});

export const useLoginForm = () => {
    const { login: loginUserInContext, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const redirectTo = searchParams.get('to') || '/dashboard';

    const handleLogin = useCallback(
        async (
            values: LoginFormValues,
            formikActions: { resetForm: () => void; setSubmitting: (isSubmitting: boolean) => void; }
        ): Promise<boolean> => {
            let loginSuccess = false;
            formikActions.setSubmitting(true);
            try {
                const response = await api().post<LoginResponseDto>('/auth/login', values);
                const apiData = response.data;

                const authData: AuthData = {
                    access_token: apiData.access_token,
                    user: {
                        id: apiData.id,
                        username: apiData.username,
                        role: apiData.role as RolesEnum,
                        email: apiData.email,
                    },
                };

                await loginUserInContext(authData, redirectTo);
                formikActions.resetForm();
                loginSuccess = true;
            } catch (error: any) {
                const errorMessage = errorHandler(error);
                toast.error(errorMessage || 'Error al iniciar sesión. Inténtalo de nuevo.');
                loginSuccess = false;
            } finally {
                formikActions.setSubmitting(false);
            }
            return loginSuccess;
        },
        [loginUserInContext, redirectTo]
    );

    const initialFormValues: LoginFormValues = {
        [FIELD_NAMES.email]: '',
        [FIELD_NAMES.password]: '',
    };

    return {
        initialFormValues,
        validationSchema: loginSchema,
        handleLogin,
        FIELD_NAMES,
        isAuthLoading, 
    };
};