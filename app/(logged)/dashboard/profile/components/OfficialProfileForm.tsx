'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Label, Skeleton } from '@/components/ui/';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '@/config/api';
import { useUserState } from '@/store/user/user.store';

const schema = Yup.object().shape({
    email: Yup.string().email('El email no es válido').required('El email es obligatorio'),
    fullName: Yup.string().required('El nombre completo es obligatorio'),
    
});

const SkeletonLoader = () => (
    <div className="max-w-xl mx-auto p-4">
        <Skeleton height="h-8" width="w-full" className="my-4" />
        <Skeleton height="h-8" width="w-full" className="my-4" />
        <Skeleton height="h-8" width="w-full" className="my-4" />
        <Skeleton height="h-8" width="w-full" className="my-4" />
        <Skeleton height="h-8" width="w-full" className="my-4" />
    </div>
);

export default function OfficialProfileForm() {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string>('');
    const [submited, setSubmited] = React.useState<string>('');
    const { user: userState } = useUserState();
    const [user, setUser] = React.useState<any | null>(null);

    const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const res = await api(userState.access_token).get(`users/official/id/${userState.id}`);
                const userData = res.data;
                const resFed = await api(userState.access_token).get(`users/federation/${userData.federationCode}`)
                const { displayName: federationName} = resFed.data
                userData.federationCode = federationName
                setUser(userData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return <SkeletonLoader />;
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <Formik
                initialValues={{
                    email: user?.email as string || '',
                    fullName: user?.displayName as string || '',
                    federationCode: user?.federationCode as string || '',
                    license: user?.license as string || ''
                }}
                validationSchema={schema}
                onSubmit={async (values) => {
                    setError('');
                    setSubmited('');
                    setLoading(true);
                    try {
                        console.log('accesToken', userState.access_token);
                        const res = await api(userState.access_token).patch(`/users/official/${userState.id}`, values);
                        setLoading(false);
                        setSubmited('¡Éxito! Tus datos han sido actualizados');
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
                        <div className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="fullName">Nombre completo</Label>
                                <Input
                                    id="fullName"
                                    placeholder="Eduardo Pérez"
                                    value={formik.values.fullName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.fullName && formik.errors.fullName && (
                                    <p className="text-red-500 text-sm">{formik.errors.fullName}</p>
                                )}
                            </div>
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
                            <div className="flex space-x-4">
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="license">Licencia</Label>
                                    <Input
                                        id="license"
                                        placeholder="M209"
                                        value={formik.values.license}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled
                                    />
                                    {formik.touched.license && formik.errors.license && (
                                        <p className="text-red-500 text-sm">{formik.errors.license}</p>
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="federationCode">Federación autonómica</Label>
                                    <Input
                                        id="federationCode"
                                        placeholder="loading..."
                                        value={formik.values.federationCode}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled
                                    />
                                    {formik.touched.federationCode && formik.errors.federationCode && (
                                        <p className="text-red-500 text-sm">{formik.errors.federationCode}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                        <Button type="submit" className="w-full mt-6" disabled={loading}>
                            {loading ? 'Cargando...' : 'Editar perfil'}
                        </Button>
                        {submited && <p className="text-green-600 text-sm mt-2">{submited}</p>}
                    </Form>
                )}
            </Formik>
        </div>
    );
}
