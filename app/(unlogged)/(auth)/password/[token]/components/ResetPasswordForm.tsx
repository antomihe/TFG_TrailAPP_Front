// app\(unlogged)\(auth)\password\[token]\components\ResetPasswordForm.tsx
// app/(unlogged)/(auth)/password/[token]/components/ResetPasswordForm.tsx
'use client';

import React from 'react';
import { FormikButton, FormikField } from '@/components/ui/';
import { Formik, Form} from 'formik';
import { ShieldAlert } from 'lucide-react';
import { useResetPassword, FIELD_NAMES } from '@/hooks/api/unlogged/auth/useResetPassword';

interface ResetPasswordFormProps {
    token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const {
        initialFormValues,
        validationSchema,
        isTokenValid,
        handleResetPassword,
    } = useResetPassword({ token });

    if (isTokenValid === false) {
        return (
            <div className="text-center space-y-4 py-4">
                <ShieldAlert className="mx-auto h-16 w-16 text-destructive" />
                <h3 className="text-xl font-semibold">Enlace No Válido</h3>
                <p className="text-muted-foreground">
                    El enlace para restablecer la contraseña no es válido o ha expirado.
                    Por favor, solicita un nuevo enlace.
                </p>
            </div>
        );
    }

    return (
        <Formik
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            onSubmit={handleResetPassword}
        >
            <Form className="space-y-6">
                <FormikField
                    name={FIELD_NAMES.password}
                    label="Nueva Contraseña"
                    type="password"
                    placeholder="Escribe tu nueva contraseña"
                    autoComplete="new-password"
                />

                <FormikField
                    name={FIELD_NAMES.confirmPassword}
                    label="Confirmar Nueva Contraseña"
                    type="password"
                    placeholder="Confirma tu nueva contraseña"
                    autoComplete="new-password"
                />

                <FormikButton className='w-full' disabled={!token || !isTokenValid}>
                    Cambiar Contraseña
                </FormikButton>
            </Form>
        </Formik>
    );
}