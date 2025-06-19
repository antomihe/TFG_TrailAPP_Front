// hooks\api\unlogged\auth\useAccountVerification.ts
import { useState, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import type { ConfirmRegistrationDto } from '@/types/api';

export interface AccountVerificationFormValues {
    password: string;
}

export const accountVerificationSchema = Yup.object().shape({
    password: Yup.string()
        .required('La contraseña es obligatoria.')
        .min(8, 'La contraseña debe tener al menos 8 caracteres.')
        .matches(/[A-Z]/, "Debe contener al menos una mayúscula.")
        .matches(/[a-z]/, "Debe contener al menos una minúscula.")
        .matches(/[0-9]/, "Debe contener al menos un número.")
});

interface UseAccountVerificationProps {
    token: string | null | undefined;
}

export const useAccountVerification = ({ token }: UseAccountVerificationProps) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();

    const handleVerifyAccount = useCallback(async (
        values: AccountVerificationFormValues,
        formikActions: { resetForm: () => void; }
    ): Promise<boolean> => {
        if (!token) {
            toast.error("Token de verificación no válido o ausente. No se puede completar el proceso.");
            return false;
        }

        setIsSubmitting(true);
        let success = false;
        try {
            const payload: ConfirmRegistrationDto = {
                token,
                password: values.password
            };
            await api().patch(`/auth/confirm-registration`, payload);

            toast.success('¡Cuenta verificada y contraseña establecida! Serás redirigido para iniciar sesión.');
            formikActions.resetForm();
            router.push('/login');
            success = true;

        } catch (error: any) {
            const errorMessage = errorHandler(error);
            toast.error(errorMessage || 'Error al verificar la cuenta o establecer la contraseña. Inténtalo de nuevo.');
            success = false;
        } finally {
            setIsSubmitting(false);
        }
        return success;
    }, [token, router]);

    const initialFormValues: AccountVerificationFormValues = {
        password: '',
    };

    return {
        initialFormValues,
        validationSchema: accountVerificationSchema,
        isSubmitting,
        handleVerifyAccount,
    };
};