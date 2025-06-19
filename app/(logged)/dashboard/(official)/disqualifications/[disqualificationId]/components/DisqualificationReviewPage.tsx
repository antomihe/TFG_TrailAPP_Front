// app\(logged)\dashboard\(official)\disqualifications\[disqualificationId]\components\DisqualificationReviewPage.tsx
'use client';

import React from 'react';
import { Skeleton, Button as UiButton } from '@/components/ui';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Head } from "@/components/layout";
import { useDisqualificationDetails } from '@/hooks/api/dashboard/official/useDisqualificationDetails';
import { DisqualificationDetailsCard } from '../components/DisqualificationDetailsCard';

const PageSkeletonLoader = () => (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-1/2" /> {/* Título de la página */}
        <Skeleton className="h-72 w-full" /> {/* Card de detalles */}
        <div className="flex justify-between space-x-4">
            <Skeleton className="h-10 w-full" /> {/* Botón 1 */}
            <Skeleton className="h-10 w-full" /> {/* Botón 2 */}
        </div>
    </div>
);

export default function DisqualificationReviewPage() {
    const {
        disqualification,
        isLoading,
        isSubmittingAction,
        error,
        approveDisqualification,
        rejectDisqualification,
        refetchDisqualification,
    } = useDisqualificationDetails();

    if (isLoading) return <PageSkeletonLoader />

    if (error) {
        return (
            <>
                <Head title="Error" subtitle="Problema al cargar descalificación" />
                <div className="max-w-3xl mx-auto p-6">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error al Cargar</AlertTitle>
                        <AlertDescription>
                            {error} <br />
                            <UiButton onClick={refetchDisqualification} variant="link" className="p-0 h-auto text-destructive underline mt-2">
                                Reintentar
                            </UiButton>
                        </AlertDescription>
                    </Alert>
                </div>
            </>
        );
    }

    if (!disqualification || !disqualification.id) {
        return (
            <>
                <Head title="Descalificación no encontrada" subtitle="El parte solicitado no existe o no se pudo cargar." />
                <div className="max-w-3xl mx-auto p-6">
                    <Alert variant="default">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>No Encontrado</AlertTitle>
                        <AlertDescription>
                            El parte de descalificación no se pudo encontrar. Puede que haya sido eliminado o el ID sea incorrecto.
                        </AlertDescription>
                    </Alert>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="max-w-3xl mx-auto p-4 sm:p-6">
                <DisqualificationDetailsCard disqualification={disqualification} />
                {!disqualification.reviewedByReferee && (
                    <div className="w-full flex flex-col sm:flex-row justify-between mt-6 space-y-3 sm:space-y-0 sm:space-x-4">
                        <UiButton
                            className="w-full"
                            variant={'outline'}
                            onClick={rejectDisqualification}
                            disabled={isSubmittingAction}
                        >
                            {isSubmittingAction ? "Procesando..." : "Desestimar Parte"}
                        </UiButton>
                        <UiButton
                            className="w-full"
                            variant={'destructive'}
                            onClick={approveDisqualification}
                            disabled={isSubmittingAction}
                        >
                            {isSubmittingAction ? "Procesando..." : "Confirmar Descalificación del Atleta"}
                        </UiButton>
                    </div>
                )}

                {disqualification.reviewedByReferee && (
                    <div className="mt-6 text-center">
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                            Este parte ya ha sido revisado.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}