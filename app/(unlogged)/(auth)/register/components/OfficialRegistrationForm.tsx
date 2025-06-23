// app\(unlogged)\(auth)\register\components\OfficialRegistrationForm.tsx
'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { FormikField, FormikButton, Button } from '@/components/ui';
import {
useOfficialRegistration,
OFFICIAL_FIELD_NAMES,
OfficialRegistrationFormValues,
} from '@/hooks/api/unlogged/auth/useOfficialRegistration';

import { FederationSelectField } from './FederationSelectField';

const FormSkeletonLoader = () => (
    <div className="space-y-5"> 
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full mt-6" />
    </div>
);

export default function OfficialRegistrationForm() {
    const {
        initialFormValues,
        validationSchema,
        federations,
        loadingFederations,
        errorLoadingFederations,
        handleRegisterOfficial,
        refetchFederations,
    } = useOfficialRegistration();

    if (loadingFederations) {
        return <FormSkeletonLoader />;
    }

    if (errorLoadingFederations && federations.length === 0) {
        return (
            <Alert variant="destructive" className="w-full"> 
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                    {errorLoadingFederations}
                    <Button
                        onClick={refetchFederations}
                        variant="outline"
                        size="sm"
                        className="mt-2 block w-full sm:w-auto" 
                    >
                        Reintentar carga
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    if (federations.length === 0 && !loadingFederations && !errorLoadingFederations) {
        return (
            <Alert variant="destructive" className="w-full"> 
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                    No hay federaciones disponibles para seleccionar o no se pudieron cargar.
                    Por favor, contacta con el administrador.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Formik<OfficialRegistrationFormValues>
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            onSubmit={handleRegisterOfficial}
        >
            <Form className="space-y-4">
                <FormikField
                    name={OFFICIAL_FIELD_NAMES.fullName}
                    label="Nombre completo"
                    placeholder="Marcos Pérez"
                    autoComplete="name"
                />

                <FormikField
                    name={OFFICIAL_FIELD_NAMES.email}
                    label="Email"
                    type="email"
                    placeholder="official@example.com"
                    autoComplete="email"
                />

                <FormikField
                    name={OFFICIAL_FIELD_NAMES.license}
                    label="Nº de licencia (Ej: AV3, BU34)"
                    placeholder="AV3"
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.target.value = e.target.value.toUpperCase();
                        e.target.value = e.target.value.replace(/[^A-Z0-9]/g, '');
                        e.target.value = e.target.value.slice(0, 4);
                    }}
                    autoComplete="off"
                />

                <FederationSelectField
                    name={OFFICIAL_FIELD_NAMES.federationCode}
                    label="Federación Autonómica"
                    options={federations}
                    disabled={federations.length === 0}
                    placeholder="Selecciona tu federación"
                />

                {errorLoadingFederations && federations.length > 0 && (
                    <Alert variant={'destructive'} className="mt-2 w-full"> 
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            Hubo un problema al actualizar la lista de federaciones, pero puedes continuar con las existentes.
                            ({errorLoadingFederations})
                        </AlertDescription>
                    </Alert>
                )}

                <FormikButton
                    type="submit"
                    className="w-full mt-8"
                    disabled={federations.length === 0}
                >
                    Registrarse como Juez
                </FormikButton>
            </Form>
        </Formik>
    );
}