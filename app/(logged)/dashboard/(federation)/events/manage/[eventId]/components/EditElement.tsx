'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Label, Skeleton } from '@/components/ui/';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '@/config/api';
import { useUserState } from '@/store/user/user.store';
import { useParams } from 'next/navigation';
import { DateInput } from '@/components/ui/dateInput';

const schema = Yup.object().shape({
    name: Yup.string().required('El nombre  es obligatorio'),
    date: Yup.string().required('La fecha es obligatoria'),
    //en la edición sí se permite una fecha en el pasado
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

export default function EditElementForm() {
    const { user: userState } = useUserState();
    const params = useParams();
    const [loading, setLoading] = React.useState(false);
    const [sending, setSending] = React.useState(false);
    const [error, setError] = React.useState<string>('');
    const [submited, setSubmited] = React.useState<string>('');
    const [event, setEvent] = React.useState<any>(null);
    const [province, setProvince] = React.useState<string>('Cargando...');
    const [location, setLocation] = React.useState<string>('Cargando...');
    const [distances, setDistances] = React.useState<string>('Cargando...');

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            try {
                const { eventId } = params;
                const res = await api(userState.access_token).get(`events/${eventId}`);
                setProvince(res.data.province);
                setLocation(res.data.location);
                setDistances(res.data.distances.join('km, ')+ 'km');
                setEvent(res.data);
            } catch (error) {
                setError('Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, []);

    if (loading) {
        return <SkeletonLoader />;
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <Formik
                enableReinitialize
                initialValues={{
                    name: event?.name as string || '',
                    date: event?.date as string || '',
                }}
                validationSchema={schema}
                onSubmit={async (values) => {
                    setError('');
                    setSubmited('');
                    setSending(true);
                    try {
                        const { eventId } = params;
                        await api(userState.access_token).patch(`/events/${eventId}`, values);
                        setLoading(false);
                        setSubmited('¡Éxito! Los datos han sido actualizados');
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
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    placeholder="Cargando..."
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.errors.name && (
                                    <p className="text-red-500 text-sm">{formik.errors.name}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="date">Fecha</Label>
                                <DateInput
                                    date={formik.values.date}
                                    setFieldValue={formik.setFieldValue}
                                    setFieldTouched={formik.setFieldTouched}
                                />
                                {formik.errors.date && (
                                    <p className="text-red-500 text-sm">{formik.errors.date}</p>
                                )}
                            </div>

                            <div className="flex space-x-4">
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="province">Provincia</Label>
                                    <Input
                                        id='province'
                                        placeholder='Provincia'
                                        value={province}
                                        disabled={true}
                                    />
                                </div>

                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="location">Localidad</Label>
                                    <Input
                                        id="location"
                                        placeholder="Localidad"
                                        value={location}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div className='space-x-1'>
                                <Label htmlFor="distances">Distancias</Label>
                                <Input
                                    id="distances"
                                    placeholder="Distancias"
                                    value={distances}
                                    disabled={true}
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                        <Button type="submit" className="w-full mt-6" disabled={sending}>
                            {sending ? 'Cargando...' : 'Editar perfil'}
                        </Button>
                        {submited && <p className="text-green-600 text-sm mt-2">{submited}</p>}
                    </Form>
                )}
            </Formik>
        </div>
    );
}
