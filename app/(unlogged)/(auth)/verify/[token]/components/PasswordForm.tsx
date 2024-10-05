'use client';

import React from 'react';
import { Button, Input, Label, Separator } from '@/components/ui/';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '@/config/api';

const schema = Yup.object().shape({
    password: Yup.string().required('La contraseña es obligatoria').min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export default function PasswordForm({ token }: { token: string }) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string>('');

    return (
        <>
            <Formik
                initialValues={{ password: '' }}
                validationSchema={schema}
                onSubmit={async (values) => {
                    setError('');
                    setLoading(true);
                    try {
                        const res = await api.patch(`/auth/recover/${token}`, values);
                        window.location.href = '/login';
                    } catch (error) {
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
                                <Label htmlFor="password">Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder='********'
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    required
                                    autoComplete='current-password'
                                />
                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-red-500 text-sm">{formik.errors.password}</p>
                                )}
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm">{error}</p>
                            )}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Cargando...' : 'Registrar constraseña'}
                            </Button>
                        </div>
                    </Form>
                )}

            </Formik>

        </>
    );
}
