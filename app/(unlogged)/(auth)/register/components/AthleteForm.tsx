'use client';

import React from 'react';
import { Label, Input } from '@/components/ui'
import { Button } from '@/components/ui';

import { Formik, Form } from 'formik';

import api from '@/config/api';

import * as Yup from 'yup';

const schema = Yup.object().shape({
    email: Yup.string().email('El email no es válido').required('El email es obligatorio'),
    fullName: Yup.string().required('El nombre completo es obligatorio'),
    idNumber: Yup.string()
        .required('El documento de identificación es obligatorio')
        .matches(
            /^[XYZ]?\d{5,8}[A-Z]$/,
            'El documento de identificación debe ser un DNI o NIE válido'
        )
        .test(
            'idNumber',
            'DNI o NIE no válido',
            value => {
                if (!value) return false;
                const dniLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
                const number = parseInt((value?.slice(0, -1) ?? '').replace(/[XYZ]/, match => ({ X: '0', Y: '1', Z: '2' }[match])!), 10);
                const letter = value.slice(-1);
                return dniLetters[number % 23] === letter;
            }
        ),
    dateOfBirth: Yup.string()
        .required('La fecha de nacimiento es obligatoria')
        .matches(
            /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/,
            'La fecha de nacimiento no es válida (dd/mm/yyyy)'
        )
        .test(
            'dateOfBirth',
            'La fecha de nacimiento debe ser después del 01/01/1900',
            value => {
                const [day, month, year] = value.split('/').map(Number);
                const date = new Date(year, month - 1, day);
                return date >= new Date(1900, 0, 1);
            }
        )
        .test(
            'dateOfBirth',
            'La fecha de nacimiento no puede ser en el futuro',
            value => {
                const [day, month, year] = value.split('/').map(Number);
                const date = new Date(year, month - 1, day);
                return date <= new Date();
            }
        )
        .test(
            'dateOfBirth',
            'La fecha de nacimiento no es válida',
            value => {
                const [day, month, year] = value.split('/').map(Number);
                const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
                const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                return day <= daysInMonth[month - 1];
            }
        )
});

export default function AthleteForm() {

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string>('');
    const [submited, setSubmited] = React.useState<string>('');


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
                onSubmit={async (values) => {
                    setError('');
                    setSubmited('');
                    setLoading(true);
                    try {
                        setLoading(true);
                        const res = await api().post('/users/athlete', values);
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
                                <div className="space-y-1">
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
                                <div className="space-y-1">
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
