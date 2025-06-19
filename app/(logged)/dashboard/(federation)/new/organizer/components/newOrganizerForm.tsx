// app\(logged)\dashboard\(federation)\new\organizer\components\newOrganizerForm.tsx

'use client';

import React from 'react';
import { Formik, Form, Field } from 'formik';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { FormikField, FormikButton, Button } from '@/components/ui';
import {
    useNewOrganizerForm,
    NewOrganizerFormValues,
} from '@/hooks/api/dashboard/federation/useNewOrganizerForm';

const SkeletonLoader = () => (
    <div className="max-w-xl mx-auto p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full mt-6" />
    </div>
);

export default function NewOrganizerForm() {
    const {
        initialFormValues,
        loadingFedCode,
        refetchFederationCode,
        errorLoadingFedCode,
        validationSchema,
        handleCreateOrganizer,
        FIELD_NAMES,
    } = useNewOrganizerForm();

    if (loadingFedCode) {
        return <SkeletonLoader />;
    }

    if (errorLoadingFedCode) {
        return (
            <div className="max-w-xl mx-auto p-4">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        {errorLoadingFedCode}
                        <Button onClick={refetchFederationCode} variant="outline" size="sm" className="mt-2">
                            Reintentar carga de código
                        </Button>
                    </AlertDescription>
                </Alert>
                <p className="mt-2 text-sm text-muted-foreground">
                    No se puede crear un organizador sin un código de federación válido asociado a tu cuenta.
                    Por favor, contacta con soporte si el problema persiste.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <Formik<NewOrganizerFormValues>
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                onSubmit={handleCreateOrganizer}
                enableReinitialize
            >
                <Form className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Crear Nuevo Organizador</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Este nuevo usuario organizador estará asociado a tu federación
                        (Código: {initialFormValues.federationCode || "N/A"}).
                    </p>

                    <FormikField
                        name={FIELD_NAMES.email}
                        label="Email del Organizador"
                        type="email"
                        placeholder="organizer@example.com"
                        autoComplete="email"
                    />

                    <FormikField
                        name={FIELD_NAMES.name}
                        label="Nombre del Organizador (Club, Entidad, etc.)"
                        placeholder="Club Deportivo Ejemplo"
                        autoComplete="organization"
                    />

                    <Field
                        type="hidden"
                        name={FIELD_NAMES.federationCode}
                    />

                    <FormikButton
                        type="submit"
                        className="w-full mt-6"
                        disabled={loadingFedCode || !initialFormValues.federationCode}
                    >
                        Crear Organizador
                    </FormikButton>
                </Form>
            </Formik>
        </div>
    );
}