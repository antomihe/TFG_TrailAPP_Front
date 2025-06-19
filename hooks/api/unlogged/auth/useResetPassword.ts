// hooks\api\unlogged\auth\useResetPassword.ts
import { useState, useCallback, useEffect } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import type { FormikHelpers } from 'formik';
import type { RecoverPasswordDto } from '@/types/api';

export interface ResetPasswordFormValues {
    password: string;
    confirmPassword: string;
}

export const FIELD_NAMES: { [K in keyof ResetPasswordFormValues]: K } = {
    password: 'password',
    confirmPassword: 'confirmPassword',
};

export const resetPasswordSchema = Yup.object().shape({
    [FIELD_NAMES.password]: Yup.string()
        .required('La nueva contraseña es obligatoria.')
        .min(8, 'La contraseña debe tener al menos 8 caracteres.')
        .matches(/[A-Z]/, "Debe contener al menos una mayúscula.")
        .matches(/[a-z]/, "Debe contener al menos una minúscula.")
        .matches(/[0-9]/, "Debe contener al menos un número."),
    [FIELD_NAMES.confirmPassword]: Yup.string()
        .oneOf([Yup.ref(FIELD_NAMES.password)], 'Las contraseñas deben coincidir.')
        .required('Debes confirmar tu nueva contraseña.'),
});

interface UseResetPasswordProps {
    token: string | null | undefined;
}

export const useResetPassword = ({ token }: UseResetPasswordProps) => {
    const [isTokenValid, setIsTokenValid] = useState<boolean>(!!token);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        setIsTokenValid(!!token);
    }, [token]);

    const handleResetPassword = useCallback(
        async (
            values: ResetPasswordFormValues,
            formikActions: FormikHelpers<ResetPasswordFormValues>
        ): Promise<boolean> => {
            if (!token) {
                toast.error("El enlace para restablecer la contraseña no es válido o ha expirado. Solicita uno nuevo.");
                formikActions.setSubmitting(false);
                return false;
            }

            setIsSubmitting(true);
            let success = false;
            try {
                const payload: RecoverPasswordDto = {
                    token,
                    password: values.password,
                };
                await api().patch(`/auth/password-reset/complete`, payload);

                toast.success('¡Contraseña actualizada con éxito! Ya puedes iniciar sesión con tu nueva contraseña.');
                formikActions.resetForm();
                router.push('/login');
                success = true;
            } catch (error: unknown) {
                const errorMessage = errorHandler(error);
                toast.error(errorMessage || 'Error al actualizar la contraseña. Por favor, inténtalo de nuevo.');
                if (typeof errorMessage === 'string' && (errorMessage.toLowerCase().includes('invalid or expired token') || errorMessage.toLowerCase().includes('inválido o expirado'))) {
                    setIsTokenValid(false);
                }
                success = false;
            } finally {
                setIsSubmitting(false);
            }
            return success;
        },
        [token, router]
    );

    const initialFormValues: ResetPasswordFormValues = {
        [FIELD_NAMES.password]: '',
        [FIELD_NAMES.confirmPassword]: '',
    };

    return {
        initialFormValues,
        validationSchema: resetPasswordSchema,
        isTokenValid,
        isSubmitting,
        handleResetPassword,
        FIELD_NAMES,
    };
};