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
    idNumber: Yup.string()
        .required('El documento de identificación es obligatorio')
        .matches(/^[XYZ]?\d{5,8}[A-Z]$/, 'El documento de identificación debe ser un DNI o NIE válido')
        .test('idNumber', 'DNI o NIE no válido', value => {
            if (!value) return false;
            const dniLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
            const number = parseInt((value?.slice(0, -1) ?? '').replace(/[XYZ]/, match => ({ X: '0', Y: '1', Z: '2' }[match])!), 10);
            const letter = value.slice(-1);
            return dniLetters[number % 23] === letter;
        }),
    dateOfBirth: Yup.string()
        .required('La fecha de nacimiento es obligatoria')
        .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/, 'La fecha de nacimiento no es válida (dd/mm/yyyy)')
        .test('dateOfBirth', 'La fecha de nacimiento debe ser después del 01/01/1900', value => {
            const [day, month, year] = value.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            return date >= new Date(1900, 0, 1);
        })
        .test('dateOfBirth', 'La fecha de nacimiento no puede ser en el futuro', value => {
            const [day, month, year] = value.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            return date <= new Date();
        })
        .test('dateOfBirth', 'La fecha de nacimiento no es válida', value => {
            const [day, month, year] = value.split('/').map(Number);
            const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
            const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            return day <= daysInMonth[month - 1];
        })
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

export default function AthelteProfileForm() {
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
                const res = await api(userState.access_token).get(`users/athlete/id/${userState.id}`);
                const userData = res.data;
                userData.dateOfBirth = formatDate(userData.dateOfBirth);
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
                    idNumber: user?.idNumber as string || '',
                    dateOfBirth: user?.dateOfBirth as string || ''
                }}
                validationSchema={schema}
                onSubmit={async (values) => {
                    setError('');
                    setSubmited('');
                    setLoading(true);
                    try {
                        console.log('accesToken', userState.access_token);
                        const res = await api(userState.access_token).patch(`/users/athlete/${userState.id}`, values);
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
                            {/* Colocamos DNI y Fecha de nacimiento en la misma línea */}
                            <div className="flex space-x-4">
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="idNumber">DNI - NIE</Label>
                                    <Input
                                        id="idNumber"
                                        placeholder="79883941L"
                                        value={formik.values.idNumber}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.idNumber && formik.errors.idNumber && (
                                        <p className="text-red-500 text-sm">{formik.errors.idNumber}</p>
                                    )}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="dateOfBirth">Fecha de nacimiento</Label>
                                    <Input
                                        id="dateOfBirth"
                                        placeholder="01/02/1992"
                                        value={formik.values.dateOfBirth}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                                        <p className="text-red-500 text-sm">{formik.errors.dateOfBirth}</p>
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
