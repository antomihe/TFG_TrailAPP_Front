'use client';

import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/config/api';
import { useUserState } from '@/store/user/user.store';
import { useParams } from 'next/navigation';
import { H2 } from '@/components/ui';
import CheckPointInput from './CheckPoint-input';

export type CheckPointItem = {
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

export enum CheckPointType {
    'START' = 'Salida',
    'CONTROL' = 'Punto de control',
    'LIFEBAG' = 'Bolsa de vida',
    'FINISH' = 'Meta'
}

export function CheckPointForm() {
    const [distances, setDistances] = useState<number[]>([]);
    const [material, setMaterial] = useState<MaterialItem[]>([]);
    const [checkPoints, setcheckPoints] = useState<CheckPointItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorLoading, setErrorLoading] = useState<string | null>(null);
    const [errorSending, setErrorSending] = useState<string | null>(null);
    const { user } = useUserState();
    const { eventId } = useParams<{ eventId: string }>();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const loadcheckPoints = await api(user.access_token).get(`events/checkPoints/event/${eventId}`);
                setcheckPoints(loadcheckPoints.data);

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

    const nextCheckPoint = async (data: CheckPointItem): Promise<string> => {
        setErrorSending(null);
        try {
            const response = await api(user.access_token).post(`events/checkPoints/${eventId}`, data);
            return response.data.id;
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.message;
            setErrorSending(errorMessage || 'Error desconocido');
            return errorMessage || 'Error desconocido';
        }
    }

    const deletecheckPoint = async (checkPointId: string) => {
        setErrorSending(null);
        try {
            await api(user.access_token).delete(`events/checkPoints/${checkPointId}`);
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
        return <div className="text-red-500 text-center">{errorLoading}</div>;
    }

    return (
        <div className="space-y-8">
            {loading ? (
                <SkeletonLoader />
            ) : (
                <>
                    <H2>Puntos de control</H2>
                    <CheckPointInput
                        values={checkPoints}
                        setValues={setcheckPoints}
                        distances={distances}
                        material={material}
                        nextCheckPoint={nextCheckPoint}
                        deleteCheckPoint={deletecheckPoint}
                        errorSending={errorSending}
                        user={user}
                    />
                </>
            )}
        </div>
    );
}
