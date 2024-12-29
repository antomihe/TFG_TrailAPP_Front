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

export default function FederationProfileForm() {
    const [loading, setLoading] = React.useState(false);
    const [sending, setSending] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const { user: userState } = useUserState();
    const [user, setUser] = React.useState<any | null>(null);
    const [region, setRegion] = React.useState<string>('Cargando...');
    const [federationCode, setFederationCode] = React.useState<string>('Cargando...');


    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const res = await api(userState.access_token).get(`users/federation/id/${userState.id}`);
                console.log(res.data);
                const userData = res.data;
                setRegion(userData.region);
                setFederationCode(userData.code);
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
                enableReinitialize
                initialValues={{
                    email: user?.email as string || '',
                }}
                validationSchema={schema}
                onSubmit={async (values) => {
                    setSending(true);
                    try {
                        const res = await api(userState.access_token).patch(`/users/federation/${userState.id}`, values);
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
                                    <Label htmlFor="region">Región</Label>
                                    <Input
                                        id="region"
                                        value={region}
                                        disabled
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="federationCode">Código de federación</Label>
                                    <Input
                                        id="federationCode"
                                        value={federationCode}
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
