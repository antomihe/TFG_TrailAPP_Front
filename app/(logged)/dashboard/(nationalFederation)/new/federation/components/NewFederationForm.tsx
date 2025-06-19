// app\(logged)\dashboard\(nationalFederation)\new\federation\components\NewFederationForm.tsx


'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { FormikField, FormikButton, Button } from '@/components/ui';


import { RegionsSelectField } from './RegionsSelectField';
import {
    useNewFederationForm,
    NEW_FEDERATION_FIELD_NAMES,
    NewFederationFormValues,
    RegionOption,
} from '@/hooks/api/dashboard/nationalFederation/useNewFederationForm';

const SkeletonLoader = () => (
    <div className="max-w-xl mx-auto p-4 space-y-4">
        <Skeleton className="h-10 w-full" /> {/* Email */}
        <Skeleton className="h-10 w-full" /> {/* Region Select */}
        <Skeleton className="h-10 w-full" /> {/* Code */}
        <Skeleton className="h-10 w-full mt-6" /> {/* Botón */}
    </div>
);

export default function NewFederationForm() {
    const {
        regions,
        loadingRegions,
        errorLoadingRegions,
        initialFormValues,
        validationSchema,
        handleCreateFederation,
        refetchRegions,
        FIELD_NAMES,
    } = useNewFederationForm();

    if (loadingRegions) {
        return <SkeletonLoader />;
    }

    if (errorLoadingRegions && regions.length === 0) {
        return (
            <div className="max-w-xl mx-auto p-4">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        {errorLoadingRegions}
                        <Button onClick={refetchRegions} variant="outline" size="sm" className="mt-2">
                            Reintentar carga de regiones
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <Formik<NewFederationFormValues>
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                onSubmit={(values, formikActions) => {
                    handleCreateFederation(values, formikActions);
                }}
                enableReinitialize
            >
                <Form className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Crear Nueva Federación Autonómica</h2>

                    <FormikField
                        name={FIELD_NAMES.email}
                        label="Email del Administrador de la Federación"
                        type="email"
                        placeholder="adminfed@example.com"
                        autoComplete="email"
                    />

                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-3">
                        <div className="w-full sm:w-3/5">
                            <RegionsSelectField
                                name={FIELD_NAMES.region}
                                label="Región (Comunidad Autónoma)"
                                options={regions}
                                placeholder="Selecciona una región"
                                disabled={loadingRegions || regions.length === 0}
                                popoverContentProps={{ style: { width: 'auto', minWidth: 'var(--radix-popover-trigger-width)' } }}
                            />
                        </div>

                        <div className="w-full sm:w-2/5">
                            <FormikField
                                name={FIELD_NAMES.code}
                                label="Código (3 letras)"
                                placeholder="MAD"
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    e.target.value = e.target.value.toUpperCase();
                                }}
                                autoComplete="off"
                                maxLength={3}
                            />
                        </div>
                    </div>
                    {regions.length === 0 && !loadingRegions && !errorLoadingRegions && (
                        <Alert variant="destructive" className="mt-2">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                No hay regiones disponibles para registrar. Todas las regiones podrían estar ya asignadas.
                            </AlertDescription>
                        </Alert>
                    )}

                    <FormikButton
                        type="submit"
                        className="w-full mt-6"
                        disabled={loadingRegions || regions.length === 0}
                    >
                        Crear Federación
                    </FormikButton>
                </Form>

            </Formik>
        </div>
    );
}