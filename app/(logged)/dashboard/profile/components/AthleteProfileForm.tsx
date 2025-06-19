// app\(logged)\dashboard\profile\components\AthleteProfileForm.tsx
'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { AlertTriangle, Loader2, ServerCrash } from 'lucide-react';
import { Button, Skeleton } from '@/components/ui';
import { FormikField, FormikButton } from '@/components/ui';
import {
    useAthleteProfile,
    AthleteProfileFormValues,
} from '@/hooks/api/dashboard/profile/useAthleteProfile';
import { formatDateInput } from '@/lib/utils';
import { CenteredMessage } from '@/components/ui/centered-message';

const SkeletonLoader = () => (
    <div className="max-w-xl mx-auto p-4 space-y-4">
        <Skeleton className="h-10 w-full" /> {/* fullName */}
        <Skeleton className="h-10 w-full" /> {/* email */}
        <div className="flex space-x-4">
            <Skeleton className="h-10 w-1/2" /> {/* idNumber */}
            <Skeleton className="h-10 w-1/2" /> {/* dateOfBirth */}
        </div>
        <Skeleton className="h-10 w-full mt-2" /> {/* Botón */}
    </div>
);

export default function AthleteProfileForm() {
    const {
        initialFormValues,
        loading,
        error,
        validationSchema,
        handleUpdateUserProfile,
        refetchProfile,
        FIELD_NAMES,
    } = useAthleteProfile();

    if (loading && !initialFormValues.email) {
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


    return (
        <div className="max-w-xl mx-auto p-4">
            <Formik<AthleteProfileFormValues>
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                onSubmit={handleUpdateUserProfile}
                enableReinitialize
            >
                <Form className="space-y-4">
                    <h2 className="text-xl font-semibold text-center mb-6">Editar Perfil de Atleta</h2>

                    <FormikField
                        name={FIELD_NAMES.fullName}
                        label="Nombre completo"
                        placeholder="Tu nombre completo"
                        autoComplete="name"
                    />

                    <FormikField
                        name={FIELD_NAMES.email}
                        label="Email"
                        type="email"
                        placeholder="tu@email.com"
                        autoComplete="email"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormikField
                            name={FIELD_NAMES.idNumber}
                            label="DNI / NIE"
                            placeholder="12345678Z o X1234567Z"
                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                e.target.value = e.target.value.toUpperCase();
                            }}
                            autoComplete="off"
                        />
                        <FormikField
                            name={FIELD_NAMES.dateOfBirth}
                            label="Fecha de nacimiento (dd/mm/yyyy)"
                            placeholder="dd/mm/yyyy"
                            type="text"
                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const formatted = formatDateInput(e.target.value);
                                e.target.value = formatted;
                            }}
                            autoComplete="bday"
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