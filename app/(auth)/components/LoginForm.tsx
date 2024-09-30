'use client';

import React from 'react';
import { Button, Input, Label, Separator } from '@/components/ui/';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import backendConector from '@/config/backendConector';
import { access } from 'fs';

const schema = Yup.object().shape({
    email: Yup.string().email('Email no válido').required('Email es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria').min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export default function LoginForm() {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string>('');

    return (
        <>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={schema}                
                onSubmit={async (values) => {
                    setError('');
                    setLoading(true);
                    try {
                        const res = await backendConector.post('/auth/login', values);
                        localStorage.setItem('access_token', res.data.access_token);
                        window.location.href = '/dashboard';
                    } catch (error) {
                        if (error instanceof Error && 'status' in error && (error as any).status === 404) {
                            setError('Usuario no encontrado');
                        } else {
                            setError('Error de conexión');
                        }
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
            <Separator className="mt-6" />
            <p className="text-center text-sm text-gray-600 mt-4 mb-2">
                {"¿No tienes una cuenta? "}
                <Link href="/register" className="text-blue-500 hover:underline">
                    regístrate
                </Link>
            </p>
        </>
    );
}
