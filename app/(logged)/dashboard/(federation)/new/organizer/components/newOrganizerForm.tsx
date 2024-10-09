'use client';

import React from 'react';
import { Button, Input, Label, Skeleton } from '@/components/ui/';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '@/config/api';
import { useUserState } from '@/store/user/user.store';
import { set } from 'date-fns';

const schema = Yup.object().shape({
    email: Yup.string().email('El email no es válido').required('El email es obligatorio'),
    name: Yup.string().required('El nombre es obligatorio'),
    federationCode: Yup.string()
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

export default function NewOrganizerForm() {
    const [loading, setLoading] = React.useState(false);
    const [sending, setSending] = React.useState(false);
    const [error, setError] = React.useState<string>('');
    const [submited, setSubmited] = React.useState<string>('');
    const [fedCode, setFedCode] = React.useState<string>('');
    const { user: userState } = useUserState();

    React.useEffect(() => {
        const fetchFederations = async () => {
            try {
                const res = await api(userState.access_token).get(`users/federation/id/${userState.id}`);
                setFedCode(res.data.code || '');
            } catch (error) {
                console.error('Error fetching federation code:', error);
            }
        };

        if (!fedCode) fetchFederations();
    }, []);

    if (loading) return <SkeletonLoader />;

    return (
        <div className="max-w-xl mx-auto p-4">
            <Formik
                enableReinitialize
                initialValues={{
                    email: '',
                    name: '',
                    federationCode: fedCode,
                }}
                validationSchema={schema}
                onSubmit={async (values) => {
                    setError('');
                    setSubmited('');
                    try {
                        setSending(true);
                        await api(userState.access_token).post(`/users/organizer`, values);
                        setSubmited('¡Éxito! Tus datos han sido actualizados');
                    } catch (error) {
                        const errorMessage = (error as any)?.response?.data?.message;
                        setError(errorMessage || 'Error desconocido');
                    } finally {
                        setSending(false);
                    }
                }}
            >
                {({ values, handleChange, handleBlur, touched, errors }) => (
                    <Form>
                        <div className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    placeholder="trail@runners.com"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.email && errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    placeholder="Club de atletismo Trail Runners"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.name && errors.name && (
                                    <p className="text-red-500 text-sm">{errors.name}</p>
                                )}
                            </div>
                            <div className='hidden'>
                                <Label htmlFor="federationCode">Código de federación</Label>
                                <Input
                                    id="federationCode"
                                    value={values.federationCode}
                                    disabled
                                />
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
