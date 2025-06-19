// hooks\api\dashboard\profile\useFederationProfile.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useAuth } from '@/hooks/auth/useAuth';
import type { FederationResponseDto, UpdateFederationDto } from '@/types/api';

export interface FederationProfileData extends FederationResponseDto {
    displayName: string; 
}

export interface FederationProfileFormValues {
    email: string;
}

export const FEDERATION_PROFILE_FIELD_NAMES: { [K in keyof FederationProfileFormValues]: K } = {
    email: 'email',
};

export const federationProfileSchema = Yup.object().shape({
    [FEDERATION_PROFILE_FIELD_NAMES.email]: Yup.string()
        .email('El email no es válido.')
        .required('El email es obligatorio.'),
});

export const useFederationProfile = () => {
    const { user, token, updateUserInContext } = useAuth();

    const [profileData, setProfileData] = useState<FederationProfileData | null>(null);
    const [initialFormValues, setInitialFormValues] = useState<FederationProfileFormValues>({
        [FEDERATION_PROFILE_FIELD_NAMES.email]: '',
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFederationProfile = useCallback(async () => {
        if (!token || !user?.id) {
            setError("Usuario no autenticado o ID no disponible.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await api(token).get<FederationResponseDto>(`users/federation/${user.id}`);
            const loadedData = response.data;
            const completeProfileData: FederationProfileData = {
                ...loadedData,
                displayName: loadedData.name || loadedData.region,
            };
            setProfileData(completeProfileData);
            setInitialFormValues({
                email: completeProfileData.email || '',
            });
        } catch (err) {
            const errorMessage = errorHandler(err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [token, user?.id]);

    useEffect(() => {
        fetchFederationProfile();
    }, [fetchFederationProfile]);

    const handleUpdateFederationProfile = useCallback(async (
        values: FederationProfileFormValues,
        formikActions: FormikHelpers<FederationProfileFormValues>
    ): Promise<void> => {
        if (!token || !user?.id) {
            toast.error("No se puede actualizar: usuario no autenticado.");
            formikActions.setSubmitting(false);
            return;
        }

        try {
            const payload: UpdateFederationDto = { email: values.email };
            await api(token).patch(`/users/federation/${user.id}`, payload);

            updateUserInContext({ email: values.email });

            if (profileData) {
                const updatedProfileData: FederationProfileData = { ...profileData, email: values.email };
                setProfileData(updatedProfileData);
                setInitialFormValues({ email: values.email });
                formikActions.resetForm({ values });
            }

            toast.success('¡Éxito! Tus datos han sido actualizados.');
        } catch (err) {
            const errorMessage = errorHandler(err);
            toast.error(`Error al actualizar perfil: ${errorMessage}`);
        } finally {
            formikActions.setSubmitting(false);
        }
    }, [token, user?.id, updateUserInContext, profileData]);

    return {
        profileData,
        initialFormValues,
        loading,
        error,
        validationSchema: federationProfileSchema,
        handleUpdateFederationProfile,
        refetchProfile: fetchFederationProfile,
        FIELD_NAMES: FEDERATION_PROFILE_FIELD_NAMES,
    };
};