// app\(logged)\dashboard\profile\components\FederationProfileForm.tsx
'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { AlertTriangle, Loader2, ServerCrash } from 'lucide-react';
import {  AlertComponent, ReadOnlyField, Skeleton, Button } from '@/components/ui';
import { FormikField, FormikButton } from '@/components/ui';
import {
    useFederationProfile,
    FederationProfileFormValues,
    FEDERATION_PROFILE_FIELD_NAMES as FIELD_NAMES,
} from '@/hooks/api/dashboard/profile/useFederationProfile';
import { CenteredMessage } from '@/components/ui/centered-message';

const SkeletonLoader = () => (
    <div className="max-w-xl mx-auto p-4 space-y-4">
        <Skeleton className="h-10 w-full" /> {/* Nombre Federación (Display) */}
        <Skeleton className="h-10 w-full" /> {/* Email */}
        <div className="flex space-x-4">
            <Skeleton className="h-10 w-1/2" /> {/* Región */}
            <Skeleton className="h-10 w-1/2" /> {/* Código Federación */}
        </div>
        <Skeleton className="h-10 w-full mt-2" /> {/* Botón */}
    </div>
);

export default function FederationProfileForm() {
    const {
        profileData,
        initialFormValues,
        loading,
        error,
        validationSchema,
        handleUpdateFederationProfile,
        refetchProfile,
    } = useFederationProfile();

    if (loading && !profileData) {
        return <SkeletonLoader />;
    }

    if (error) {
        return (
            <CenteredMessage
                icon={<ServerCrash size={48} />}
                title="Error al Cargar Datos del Perfil"
                variant="destructive"
                message={<>Ocurrió un problema al obtener los datos del perfil. <br /> ({error})</>}
                action={
                    <Button onClick={() => refetchProfile()} variant="destructive" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
                        Reintentar
                    </Button>
                }
            />
        );
    }

    if (!profileData && !loading) {
        return (
            <div className="max-w-xl mx-auto p-4">
                <AlertComponent message="No se pudieron cargar los datos del perfil de la federación." />
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <Formik<FederationProfileFormValues>
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                onSubmit={handleUpdateFederationProfile}
                enableReinitialize
            >
                <Form className="space-y-4">
                    <h2 className="text-xl font-semibold text-center mb-6">
                        Perfil de Federación: {profileData?.displayName || "Cargando..."}
                    </h2>

                    <FormikField
                        name={FIELD_NAMES.email}
                        label="Email de Contacto"
                        type="email"
                        placeholder="contacto@federacion.com"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ReadOnlyField
                            label="Región"
                            value={profileData?.region}
                            isLoading={loading && !profileData?.region}
                        />
                        <ReadOnlyField
                            label="Código de Federación"
                            value={profileData?.code}
                            isLoading={loading && !profileData?.code}
                        />
                    </div>

                    <FormikButton
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6"
                    >
                        Guardar Cambios
                    </FormikButton>
                </Form>
            </Formik>
        </div>
    );
}