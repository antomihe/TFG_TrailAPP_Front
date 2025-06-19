// hooks\api\unlogged\auth\useOfficialRegistration.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import type { FederationResponseDto, CreateOfficialDto } from '@/types/api';

export interface FederationOption {
    code: string;
    name: string;
}

export type OfficialRegistrationFormValues = CreateOfficialDto;

export const OFFICIAL_FIELD_NAMES: { [K in keyof OfficialRegistrationFormValues]: K } = {
    email: 'email',
    fullName: 'fullName',
    license: 'license',
    federationCode: 'federationCode',
};

export const officialRegistrationSchema = Yup.object().shape({
    [OFFICIAL_FIELD_NAMES.email]: Yup.string()
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'El email no es válido.')
        .required('El email es obligatorio.'),
    [OFFICIAL_FIELD_NAMES.fullName]: Yup.string()
        .required('El nombre completo es obligatorio.')
        .min(3, 'El nombre debe tener al menos 3 caracteres.'),
    [OFFICIAL_FIELD_NAMES.license]: Yup.string()
        .required('El número de licencia es obligatorio.')
        .max(4, 'La licencia no puede tener más de 4 caracteres.') 
        .matches(/^[A-Za-z0-9]+$/, 'La licencia solo puede contener letras y números (sin espacios ni símbolos especiales).'),
    [OFFICIAL_FIELD_NAMES.federationCode]: Yup.string()
        .required('La federación es obligatoria.'),
});

export const useOfficialRegistration = () => {
    const [federations, setFederations] = useState<FederationOption[]>([]);
    const [loadingFederations, setLoadingFederations] = useState<boolean>(true);
    const [errorLoadingFederations, setErrorLoadingFederations] = useState<string | null>(null);
    const [isSubmittingHook, setIsSubmittingHook] = useState<boolean>(false);

    const fetchFederations = useCallback(async () => {
        setLoadingFederations(true);
        setErrorLoadingFederations(null);
        try {
            const response = await api().get<FederationResponseDto[]>('/users/federation');
            const federationsData = Array.isArray(response.data)
                ? response.data.map((fed: FederationResponseDto) => ({
                    code: fed.code,
                    name: fed.name,
                }))
                : [];
            setFederations(federationsData);
        } catch (err) {
            const errorMessage = errorHandler(err);
            setErrorLoadingFederations(errorMessage);
        } finally {
            setLoadingFederations(false);
        }
    }, []);

    useEffect(() => {
        fetchFederations();
    }, [fetchFederations]);

    const handleRegisterOfficial = useCallback(async (
        values: OfficialRegistrationFormValues,
        formikActions: FormikHelpers<OfficialRegistrationFormValues>
    ): Promise<void> => {
        setIsSubmittingHook(true);
        formikActions.setSubmitting(true);

        try {
            const payload: CreateOfficialDto = {
                email: values.email,
                fullName: values.fullName,
                license: values.license,
                federationCode: values.federationCode,
            };
            await api().post('/users/official', payload);
            toast.success('¡Éxito! Revisa tu correo electrónico para confirmar tu cuenta de juez.');
            formikActions.resetForm();
        } catch (error: any) {
            const errorMessage = errorHandler(error);
            toast.error(errorMessage || 'Error al registrar el juez. Inténtalo de nuevo.');
        } finally {
            formikActions.setSubmitting(false);
            setIsSubmittingHook(false);
        }
    }, []);

    const initialFormValues: OfficialRegistrationFormValues = {
        [OFFICIAL_FIELD_NAMES.email]: '',
        [OFFICIAL_FIELD_NAMES.fullName]: '',
        [OFFICIAL_FIELD_NAMES.license]: '',
        [OFFICIAL_FIELD_NAMES.federationCode]: '',
    };

    return {
        initialFormValues,
        validationSchema: officialRegistrationSchema,
        federations,
        loadingFederations,
        errorLoadingFederations,
        isSubmitting: isSubmittingHook,
        handleRegisterOfficial,
        refetchFederations: fetchFederations,
        OFFICIAL_FIELD_NAMES,
    };
};