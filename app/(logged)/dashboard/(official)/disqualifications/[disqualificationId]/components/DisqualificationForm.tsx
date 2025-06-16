'use client';

import React, { useEffect } from 'react';
import { Button, Skeleton } from '@/components/ui/';
import api from '@/config/api';
import { useUserState } from '@/store/user/user.store';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { timeFormatter } from '@/lib/utils';
import { toast } from 'sonner';


const SkeletonLoader = () => (
    <div className="max-w-xl mx-auto p-4">
        <Skeleton height="h-8" width="w-full" className="my-4" />
        <Skeleton height="h-8" width="w-full" className="my-4" />
        <Skeleton height="h-8" width="w-full" className="my-4" />
        <Skeleton height="h-8" width="w-full" className="my-4" />
    </div>
);

export default function DisqualificationForm() {
    const [loading, setLoading] = React.useState(true);
    const [errorLoading, setErrorLoading] = React.useState<string>('');
    const [disqualification, setDisqualification] = React.useState<Disqualification>({} as Disqualification);
    const { user: userState } = useUserState();
    const { disqualificationId } = useParams();

    useEffect(() => {
        const fetchFederations = async () => {
            setLoading(true);
            try {
                const loadDisqualificationReport = await api(userState.access_token).get(`events/disqualification/id/${disqualificationId}`);
                setDisqualification(loadDisqualificationReport.data);
            } catch (error) {
                const errorMessage = (error as any)?.response?.data?.message;
                setErrorLoading(errorMessage || 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };
        fetchFederations();
    }, [disqualificationId, userState.access_token]);

    const handleDesestimate = async () => {
        try {
            await api(userState.access_token).patch(`events/disqualification/desestimate/${disqualificationId}`);
            setDisqualification({ ...disqualification, reviewedByReferee: true });
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.message;
            setErrorLoading(errorMessage || 'Error desconocido');
        }
    };

    const handleDisqualify = async () => {
        try {
            await api(userState.access_token).patch(`events/disqualification/disqualify/${disqualificationId}`);
            setDisqualification({ ...disqualification, reviewedByReferee: true });
        } catch (error) {
            const errorMessage = (error as any)?.response?.data?.message;
            toast.error(errorMessage || 'Error desconocido');
        }
    };

    if (loading) {
        return <SkeletonLoader />;
    }

    if (errorLoading) {
        return <div className="text-center pt-5">{errorLoading}</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Card className="shadow-lg border border-gray-200">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-semibold">Parte de Descalificación</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600">Atleta</p>
                            <p className="text-lg font-medium">{disqualification.athlete.displayName}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600">Razón de la Descalificación</p>
                            <p className="text-lg font-medium">{disqualification.reason}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600">Descripción</p>
                            <p className="text-base">{disqualification.description}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Juez emisor</p>
                            <p className="text-base">{disqualification.official.displayName + " a las " + timeFormatter(disqualification.time)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {!disqualification.reviewedByReferee && (
                <div className="w-full flex justify-between mt-4 space-x-4">
                    <Button className="w-full" variant={'outline'} onClick={handleDesestimate} >Desestimar parte</Button>
                    <Button className="w-full" onClick={handleDisqualify} >Descalificar atleta</Button>
                </div>
            )}
        </div>
    );
}
