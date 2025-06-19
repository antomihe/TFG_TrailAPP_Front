// app/(unlogged)/(auth)/password/components/RequestPasswordResetForm.tsx
'use client';

import React from 'react';
import { Button, FormikButton, FormikField } from '@/components/ui/';
import { Formik, Form } from 'formik';
import { CheckCircle } from 'lucide-react';
import { useRequestPasswordReset, FIELD_NAMES } from '@/hooks/api/unlogged/auth/usePasswordRecovery';

export default function RequestPasswordResetForm() {
    const {
        initialFormValues,
        validationSchema,
        requestSentSuccessfully,
        handlePasswordResetRequest,
        setRequestSentSuccessfully,
    } = useRequestPasswordReset();

    if (requestSentSuccessfully) {
        return (
            <div className="text-center space-y-4 py-4">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <h3 className="text-xl font-semibold">¡Solicitud Enviada!</h3>
                <p className="text-muted-foreground">
                    Si la dirección de correo electrónico que ingresaste está asociada con una cuenta,
                    te hemos enviado un email con instrucciones para restablecer tu contraseña.
                </p>
                <p className="text-sm text-muted-foreground">
                    Si no recibes el email en unos minutos, revisa tu carpeta de spam.
                </p>
                <Button variant="outline" onClick={() => setRequestSentSuccessfully(false)} className="w-full sm:w-auto">
                    Intentar con otro email
                </Button>
            </div>
        );
    }

    return (
        <Formik
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            onSubmit={handlePasswordResetRequest}
        >
            <Form className="space-y-6">
                <FormikField
                    name={FIELD_NAMES.email}
                    label="Email"
                    type="email"
                    placeholder="tu@email.com"
                    autoComplete="email"
                />

                <FormikButton className="w-full">
                    Enviar Email de Recuperación
                </FormikButton>

            </Form>
        </Formik>
    );
}