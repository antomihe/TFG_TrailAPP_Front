// app\(unlogged)\(auth)\register\components\AthleteRegistrationForm.tsx
'use client';
import React from 'react';
import { Formik, Form } from 'formik';
import {
    useAthleteRegistration,
    ATHLETE_FIELD_NAMES,
    AthleteRegistrationFormValues,
} from '@/hooks/api/unlogged/auth/useAthleteRegistration';
import { FormikField, FormikButton } from '@/components/ui';
import { formatDateInput } from '@/lib/utils';

export default function AthleteRegistrationForm() {
    const {
        initialFormValues,
        validationSchema,
        handleRegisterAthlete,
    } = useAthleteRegistration();

    return (
        <Formik<AthleteRegistrationFormValues>
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            onSubmit={handleRegisterAthlete}
        >
            <Form className="w-full space-y-4">
                <FormikField
                    name={ATHLETE_FIELD_NAMES.fullName}
                    label="Nombre completo"
                    placeholder="Ana Jiménez"
                    autoComplete="name"
                />

                <FormikField
                    name={ATHLETE_FIELD_NAMES.email}
                    label="Email"
                    type="email"
                    placeholder="athlete@email.com"
                    autoComplete="email"
                />

                <FormikField
                    name={ATHLETE_FIELD_NAMES.idNumber}
                    label="DNI / NIE"
                    placeholder="12345678Z o X1234567Z"
                    autoComplete="off"
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.target.value = e.target.value.toUpperCase();
                    }}
                />

                <FormikField
                    name={ATHLETE_FIELD_NAMES.dateOfBirth}
                    label="Fecha de nacimiento (dd/mm/yyyy)"
                    placeholder="31/12/2000"
                    autoComplete="off"
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const formatted = formatDateInput(e.target.value);
                        e.target.value = formatted;
                    }}
                />

                <FormikButton
                    type="submit"
                    className="w-full mt-8"
                >
                    Registrarse
                </FormikButton>
            </Form>
        </Formik>
    );
}