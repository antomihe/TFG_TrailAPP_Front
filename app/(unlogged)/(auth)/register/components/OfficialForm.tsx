'use client';

import React, { use, useEffect } from 'react';
import { Label, Input } from '@/components/ui'
import { Button } from '@/components/ui';
import api from '@/config/api';

import { Formik, Form } from 'formik';

import * as Yup from 'yup';
import { set } from 'date-fns';

const schema = Yup.object().shape({
    email: Yup.string().email('El email no es válido').required('El email es obligatorio'),
    fullName: Yup.string().required('El nombre completo es obligatorio'),
    license: Yup.string()
        .required('El número de identificación es obligatorio')
        .max(4, 'El número de identificación no puede tener más de 4 caracteres')
        .matches(/^[A-Za-z]{1}[0-9]{0,3}$|^[A-Za-z]{2}[0-9]{0,2}$/, 'El número de identificación no es válido'),
    federationCode: Yup.string().required('El código de federación es obligatorio').matches(/^[A-Za-z]{3}$/, 'El código de federación no es válido'),
});

export default function OfficialForm() {

    const [loading, setLoading] = React.useState(false);
    const [federations, setFederations] = React.useState<{ code: string, displayName: string }[]>([]);
    const [federationsError, setFederationsError] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string>('');
    const [submited, setSubmited] = React.useState<string>('');

    useEffect(() => {
        const fetchFederations = async () => {
            setLoading(true);
            try {
                const loadFederations = await api().get('users/federation');
                setFederations(loadFederations.data);
            } catch (error) {
                setFederationsError('Error al cargar las federaciones');
            } finally {
                setLoading(false);
            }
        };
        fetchFederations();
    }, []);

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    fullName: '',
                    license: '',
                    federationCode: ''
                }}
                validationSchema={schema}
                onSubmit={async (values) => {
                    setError('');
                    setSubmited('');
                    setLoading(true);
                    try {
                        setLoading(true);
                        const res = await api().post('/users/official', values);
                        setLoading(false);
                        setSubmited('¡Exito! Compruebe su correo electrónico para confirmar su cuenta');
                    } catch (error) {
                        const errorMessage = (error as any)?.response?.data?.message;
                        if (errorMessage) setError(errorMessage);
                        else setError('Error desconocido');
                    } finally {
                        setLoading(false);
                    }
                }}
            >
                {
                    (formik) => (
                        <Form>
                            <div className='space-y-2'>
                                <div className="space-y-1">
                                    <Label htmlFor="fullName">Nombre completo</Label>
                                    <Input
                                        id="fullName"
                                        placeholder="Ana Jiménez"
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
                                        placeholder="ana@gmail.com"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <p className="text-red-500 text-sm">{formik.errors.email}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="license">Nº de licencia</Label>
                                    <Input
                                        id="license"
                                        placeholder="AV8"
                                        value={formik.values.license}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.license && formik.errors.license && (
                                        <p className="text-red-500 text-sm">{formik.errors.license}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="license">Federación autonómica</Label>
                                    <select
                                        id="federationCode"
                                        name="federationCode"
                                        value={formik.values.federationCode}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="input mt-3 border border-gray-200 rounded w-full py-2 pl-1 text-gray-500"
                                    >
                                        <option value="" label="Selecciona una federación" disabled />
                                        {federations.map((federation) => (
                                            <option key={federation.code} value={federation.code} label={federation.displayName} />
                                        ))}
                                    </select>
                                    {formik.touched.federationCode && formik.errors.federationCode && (
                                        <p className="text-red-500 text-sm">{formik.errors.federationCode}</p>
                                    )}
                                    {federationsError && (
                                        <p className="text-red-500 text-sm">{federationsError}</p>
                                    )}
                                </div>
                            </div>
                            {error && (
                                <p className="text-red-500 text-sm mt-4">{error}</p>
                            )}
                            <Button type="submit" className="w-full mt-6" disabled={loading}>
                                {loading ? 'Cargando...' : 'Registrarse'}
                            </Button>
                            {submited && (
                                <p className="text-green-600 text-sm mt-2">{submited}</p>
                            )}
                        </Form>
                    )}
            </Formik>



        </>
    )
}
