// app\(logged)\dashboard\(organizer)\events\equipment\[eventId]\components\EquipmentForm.tsx
'use client';

import React from 'react';
import { Formik, Form, FieldArray, ArrayHelpers } from 'formik'; 
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle, Skeleton, Button as UiButton } from '@/components/ui';
import { FormikButton } from '@/components/ui'; 
import EquipmentInput from './EquipmentInput';
import EquipmentList from './EquipmentList';
import {
    useEventEquipment,
    EventEquipmentFormValues,
    EquipmentItemForm, 
    EVENT_EQUIPMENT_FIELD_NAMES as FIELD_NAMES,
} from '@/hooks/api/dashboard/organizer/useEventEquipment'; 
import { toast } from 'sonner';

const SkeletonLoader = () => (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
        <Skeleton className="h-16 w-full" /> {/* EquipmentInput */}
        <Skeleton className="h-40 w-full" /> {/* EquipmentList */}
        <Skeleton className="h-10 w-full mt-2" /> {/* Botón */}
    </div>
);

export default function EquipmentForm() {
    const {
        initialFormValues, 
        loading,
        error,
        handleSaveEquipment,
        refetchEquipment,
        validationSchema,
        
    } = useEventEquipment();


    if (loading && initialFormValues.equipment.length === 0) { 
        return <SkeletonLoader />;
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error al Cargar Material</AlertTitle>
                    <AlertDescription>
                        {error}
                        <br />
                        <UiButton onClick={refetchEquipment} variant="link" className="p-0 h-auto text-destructive underline mt-2">
                            Reintentar
                        </UiButton>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4"> 
            <Formik<EventEquipmentFormValues>
                initialValues={initialFormValues} 
                validationSchema={validationSchema}
                onSubmit={handleSaveEquipment} 
                enableReinitialize 
            >
                {({ values, isSubmitting, errors, touched }) => (
                    <Form>
                        <h2 className="text-xl font-semibold text-center mb-6">Configurar Material del Evento</h2>
                        <div className="space-y-6">
                            <FieldArray name={FIELD_NAMES.equipment}>
                                {(arrayHelpers: ArrayHelpers) => ( 
                                    <>
                                        <EquipmentInput
                                            onAddEquipment={(newItem) => {
                                                
                                                const exists = values.equipment.some(
                                                    (item) => item.name.toLowerCase() === newItem.name.toLowerCase() && !item.removed
                                                );
                                                if (!exists) {
                                                    arrayHelpers.push({ ...newItem, removed: false });
                                                } else {
                                                    toast.error("Este material ya existe en la lista activa.");
                                                }
                                            }}
                                            existingEquipmentNames={values.equipment
                                                                        .filter(item => !item.removed)
                                                                        .map(item => item.name.toLowerCase())}
                                            disabled={isSubmitting}
                                        />
                                        <EquipmentList
                                            equipmentItems={values.equipment} 
                                            arrayHelpers={arrayHelpers as any} 
                                            disabled={isSubmitting}
                                        />
                                    </>
                                )}
                            </FieldArray>
                            {typeof errors.equipment === 'string' && touched.equipment && (
                                 <p className="text-xs text-destructive mt-1">{errors.equipment}</p>
                            )}
                        </div>

                        <FormikButton
                            type="submit"
                            disabled={loading} 
                            className="w-full mt-8"
                        >
                            Guardar Cambios en Material
                        </FormikButton>
                    </Form>
                )}
            </Formik>
        </div>
    );
}