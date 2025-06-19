// hooks\api\unlogged\auth\usePasswordRecovery.ts
import { useState, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import * as Yup from 'yup';
import type { FormikHelpers } from 'formik';
import type { RecoverEmailDto } from '@/types/api';

export type RequestPasswordResetFormValues = RecoverEmailDto;

export const FIELD_NAMES: { [K in keyof RequestPasswordResetFormValues]: K } = {
    email: 'email',
};

export const requestPasswordResetSchema = Yup.object().shape({
    [FIELD_NAMES.email]: Yup.string()
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'El email no es válido.'
        ).required('El email es obligatorio para recuperar tu contraseña.'),
});

export const useRequestPasswordReset = () => {
    const [requestSentSuccessfully, setRequestSentSuccessfully] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    const handlePasswordResetRequest = useCallback(
        async (
            values: RequestPasswordResetFormValues,
            formikActions: FormikHelpers<RequestPasswordResetFormValues>
        ): Promise<void> => {
            setIsSubmitting(true);
            setRequestSentSuccessfully(false);
            try {
                const payload: RecoverEmailDto = { email: values.email };
                await api().post('/auth/password-reset/request', payload);
                setRequestSentSuccessfully(true);
                formikActions.resetForm();
            } catch (error: unknown) {
                const errorMessage = errorHandler(error);
                toast.error(
                    errorMessage === 'User not found' || (typeof errorMessage === 'string' && errorMessage.includes('no encontrado'))
                        ? 'Si tu email está registrado, recibirás un enlace. Si no, verifica el email e inténtalo de nuevo.'
                        : 'Error al enviar la solicitud. Por favor, inténtalo de nuevo más tarde.'
                );
                setRequestSentSuccessfully(false);
            } finally {
                setIsSubmitting(false);
            }
        },
        []
    );

    const initialFormValues: RequestPasswordResetFormValues = {
        [FIELD_NAMES.email]: '',
    };

    return {
        initialFormValues,
        validationSchema: requestPasswordResetSchema,
        requestSentSuccessfully,
        isSubmitting,
        handlePasswordResetRequest,
        setRequestSentSuccessfully, 
        FIELD_NAMES,
    };
};