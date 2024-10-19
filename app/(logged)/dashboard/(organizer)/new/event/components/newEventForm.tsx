'use client';

import React from 'react';
import { Button, Input, Label } from '@/components/ui/';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '@/config/api';
import { useUserState } from '@/store/user/user.store';
import { ProvincesComponent } from '@/components/ui/provinceInput';
import { LocationComponent } from '@/components/ui/locationInput';
import { DateInput } from '@/components/ui/dateInput';

const schema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    location: Yup.string().required('La localidad es obligatoria'),
    province: Yup.string().required('La provincia es obligatoria'),
    date: Yup.date()
        .required('La fecha es obligatoria')
        .test(
            'isPastDate',
            'La fecha no puede ser en el pasado',
            (value) => {
                const date = new Date(value);

                const now = new Date();
                now.setHours(0, 0, 0, 0);

                return now <= date;
            }
        )
});

export default function NewEventForm() {
    const [sending, setSending] = React.useState(false);
    const [error, setError] = React.useState<string>('');
    const [submited, setSubmited] = React.useState<string>('');
    const [province] = React.useState<string>('');
    const [location] = React.useState<string>('');

    const { user: userState } = useUserState();

    return (
        <div className="max-w-xl mx-auto p-4">
            <Formik
                enableReinitialize
                initialValues={{
                    name: '',
                    date: null,
                    province: province || '',
                    location: location || '',
                }}
                validationSchema={schema}
                onSubmit={async (values) => {
                    setError('');
                    setSubmited('');
                    try {
                        setSending(true);
                        await api(userState.access_token).post(`/events`, values);
                        setSubmited('¡Éxito! Evento creado');
                    } catch (error) {
                        const errorMessage = (error as any)?.response?.data?.message;
                        setError(errorMessage || 'Error desconocido');
                    } finally {
                        setSending(false);
                    }
                }}
            >
                {({ values, handleChange, handleBlur, touched, errors, setFieldValue }) => (
                    <Form>
                        <div className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    placeholder="Ultra Trail Gredos"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.name && errors.name && (
                                    <p className="text-red-500 text-sm">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="date">Fecha</Label>
                                <DateInput
                                    date={values.date}
                                    setFieldValue={setFieldValue}
                                />
                                {errors.date && (
                                    <p className="text-red-500 text-sm">{errors.date}</p>
                                )}
                            </div>



                            <div className="space-y-1">
                                <Label htmlFor="province">Provincia</Label>
                                <ProvincesComponent
                                    setError={setError}
                                    province={values.province}
                                    location={values.location}
                                    setFieldValue={setFieldValue}
                                />

                                {touched.province && errors.province && (
                                    <p className="text-red-500 text-sm">{errors.province}</p>
                                )}
                            </div>

                            <React.Fragment key={values.province}>
                                {values.province && (
                                    <div className="space-y-1">
                                        <Label htmlFor="location">Localidad</Label>
                                        <LocationComponent
                                            setError={setError}
                                            province={values.province}
                                            location={values.location}
                                            setFieldValue={setFieldValue}
                                        />
                                        {touched.location && errors.location && (
                                            <p className="text-red-500 text-sm">{errors.location}</p>
                                        )}
                                    </div>
                                )}
                            </React.Fragment>
                        </div>

                        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                        <Button type="submit" className="w-full mt-6" disabled={sending}>
                            {sending ? 'Cargando...' : 'Crear evento'}
                        </Button>
                        {submited && <p className="text-green-600 text-sm mt-2">{submited}</p>}
                    </Form>
                )}
            </Formik>
        </div>
    );
}
