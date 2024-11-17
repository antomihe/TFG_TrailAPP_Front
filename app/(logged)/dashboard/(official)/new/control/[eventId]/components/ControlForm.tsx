'use client';

import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ControlInput from './Control-input';
import api from '@/config/api';
import { useUserState } from '@/store/user/user.store';
import { useParams } from 'next/navigation';
import { H2 } from '@/components/ui';

export type ControlItem = {
    id?: string;
    name: string;
    distances: number[];
    material: string[];
    type: string;
    kmPosition: number | undefined;
};

export type MaterialItem = {
    id: string;
    name: string;
    optional: boolean;
};

export enum ControlType {
    'START' = 'Salida',
    'CONTROL' = 'Punto de control',
    'LIFEBAG' = 'Bolsa de vida',
    'FINISH' = 'Meta'
}

export default function ControlForm() {
    const [distances, setDistances] = useState<number[]>([]);
    const [material, setMaterial] = useState<MaterialItem[]>([]);
    const [controls, setControls] = useState<ControlItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorLoading, setErrorLoading] = useState<string | null>(null);
    const [errorSending, setErrorSending] = useState<string | null>(null);
    const { user } = useUserState();
    const { eventId } = useParams<{ eventId: string }>();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const loadControls = await api(user.access_token).get(`events/control/event/${eventId}`);
                setControls(loadControls.data);

                const loadEvent = await api(user.access_token).get(`events/${eventId}`);
                setDistances(loadEvent.data.distances);

                const loadMaterial = await api(user.access_token).get(`events/equipment/event/${eventId}`);
                setMaterial(loadMaterial.data.map((item: any) => ({
                    name: item.name,
                    optional: item.optional,
                    id: item.id,
                })));
            } catch (error) {
                const errorMessage = (error as any)?.response?.data?.message;
                setErrorLoading(errorMessage || 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId]);

    const postControl = async (data: ControlItem): Promise<string> => {
        setErrorSending(null);
        try {
            const response = await api(user.access_token).post(`events/control/${eventId}`, data);
            console.log(response.data);
            return response.data.id;
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.message;
            setErrorSending(errorMessage || 'Error desconocido');
            return errorMessage || 'Error desconocido';
        }
    }

    const deleteControl = async (controlId: string) => {
        setErrorSending(null);
        try {
            await api(user.access_token).delete(`events/control/${controlId}`);
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.message;
            setErrorSending(errorMessage || 'Error desconocido');
        }
    }

    const SkeletonLoader = () => (
        <div className="max-w-xl mx-auto p-4">
            <Skeleton height="h-8" width="w-full" className="my-4" />
        </div>
    );

    if (errorLoading) {
        return <div className="text-red-500">{errorLoading}</div>;
    }

    return (
        <div className="space-y-8">
            {loading ? (
                <SkeletonLoader />
            ) : (
                <>
                    <H2>Controles</H2>
                    <ControlInput
                        values={controls}
                        setValues={setControls}
                        distances={distances}
                        material={material}
                        postControl={postControl}
                        deleteControl={deleteControl}
                        user={user}
                    />
                    {errorSending && <div className="text-red-500">{errorSending}</div>}
                </>
            )}
        </div>
    );
}
