'use client';

import React, { useEffect, useState } from 'react';
import { Button, Skeleton } from '@/components/ui/';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '@/config/api';
import { useUserState } from '@/store/user/user.store';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import EquipmentInput from './EquipmentInput';
import EquipmentList from './EquipmentList';

const schema = Yup.object().shape({
    equipment: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required('El nombre es obligatorio'),
            optional: Yup.boolean(),
            removed: Yup.boolean(),
        })
    ),
});

interface EquipmentItem {
    name: string;
    optional: boolean;
    removed?: boolean;
}

export default function EquipmentForm() {
    const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState<string>('');
    const { eventId } = useParams();
    const { user: userState } = useUserState();

    useEffect(() => {
        const fetchEquipment = async () => {
            setLoading(true);
            try {
                const loadEquipment = await api(userState.access_token).get(`events/equipment/event/${eventId}`);
                setEquipment(loadEquipment.data.map((item: EquipmentItem) => ({ ...item, removed: false })));
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
        return <SkeletonLoader />;
    }

    if (errorLoading) {
        return <p className="text-red-500 text-sm mt-4 text-center">{errorLoading}</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Formik
                enableReinitialize
                initialValues={{ equipment }}
                validationSchema={schema}
                onSubmit={async (values, { setFieldValue }) => {
                    try {
                        setSending(true);
                        const req = {
                            equipment: values.equipment
                                .filter(item => !item.removed)
                                .map(({ name, optional }) => ({ name, optional })),
                        };
                        await api(userState.access_token).post(`/events/equipment/${eventId}`, req);
                        toast.success('¡Éxito! Material guardado');
                        setFieldValue('equipment', values.equipment.filter(item => !item.removed));

                    } catch (error) {
                        const errorMessage = (error as any)?.response?.data?.message;
                        toast.error(errorMessage || 'Error: material no guardado');
                    } finally {
                        setSending(false);
                    }
                }}
            >
                {({ values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <div className="space-y-5">
                            <EquipmentInput
                                setFieldValue={setFieldValue}
                                setFieldTouched={setFieldTouched}
                                values={values.equipment}
                            />
                            <EquipmentList
                                values={values.equipment}
                                setFieldValue={setFieldValue}
                            />
                        </div>

                        <Button type="submit" className="w-full mt-6" disabled={sending}>
                            {sending ? 'Cargando...' : 'Guardar'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
