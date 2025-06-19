// app\(logged)\dashboard\(official)\events\checkPoints\[checkPointId]\components\MaterialCheck.tsx
'use client';

import React, { useMemo, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldProps, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { H3, Skeleton } from '@/components/ui'; 
import { AlertComponent } from '@/components/ui/alert-component';
import { FormikButton } from '@/components/ui';
import { ConfirmationDialog } from './ConfirmationDialog';
import { MaterialChecklist } from './MaterialChecklist';
import {
  useMaterialCheck,
  MaterialCheckFormValues,
  MaterialDetails,
  MATERIAL_CHECK_FIELD_NAMES as FIELD_NAMES,
} from '@/hooks/api/dashboard/official/useMaterialCheck';
import { AthleteSelector } from '@/components/ui/athleteSelector';

const SkeletonLoader = () => (
  <div className="max-w-xl mx-auto p-4 space-y-4">
    <Skeleton className="h-8 w-1/2 mb-4" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-64 w-full" />
    <Skeleton className="h-10 w-full mt-2" />
  </div>
);

export default function MaterialCheck() {
  const {
    loadingInitialData,
    error,
    controlName,
    availableMaterials,
    athletes,
    fetchAthleteCheckedMaterials,
    handleSubmitMaterialCheck,
    showConfirmationDialog,
    confirmAndSubmitPending,
    cancelPendingSubmit,
    initialFormikValues,
  } = useMaterialCheck();

  const memoizedInitialValues = useMemo(() => initialFormikValues, [initialFormikValues]);

  const validationSchema = Yup.object().shape({
    [FIELD_NAMES.athlete]: Yup.string().nullable().required('Debe seleccionar un atleta.'),
    [FIELD_NAMES.materials]: Yup.object().when(FIELD_NAMES.athlete, ([athleteId], schema) => {
      return athleteId ? schema : schema.strip();
    }),
  });

  const handleAthleteSelect = useCallback(
    async (
      athleteId: string,
      form: FormikHelpers<MaterialCheckFormValues>
    ) => {
      const baseMaterialsState = availableMaterials.reduce((acc, material) => {
        acc[material.id] = false;
        return acc;
      }, {} as { [key: string]: boolean });

      form.setValues({
        [FIELD_NAMES.athlete]: athleteId,
        [FIELD_NAMES.materials]: baseMaterialsState,
      });

      if (athleteId) {
        const checkedMaterialIds = await fetchAthleteCheckedMaterials(athleteId);
        const newMaterialsState = { ...baseMaterialsState };
        if (checkedMaterialIds) {
          checkedMaterialIds.forEach(id => {
            if (newMaterialsState.hasOwnProperty(id)) {
              newMaterialsState[id] = true;
            }
            form.setFieldValue(FIELD_NAMES.materials, newMaterialsState);
          });
        } else form.setFieldValue(FIELD_NAMES.athlete, null);
      }
    },
    [availableMaterials, fetchAthleteCheckedMaterials]
  );

  if (error) {
    return <AlertComponent message={error} className="m-4" />;
  }
  if (loadingInitialData) {
    return <SkeletonLoader />;
  }
  if (availableMaterials.length === 0 && !loadingInitialData) {
    return <AlertComponent message={`No hay materiales configurados para el punto de control: ${controlName || ''}.`} />;
  }
  if (athletes.length === 0 && !loadingInitialData) {
    return <AlertComponent message={`No hay atletas disponibles para registrar en: ${controlName || ''}.`} />;
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <Formik<MaterialCheckFormValues>
        initialValues={memoizedInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitMaterialCheck}
        enableReinitialize
      >
        {({ values, isSubmitting }) => (
          <>
            <H3 className="text-center mb-6">Control de Material en: {controlName || "Punto de Control"}</H3>
            <Form className="space-y-6">
              <div className="space-y-1">
                <Field name={FIELD_NAMES.athlete}>
                  {({ field, form }: FieldProps<MaterialCheckFormValues[typeof FIELD_NAMES.athlete]>) => (
                    
                    <AthleteSelector
                      id={FIELD_NAMES.athlete}
                      label="Atleta"
                      athletes={athletes}
                      selectedValue={field.value}
                      onSelect={(athleteId) => handleAthleteSelect(athleteId, form as FormikHelpers<MaterialCheckFormValues>)}
                      disabled={isSubmitting}
                      placeholder="Seleccionar atleta..."
                    />
                  )}
                </Field>
                <ErrorMessage name={FIELD_NAMES.athlete} component="p" className="text-xs text-destructive mt-1" />
              </div>

              {values[FIELD_NAMES.athlete] && (
                <Field name={FIELD_NAMES.materials}>
                  {({ field: materialField, form: materialForm }: FieldProps<MaterialCheckFormValues[typeof FIELD_NAMES.materials]>) => (
                    <MaterialChecklist
                      field={materialField}
                      form={materialForm}
                      materials={availableMaterials}
                    />
                  )}
                </Field>
              )}

              <FormikButton
                type="submit"
                disabled={!values[FIELD_NAMES.athlete]}
                className="w-full"
              >
                Guardar Control de Material
              </FormikButton>
            </Form>

            <ConfirmationDialog
              open={showConfirmationDialog}
              onOpenChange={(open) => { if (!open) cancelPendingSubmit(); }}
              onConfirm={confirmAndSubmitPending}
              onCancel={cancelPendingSubmit}
              isSubmitting={isSubmitting}
              title="Confirmar Envío"
              description="Algunos materiales obligatorios no han sido seleccionados. ¿Deseas continuar igualmente?"
            />
          </>
        )}
      </Formik>
    </div>
  );
}