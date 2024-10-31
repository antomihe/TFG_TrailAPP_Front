'use client';

import React from 'react';
import { Button, Input, Label, Skeleton } from '@/components/ui/';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '@/config/api';
import { useUserState } from '@/store/user/user.store';
import { RegionsComponent } from './RegionsComponent';

const schema = Yup.object().shape({
    email: Yup.string().email('El email no es válido').required('El email es obligatorio'),
    region: Yup.string().required('La región es obligatoria'),
    code: Yup.string()
        .required('El código de federación es obligatorio')
        .matches(/^[A-Z]{3}$/, 'El código de federación debe tener 3 letras mayúsculas'),
});

const SkeletonLoader = () => (
    <div className="max-w-xl mx-auto p-4">
        <Skeleton height="h-8" width="w-full" className="my-4" />
        <Skeleton height="h-8" width="w-full" className="my-4" />
        <Skeleton height="h-8" width="w-full" className="my-4" />
        <Skeleton height="h-8" width="w-full" className="my-4" />
    </div>
);

export default function NewFederationForm() {
    const [loading, setLoading] = React.useState(false);
    const [sending, setSending] = React.useState(false);
    const [error, setError] = React.useState<string>('');
    const [submited, setSubmited] = React.useState<string>('');
    const [regionKey, setRegionKey] = React.useState<number>(0);
    const { user: userState } = useUserState();

    if (loading) {
        return <SkeletonLoader />;
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <Formik
                enableReinitialize
                initialValues={{
                    email: '',
                    region: '',
                    code: '',
                }}
                validationSchema={schema}
                onSubmit={async (values, { resetForm }) => {
                    setError('');
                    setSubmited('');
                    try {
                        setSending(true);
                        const res = await api(userState.access_token).post(`/users/federation`, values);
                        setSubmited('¡Éxito! Federación creada correctamente');
                        resetForm();
                        setRegionKey((prevKey) => prevKey + 1); 
                    } catch (error) {
                        const errorMessage = (error as any)?.response?.data?.message;
                        if (errorMessage) setError(errorMessage);
                        else setError('Error desconocido');
                    } finally {
                        setSending(false);
                    }
                }}
            >
                {(formik) => (
                    <Form>
                        <div className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    placeholder="eduardo@gmail.com"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-red-500 text-sm">{formik.errors.email}</p>
                                )}
                            </div>
                            <div className="flex space-x-3">
                                <div className="w-3/5 space-y-1">
                                    <Label htmlFor="region">Región</Label>
                                    <RegionsComponent
                                        key={regionKey} 
                                        region={formik.values.region}
                                        setError={setError}
                                        setFieldValue={formik.setFieldValue}
                                        setFieldTouched={formik.setFieldTouched}
                                    />
                                    {formik.touched.region && formik.errors.region && (
                                        <p className="text-red-500 text-sm">{formik.errors.region}</p>
                                    )}
                                </div>

                                <div className="w-2/5 space-y-1">
                                    <Label htmlFor="code">Código de federación</Label>
                                    <Input
                                        id="code"
                                        placeholder="MAD"
                                        value={formik.values.code}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.code && formik.errors.code && (
                                        <p className="text-red-500 text-sm">{formik.errors.code}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                        <Button type="submit" className="w-full mt-6" disabled={sending}>
                            {sending ? 'Cargando...' : 'Crear usuario'}
                        </Button>
                        {submited && <p className="text-green-600 text-sm mt-2">{submited}</p>}
                    </Form>
                )}
            </Formik>
        </div>
    );
}
