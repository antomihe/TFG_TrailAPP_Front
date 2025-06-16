'use client';

import React from 'react';
import { Button, Input, Label, Separator } from '@/components/ui/';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '@/config/api';
import { toast } from 'sonner';

const schema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('Email requerido'),
});

export default function EmailForm() {
    const [loading, setLoading] = React.useState(false);

    return (
        <>
            <Formik
                initialValues={{ email: '' }}
                validationSchema={schema}
                onSubmit={async (values) => {
                    setLoading(true);
                    try {
                        const res = await api().post(`/auth/recover`, values);
                        toast.success('Se ha enviado un email con las instrucciones para restaurar la contraseña');
                    } catch (error) {
                        const errorMessage = (error as any)?.response?.data?.message;
                        toast.error(errorMessage || 'Error al enviar el email de recuperación')
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

                            <Button type="submit" className="w-full mt-2" disabled={loading}>
                                {loading ? 'Cargando...' : 'Restaurar constraseña'}
                            </Button>

                        </div>
                    </Form>
                )}

            </Formik>

        </>
    );
}
