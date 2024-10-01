'use client';

import React, { use, useEffect } from 'react';
import { Label, Input } from '@/components/ui'
import { Button } from '@/components/ui';
import api from '@/config/api';

import { Formik, Form } from 'formik';

import * as Yup from 'yup';

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
    const [federations, setFederations] = React.useState([]);

    useEffect(() => {
        const fetchFederations = async () => {
            setLoading(true);
            const loadFederations = await api.get('users/federation');
            console.log(loadFederations.data); 
            setFederations(loadFederations.data);
            setLoading(false);
        };
        fetchFederations();
    }, []);

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    fullName: '',
                    idNumber: '',
                    dateOfBirth: ''
                }}
                validationSchema={schema}
                onSubmit={(values) => {
                    console.log(values);
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
                                        value={formik.values.idNumber}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.idNumber && formik.errors.idNumber && (
                                        <p className="text-red-500 text-sm">{formik.errors.idNumber}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="license">Federación autonómica</Label>
                                    <select
                                        id="federation"
                                        value={formik.values.federationCode}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="input mt-3 border border-gray-200 rounded w-full py-2 pl-1 text-gray-500 "
                                    >
                                        <option value="" label="Selecciona una federación" />
                                        {federations.map((federation) => (
                                            <option key={federation.code} value={federation.code} label={federation.displayName} />
                                        ))}
                                    </select>
                                    {formik.touched.federationCode && formik.errors.federationCode && (
                                        <p className="text-red-500 text-sm">{formik.errors.federationCode}</p>
                                    )}
                                </div>
                            </div>
                        </Form>
                    )}
            </Formik>
            <Button type="submit" className="w-full mt-6" disabled={loading}>
                {loading ? 'Cargando...' : 'Registrarse'}
            </Button>

        </>
    )
}
