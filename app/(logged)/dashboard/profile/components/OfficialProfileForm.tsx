// app\(logged)\dashboard\profile\components\OfficialProfileForm.tsx
'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { AlertTriangle, Loader2, ServerCrash } from 'lucide-react';
import { AlertComponent, Button, ReadOnlyField, Skeleton } from '@/components/ui';
import { FormikField, FormikButton } from '@/components/ui';
import {
    useOfficialProfile,
    OfficialProfileFormValues,

    OFFICIAL_PROFILE_FIELD_NAMES as FIELD_NAMES,
} from '@/hooks/api/dashboard/profile/useOfficialProfile';
import { CenteredMessage } from '@/components/ui/centered-message';

const SkeletonLoader = () => (
    <div className="max-w-xl mx-auto p-4 space-y-4">
        <Skeleton className="h-10 w-full" /> {/* fullName */}
        <Skeleton className="h-10 w-full" /> {/* email */}
        <div className="flex space-x-4">
            <Skeleton className="h-10 w-1/2" /> {/* license */}
            <Skeleton className="h-10 w-1/2" /> {/* federationName */}
        </div>
        <Skeleton className="h-10 w-full mt-2" /> {/* Botón */}
    </div>
);

export default function OfficialProfileForm() {
    const {
        profileData,
        initialFormValues,
        loading,
        error,
        validationSchema,
        handleUpdateOfficialProfile,
        refetchProfile,

    } = useOfficialProfile();

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
                <AlertComponent message="No se pudieron cargar los datos del perfil." />
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <Formik<OfficialProfileFormValues>
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                onSubmit={handleUpdateOfficialProfile}
                enableReinitialize
            >
                <Form className="space-y-4">
                    <h2 className="text-xl font-semibold text-center mb-6">Editar Perfil de Juez</h2>

                    <FormikField
                        name={FIELD_NAMES.fullName}
                        label="Nombre completo"
                        placeholder="Tu nombre completo"
                    />

                    <FormikField
                        name={FIELD_NAMES.email}
                        label="Email"
                        type="email"
                        placeholder="tu@email.com"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ReadOnlyField
                            label="Licencia"
                            value={profileData?.license}
                            isLoading={loading && !profileData?.license}
                        />
                        <ReadOnlyField
                            label="Federación Autonómica"
                            value={profileData?.federationName}
                            isLoading={loading && !profileData?.federationName}
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