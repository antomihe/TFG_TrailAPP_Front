// app\(unlogged)\(auth)\verify\[token]\components\AccountVerificationForm.tsx
'use client';

import React from 'react';
import { Button, Input, Label } from '@/components/ui/';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAccountVerification } from '@/hooks/api/unlogged/auth/useAccountVerification';


interface VerifyFormProps {
    token: string;
}

export default function VerifyForm({ token }: VerifyFormProps) {
    const {
        initialFormValues,
        validationSchema,
        isSubmitting,
        handleVerifyAccount,
    } = useAccountVerification({ token });

    return (

        <Formik
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            onSubmit={async (values, formikActions) => {
                await handleVerifyAccount(values, formikActions);
            }}
        >
            {() => (
                <Form>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Nueva Contraseña</Label>
                            <Field
                                as={Input}
                                id="password"
                                name="password"
                                type="password"
                                placeholder="********"
                                required
                                autoComplete="new-password"
                                disabled={isSubmitting}
                            />
                            <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting || !token}>
                            {isSubmitting ? 'Estableciendo...' : 'Establecer Contraseña y Activar Cuenta'}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}