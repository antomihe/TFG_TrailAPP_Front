// app\(logged)\dashboard\(official)\new\disqualification\components\NewDisqualificationReportForm.tsx


'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { AlertTriangle, InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle, FormikTextArea, Skeleton } from "@/components/ui";
import { FormikField, FormikButton } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    useNewDisqualificationReport,
    DisqualificationFormValues,
} from '@/hooks/api/dashboard/official/useNewDisqualificationReport';
import { FormikAthleteSelector } from '@/components/ui/formikAthleteSelector';
import { AthleteListItemDto } from '@/types/api';

const SkeletonLoader = () => (
    <div className="max-w-xl mx-auto p-4 space-y-4">
        <Skeleton className="h-10 w-full" /> {/* Evento */}
        <Skeleton className="h-10 w-full" /> {/* Atleta */}
        <Skeleton className="h-10 w-full" /> {/* Razón */}
        <Skeleton className="h-40 w-full" /> {/* Descripción */}
        <Skeleton className="h-10 w-full mt-2" /> {/* Botón */}
    </div>
);

const atleteMapper = (athlete: any) => {
    return {
        id: athlete.id,
        name: athlete.name,
        dorsal: athlete.dorsal,
        isDisqualified: athlete.isDisqualified || false
    };
};

export default function NewDisqualificationReportForm() {
    const {
        loadingInitialData,
        error,
        event,
        athletes,
        validationSchema,
        handleSubmitDisqualificationReport,
        initialFormValues,
        refetchData,
        FIELD_NAMES
    } = useNewDisqualificationReport();

    if (loadingInitialData) {
        return <SkeletonLoader />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center max-w-xl mx-auto p-4">
                <Alert variant="destructive" className="w-full">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error al Cargar Datos</AlertTitle>
                    <AlertDescription>
                        {error}
                        <br />
                        <button onClick={refetchData} className="mt-2 text-sm font-semibold underline">
                            Reintentar
                        </button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex items-center justify-center max-w-xl mx-auto p-4">
                <Alert className="flex items-center space-x-2 p-5">
                    <InfoIcon className="h-4 w-4 text-blue-500" />
                    <AlertTitle>Información</AlertTitle>
                    <AlertDescription>
                        No hay un evento activo asignado para hoy o no se pudo cargar la información del evento.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <Formik<DisqualificationFormValues>
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmitDisqualificationReport}
                enableReinitialize
            >
                <Form className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="event-display">Evento</Label>
                        <Input
                            id="event-display"
                            value={event?.name || "Cargando nombre del evento..."}
                            disabled={true}
                            readOnly
                        />
                    </div>

                    <FormikAthleteSelector
                        name={FIELD_NAMES.athlete}
                        label="Atleta"
                        athletes={athletes.map(atleteMapper)}
                        disabled={athletes.length === 0}
                        popoverContentProps={{ className: "w-[--radix-popover-trigger-width]" }}
                    />

                    <FormikField
                        name={FIELD_NAMES.reason}
                        label="Razón (Máx. 50 caracteres)"
                        placeholder="Ej. No completar recorrido, Conducta antideportiva"
                        type='text'
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            // Limitar a 50 caracteres
                            if (e.target.value.length > 50) {
                                e.target.value = e.target.value.slice(0, 50);
                            }
                        }}
                    />

                    <FormikTextArea
                        name={FIELD_NAMES.description}
                        label="Descripción detallada"
                        placeholder="Describe los hechos observados..."
                        rows={4}
                    />

                    <FormikButton
                        disabled={!event}
                        className="mt-6"
                    >
                        Enviar Parte de Descalificación
                    </FormikButton>
                </Form>
            </Formik>
        </div>
    );
}