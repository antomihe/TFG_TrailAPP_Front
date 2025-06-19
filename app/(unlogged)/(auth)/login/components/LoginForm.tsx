// app\(unlogged)\(auth)\login\components\LoginForm.tsx
'use client';

import React from 'react';
import { FormikField, FormikButton } from '@/components/ui/';
import { Formik, Form } from 'formik';
import { useLoginForm, FIELD_NAMES } from '@/hooks/api/unlogged/auth/useLoginForm';

export default function LoginForm() {
    const {
        initialFormValues,
        validationSchema,
        handleLogin,
    } = useLoginForm();

    return (
        <Formik
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
        >
            <Form className="space-y-6">
                <FormikField
                    name={FIELD_NAMES.email}
                    label="Email"
                    type="email"
                    placeholder="tu@email.com"
                    autoComplete="email"
                />

                <FormikField
                    name={FIELD_NAMES.password}
                    label="Contraseña"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                />

                <FormikButton>
                    Iniciar sesión
                </FormikButton>

            </Form>
        </Formik>
    );
}