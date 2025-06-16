'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Label, Skeleton } from '@/components/ui/';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '@/config/api';
import { useUserState } from '@/store/user/user.store';
import { toast } from 'sonner';

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
    const [sending, setSending] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const { user: userState } = useUserState();
    const [user, setUser] = React.useState<any | null>(null);
    const [license, setLicense] = React.useState<string>('Cargando...');
    const [federationName, setFederationName] = React.useState<string>('Cargando...');

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const res = await api(userState.access_token).get(`users/official/id/${userState.id}`);
                const userData = res.data;
                setLicense(userData.license);
                const resFed = await api(userState.access_token).get(`users/federation/${userData.federationCode}`)
                setFederationName(resFed.data.displayName);
                setUser(userData);
            } catch (error) {
                setError('Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return <SkeletonLoader />;
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto p-4">
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <Formik
                initialValues={{
                    email: user?.email as string || '',
                    fullName: user?.displayName as string || '',
                }}
                validationSchema={schema}
                onSubmit={async (values) => {
                    setSending(true);
                    try {
                        const res = await api(userState.access_token).patch(`/users/official/${userState.id}`, values);
                        toast.success('¡Éxito! Tus datos han sido actualizados');
                    } catch (error) {
                        const errorMessage = (error as any)?.response?.data?.message;
                        toast.error(errorMessage || 'Error al actualizar los datos');
                    } finally {
                        setSending(false);
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
                                    placeholder="Cargando..."
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
                                    placeholder="Cargando..."
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
                                        placeholder="Cargando..."
                                        value={license}
                                        disabled
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="federationName">Federación autonómica</Label>
                                    <Input
                                        id="federationName"
                                        placeholder="Cargando..."
                                        value={federationName}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-6" disabled={sending}>
                            {sending ? 'Cargando...' : 'Editar perfil'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
