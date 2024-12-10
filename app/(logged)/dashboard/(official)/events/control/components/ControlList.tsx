'use client';

import React, { useEffect, useState } from 'react';
import api from '@/config/api';
import { useUserState } from '@/store/user/user.store';
import { ControlItem, ControlType } from '../../../new/control/[eventId]/components/ControlForm';
import { Button, Card, CardTitle, Skeleton } from '@/components/ui';
import { CardContent, CardHeader } from '@/components/ui/card';
import { NotebookPen } from 'lucide-react';
import { MaterialDetails } from '../../../new/control/[eventId]/components/Control-input';
import { AlertComponent } from '@/components/ui/alert-component';
import Link from 'next/link';

interface Event {
    id: string;
}


export default function ControlList() {
    const [event, setEvent] = useState<Event>();
    const [loading, setLoading] = useState<boolean>(true);
    const [errorLoading, setErrorLoading] = useState<string | null>(null);
    const [materialLoading, setMaterialLoading] = useState<boolean>(true);
    const [controls, setControls] = useState<ControlItem[]>([]);
    const [materialDetails, setMaterialDetails] = useState<MaterialDetails>({});


    const { user } = useUserState();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const loadEvent = await api(user.access_token).get(`events/jury/today`);
                const loadControls = await api(user.access_token).get(`events/control/event/${loadEvent.data.id}`);

                setEvent(await loadEvent.data);
                setControls(await loadControls.data);
            } catch (error) {
                const errorMessage = (error as any)?.response?.data?.message;
                setErrorLoading(errorMessage || 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchMaterialDetails = async () => {
            const details: MaterialDetails = {};
            try {
                setMaterialLoading(true);
                for (const control of controls) {
                    for (const item of control.material) {
                        const response = await api(user.access_token).get(`events/equipment/${item}`);
                        details[item] = response.data.name;
                    }
                }
            } catch (error) {
                const errorMessage = (error as any)?.response?.data?.message;
                setErrorLoading(errorMessage || 'Error desconocido');
            } finally {
                setMaterialLoading(false);
            }

            setMaterialDetails(details);
        };

        fetchMaterialDetails();
    }, [controls]);

    const SkeletonLoader = () => (
        <div className="max-w-xl mx-auto p-4">
            <Skeleton height="h-8" width="w-full" className="my-4" />
        </div>
    );

    if (errorLoading) {
        return <div className="text-red-500">{errorLoading}</div>;
    }

    if (loading) {
        return <SkeletonLoader />;
    }

    if (!controls.length) {
        return <AlertComponent message="No hay puntos de control asignados para el evento de hoy" />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {controls.map((control: any, index: number) => (
                <Card
                    key={index}
                    className="relative border shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                    <Link href={`/dashboard/events/control/${control.id}`}>
                        <CardHeader className=" border-b bg-primary-foreground rounded-lg">
                            <CardTitle className="text-lg font-medium ">
                                {control.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3 ">
                            <p>
                                <span className="font-semibold ">Tipo de punto de control: </span>
                                {control.type}
                            </p>
                            <p>
                                <span className="font-semibold">Distancias: </span>
                                {control.distances.join(', ')} km
                            </p>
                            {(control.type === ControlType.CONTROL || control.type === ControlType.LIFEBAG) && (
                                <p>
                                    <span className="font-semibold">Punto kilométrico: </span>
                                    {control.kmPosition} km
                                </p>
                            )}
                            {materialLoading ? (
                                <div className="flex items-center">
                                    <span className="font-semibold ">Material: </span>
                                    <Skeleton className="ml-2 h-5 w-full" />
                                </div>
                            ) : (
                                <p>
                                    <span className="font-semibold ">Material: </span>
                                    {control.material.map((id: string) => materialDetails[id]).join(', ')}
                                </p>
                            )}
                        </CardContent>
                        <Button
                            onClick={() => { }}
                            variant="default"
                            className="p-2 absolute top-2 right-2 w-10 bg-primary rounded-full"
                        >
                            <NotebookPen size={16} />
                        </Button>
                    </Link>
                </Card>
            ))}
        </div>
    )
}
