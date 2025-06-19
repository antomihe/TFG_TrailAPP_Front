// app\(logged)\dashboard\(organizer)\new\event\components\newEventForm.tsx
'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { FormikDateSelector, FormikLocationSelector, FormikMultipleDistanceInput, FormikProvinceSelector, Skeleton } from '@/components/ui';
import { FormikField, FormikButton } from '@/components/ui';
import {
    useNewEventForm,
    NewEventFormValues,
} from '@/hooks/api/dashboard/organizer/useNewEventForm';


export default function NewEventForm() {
    const {
        initialValues,
        validationSchema,
        handleSubmitNewEvent,
        FIELD_NAMES,
    } = useNewEventForm();

    return (
        <div className="max-w-xl mx-auto p-4">
            <Formik<NewEventFormValues>
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmitNewEvent}
                enableReinitialize
            >
                {({ values }) => (
                    <Form className="space-y-4">
                        <h2 className="text-xl font-semibold text-center mb-6">Crear Nuevo Evento</h2>

                        <FormikField
                            name={FIELD_NAMES.name}
                            label="Nombre del Evento"
                            placeholder="Ultra Trail Gredos"
                        />

                        <div className="space-y-1">
                            <FormikDateSelector
                                id={FIELD_NAMES.date}
                                name={FIELD_NAMES.date}
                                label="Fecha del Evento"
                                fromDate={new Date()}
                            />
                        </div>


                        <FormikProvinceSelector
                            name={FIELD_NAMES.province}
                            locationFieldName={FIELD_NAMES.location}
                            id={FIELD_NAMES.province}
                            label="Provincia"
                        />


                        {values[FIELD_NAMES.province] && (
                            <FormikLocationSelector
                                name={FIELD_NAMES.location}
                                provinceFieldName={FIELD_NAMES.province}
                                id={FIELD_NAMES.location}
                                label="Localidad"
                            />
                        )}


                        <FormikMultipleDistanceInput
                            name={FIELD_NAMES.distances}
                            label="Distancias del Evento (km)"
                        />

                        <FormikButton
                            className="mt-6"
                        >
                            Crear Evento
                        </FormikButton>
                    </Form>
                )}
            </Formik>
        </div>
    );
}