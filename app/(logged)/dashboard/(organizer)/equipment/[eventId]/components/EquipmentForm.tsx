'use client';

import React, { useEffect } from 'react';
import { Button, Skeleton } from '@/components/ui/';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '@/config/api';
import { useUserState } from '@/store/user/user.store';
import EquipmentInput from './equipment-input';
import { useParams } from 'next/navigation';

const schema = Yup.object().shape({
    equipment: Yup.array().of(Yup.object().shape({
        name: Yup.string().required('El nombre es obligatorio'),
        optional: Yup.boolean(),
    })),
});

interface EquipmentItem {
    name: string;
    optional: boolean;
}

export default function EquipmentForm() {
    const [equipment, setEquipment] = React.useState<EquipmentItem[]>([]);
    const [sending, setSending] = React.useState(false);
    const [error, setError] = React.useState<string>('');
    const [loading, setLoading] = React.useState(true);
    const [errorLoading, setErrorLoading] = React.useState<string>('');
    const [submited, setSubmited] = React.useState<string>('');
    const { eventId } = useParams();

    const { user: userState } = useUserState();

    useEffect(() => {
        const fetchEquipment = async () => {
            setLoading(true);
            try {
                const loadEquipment = await api(userState.access_token).get(`events/equipment/${eventId}`);
                setEquipment(loadEquipment.data);
            } catch (error) {
                const errorMessage = (error as any)?.response?.data?.message;
                setErrorLoading(errorMessage || 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };
        fetchEquipment();
    }, []);



    const SkeletonLoader = () => (
        <div className="max-w-xl mx-auto p-4">
            <Skeleton height="h-8" width="w-full" className="my-4" />
        </div>
    );

    if (loading) {
        return <SkeletonLoader />
    }

    if (errorLoading) {
        return <p className="text-red-500 text-sm mt-4 text-center">{errorLoading}</p>
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formik
                enableReinitialize
                initialValues={{
                    equipment: equipment || [],
                }}
                validationSchema={schema}
                onSubmit={async (values) => {
                    setError('');
                    setSubmited('');
                    try {
                        setSending(true);
                        const req = {
                            equipment: values.equipment.map((item) => ({
                                name: item.name,
                                optional: item.optional,
                            })),
                        }
                        await api(userState.access_token).post(`/events/equipment/${eventId}`, req);
                        setSubmited('¡Éxito! Material añadido');
                    } catch (error) {
                        const errorMessage = (error as any)?.response?.data?.message;
                        setError(errorMessage || 'Error desconocido');
                    } finally {
                        setSending(false);
                    }
                }}
            >
                {({ values, touched, errors, setFieldTouched, setFieldValue }) => (
                    <Form>
                        <div className="space-y-2">
                            <div className="space-y-1">
                                <EquipmentInput
                                    setFieldValue={setFieldValue}
                                    setFieldTouched={setFieldTouched}
                                    setSubmitted={setSubmited}
                                    values={values.equipment}
                                />
                                {touched.equipment && errors.equipment && (
                                    <p className="text-red-500 text-sm">{Array.isArray(errors.equipment) ? errors.equipment.join(', ') : errors.equipment}</p>
                                )}
                            </div>

                        </div>

                        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                        <Button type="submit" className="w-full mt-6" disabled={sending}>
                            {sending ? 'Cargando...' : 'Guardar'}
                        </Button>
                        {submited && <p className="text-green-600 text-sm mt-2">{submited}</p>}
                    </Form>
                )}
            </Formik>
        </div>
    );
}
