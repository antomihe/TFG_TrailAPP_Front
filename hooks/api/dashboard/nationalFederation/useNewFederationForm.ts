// hooks\api\dashboard\nationalFederation\useNewFederationForm.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useAuth } from '@/hooks/auth/useAuth';
import type { FederationNameResponseDto, CreateFederationDto } from '@/types/api';

export interface RegionOption {
    label: string;
    value: string;
}

export type NewFederationFormValues = CreateFederationDto;

export const NEW_FEDERATION_FIELD_NAMES: { [K in keyof NewFederationFormValues]: K } = {
    email: 'email',
    region: 'region',
    code: 'code',
};

export const newFederationSchema = Yup.object().shape({
    [NEW_FEDERATION_FIELD_NAMES.email]: Yup.string()
        .email('El email no es válido.')
        .required('El email es obligatorio.'),
    [NEW_FEDERATION_FIELD_NAMES.region]: Yup.string()
        .required('La región es obligatoria.'),
    [NEW_FEDERATION_FIELD_NAMES.code]: Yup.string()
        .required('El código de federación es obligatorio.')
        .matches(/^[A-Z]{3}$/, 'El código debe tener 3 letras mayúsculas (ej. MAD).')
        .length(3, 'El código debe tener exactamente 3 letras.'),
});

export const useNewFederationForm = () => {
    const { token } = useAuth();

    const [regions, setRegions] = useState<RegionOption[]>([]);
    const [loadingRegions, setLoadingRegions] = useState<boolean>(true);
    const [errorLoadingRegions, setErrorLoadingRegions] = useState<string | null>(null);

    const fetchUnregisteredRegions = useCallback(async () => {
        if (!token) {
            setErrorLoadingRegions("Usuario no autenticado para cargar regiones.");
            setLoadingRegions(false);
            setRegions([]);
            return;
        }
        setLoadingRegions(true);
        setErrorLoadingRegions(null);
        try {
            const response = await api(token).get<FederationNameResponseDto[]>('users/federation/unregistered');

            const fetchedRegions: RegionOption[] = Array.isArray(response.data)
                ? response.data.map((result: FederationNameResponseDto) => ({
                    label: result.region,
                    value: result.region,
                  }))
                : [];
            setRegions(fetchedRegions);
        } catch (err) {
            const errorMessage = errorHandler(err);
            setErrorLoadingRegions(errorMessage);
            toast.error(`Error al cargar regiones: ${errorMessage}`);
            setRegions([]);
        } finally {
            setLoadingRegions(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUnregisteredRegions();
    }, [fetchUnregisteredRegions]);

    const handleCreateFederation = useCallback(async (
        values: NewFederationFormValues,
        formikActions: FormikHelpers<NewFederationFormValues>
    ): Promise<void> => {
        if (!token) {
            toast.error("No se puede crear la federación: usuario no autenticado.");
            formikActions.setSubmitting(false);
            return;
        }
        try {
            const payload: CreateFederationDto = {
                ...values,
                code: values.code.toUpperCase(),
            };
            await api(token).post(`/users/federation`, payload);
            toast.success('¡Éxito! Federación creada correctamente.');
            formikActions.resetForm();
            await fetchUnregisteredRegions();
        } catch (err) {
            const errorMessage = errorHandler(err);
            toast.error(`Error al crear federación: ${errorMessage}`);
        } finally {
            formikActions.setSubmitting(false);
        }
    }, [token, fetchUnregisteredRegions]);

    const initialFormValues: NewFederationFormValues = {
        [NEW_FEDERATION_FIELD_NAMES.email]: '',
        [NEW_FEDERATION_FIELD_NAMES.region]: '',
        [NEW_FEDERATION_FIELD_NAMES.code]: '',
    };

    return {
        regions,
        loadingRegions,
        errorLoadingRegions,
        initialFormValues,
        validationSchema: newFederationSchema,
        handleCreateFederation,
        refetchRegions: fetchUnregisteredRegions,
        FIELD_NAMES: NEW_FEDERATION_FIELD_NAMES,
    };
};