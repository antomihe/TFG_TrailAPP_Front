'use client';

import React, { useState } from 'react';
import { Button, Input, Label } from '@/components/ui/';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '@/config/api';
import { useUserState } from '@/store/user/user.store';
import { useRouter, useSearchParams } from 'next/navigation';

const schema = Yup.object().shape({
    email: Yup.string().email('Email no válido').required('Email es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria').min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export default function LoginForm() {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string>('');
    const router = useRouter();
    const params = useSearchParams()

    return (
        <>
            <Formik
                initialValues={{ email: 'federation@example.com', password: 'password1234' }}
                validationSchema={schema}
                onSubmit={async (values) => {
                    setError('');
                    setLoading(true);
                    try {
                        const res = await api().post('/auth/login', values);
                        useUserState.getState().login(res.data);
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
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@gmail.com"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    required
                                    autoComplete="email"
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-red-500 text-sm">{formik.errors.email}</p>
                                )}
                            </div>
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
                                {loading ? 'Cargando...' : 'Iniciar sesión'}
                            </Button>
                        </div>
                    </Form>
                )}

            </Formik>
        </>
    );
}
