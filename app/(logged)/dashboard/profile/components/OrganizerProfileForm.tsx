// app\(logged)\dashboard\profile\components\OrganizerProfileForm.tsx
'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { AlertTriangle, Loader2, ServerCrash } from 'lucide-react';
import { AlertComponent, ReadOnlyField, Skeleton, Button } from '@/components/ui';
import { FormikField, FormikButton } from '@/components/ui';
import {
    useOrganizerProfile,
    OrganizerProfileFormValues,
    ORGANIZER_PROFILE_FIELD_NAMES as FIELD_NAMES,
} from '@/hooks/api/dashboard/profile/useOrganizerProfile';
import { CenteredMessage } from '@/components/ui/centered-message';

const SkeletonLoader = () => (
    <div className="max-w-xl mx-auto p-4 space-y-4">
        <Skeleton className="h-10 w-full" /> {/* name */}
        <Skeleton className="h-10 w-full" /> {/* email */}
        <Skeleton className="h-10 w-full" /> {/* federationName */}
        <Skeleton className="h-10 w-full mt-2" /> {/* Botón */}
    </div>
);

export default function OrganizerProfileForm() {
    const {
        profileData,
        initialFormValues,
        loading,
        error,
        validationSchema,
        handleUpdateOrganizerProfile,
        refetchProfile,
    } = useOrganizerProfile();

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
                <AlertComponent message="No se pudieron cargar los datos del perfil del organizador." />
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <Formik<OrganizerProfileFormValues>
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                onSubmit={handleUpdateOrganizerProfile}
                enableReinitialize
            >
                <Form className="space-y-4">
                    <h2 className="text-xl font-semibold text-center mb-6">Editar Perfil de Organizador</h2>

                    <FormikField
                        name={FIELD_NAMES.name}
                        label="Nombre del Organizador/Club"
                        placeholder="Nombre de tu club u organización"
                    />

                    <FormikField
                        name={FIELD_NAMES.email}
                        label="Email de Contacto"
                        type="email"
                        placeholder="contacto@organizacion.com"
                    />

                    <ReadOnlyField
                        label="Federación Autonómica (Asociada)"
                        value={profileData?.federationName}
                        isLoading={loading && !profileData?.federationName}
                    />

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