'use client';

import React from 'react';
import { Button, Input, Label, Separator } from '@/components/ui/';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '@/config/api';
import { set } from 'date-fns';

const schema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('Email requerido'),
});

export default function EmailForm() {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string>('');
    const [success, setSuccess] = React.useState<string>('');

    return (
        <>
            <Formik
                initialValues={{ email: '' }}
                validationSchema={schema}
                onSubmit={async (values) => {
                    setError('');
                    setSuccess('');
                    setLoading(true);
                    try {
                        const res = await api().post(`/auth/recover`, values);
                        setSuccess('Se ha enviado un email con las instrucciones para restaurar la contraseña');
                    } catch (error) {
                        setSuccess('');
                        const errorMessage = (error as any)?.response?.data?.message;
                        if (errorMessage) setError(errorMessage);
                        else setError('Error desconocido');
                    } finally {
                        setLoading(false);
                    }
                }}
            >
                {(formik) => (
                    <Form>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type='email'
                                    placeholder='juan@example.com'
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    required
                                    autoComplete='email'
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-red-500 text-sm">{formik.errors.email}</p>
                                )}
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm">{error}</p>
                            )}
                            <Button type="submit" className="w-full mt-2" disabled={loading}>
                                {loading ? 'Cargando...' : 'Restaurar constraseña'}
                            </Button>
                            {success && (
                                <p className="text-green-600 text-sm">{success}</p>
                            )}
                        </div>
                    </Form>
                )}

            </Formik>

        </>
    );
}
