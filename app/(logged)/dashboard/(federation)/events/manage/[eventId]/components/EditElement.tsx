// app\(logged)\dashboard\(federation)\events\manage\[eventId]\components\EditElement.tsx


'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { FormikField, FormikButton, Button } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DateInput } from '@/components/ui/dateInput';
import { EditableEventFormValues, useEditEventForm } from '@/hooks/api/dashboard/federation/useEditEventForm';


const SkeletonLoader = () => (
    <div className="max-w-xl mx-auto p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full mt-6" />
    </div>
);


const ReadOnlyField: React.FC<{ label: string; value: string | number | undefined; placeholder?: string }> = ({
    label,
    value,
    placeholder = "N/A",
}) => (
    <div className="space-y-1">
        <Label htmlFor={label.toLowerCase().replace(/\s/g, '-')}>{label}</Label>
        <Input
            id={label.toLowerCase().replace(/\s/g, '-')}
            value={value === undefined || value === null || value === '' ? placeholder : String(value)}
            disabled={true}
            readOnly
        />
    </div>
);

export default function EditEventForm() {
    const {
        eventData,
        initialFormValues,
        loadingData,
        errorLoading,
        validationSchema,
        handleUpdateEvent,
        refetchEventData,
        FIELD_NAMES
    } = useEditEventForm();

    if (loadingData) {
        return <SkeletonLoader />;
    }

    if (errorLoading) {
        return (
            <div className="max-w-xl mx-auto p-4">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        {errorLoading}
                        <Button onClick={refetchEventData} variant="outline" size="sm" className="mt-2">
                            Reintentar carga
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!eventData) {
        return (
            <div className="max-w-xl mx-auto p-4">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        No se pudieron cargar los datos del evento.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-4">
            <Formik<EditableEventFormValues>
                initialValues={initialFormValues}
                validationSchema={validationSchema}
                onSubmit={handleUpdateEvent}
                enableReinitialize
            >
                {({ values, setFieldTouched, setFieldValue }) => (
                    <Form className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Editar Evento: {eventData.name}</h2>

                        <FormikField
                            name={FIELD_NAMES.name}
                            label="Nombre del Evento"
                            placeholder="Nombre del evento"
                        />


                        <div className="space-y-1">
                            <Label htmlFor={FIELD_NAMES.date}>Fecha del Evento</Label>
                            <DateInput
                                id={FIELD_NAMES.date}
                                name={FIELD_NAMES.date}
                                date={values.date}
                                setFieldValue={setFieldValue}
                                setFieldTouched={setFieldTouched}

                            />
                            <FormikField name={FIELD_NAMES.date} label="" className="hidden" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t mt-6">
                            <ReadOnlyField label="Provincia" value={eventData.province} />
                            <ReadOnlyField label="Localidad" value={eventData.location} />
                        </div>
                        <ReadOnlyField
                            label="Distancias"
                            value={eventData.distances?.join('km, ') + (eventData.distances?.length > 0 ? 'km' : '')}
                            placeholder="No especificadas"
                        />
                        <ReadOnlyField label="Organizador" value={eventData.organizer?.name} />
                        <ReadOnlyField label="Correo del Organizador" value={eventData.organizer?.email} />


                        <FormikButton
                            type="submit"
                            className="w-full mt-6"
                            disabled={loadingData}
                        >
                            Actualizar Evento
                        </FormikButton>
                    </Form>
                )}
            </Formik>
        </div>
    );
}