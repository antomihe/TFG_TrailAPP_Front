// hooks\api\dashboard\profile\useOfficialProfile.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useAuth } from '@/hooks/auth/useAuth';
import type { OfficialResponseDto, FederationResponseDto, UpdateOfficialDto } from '@/types/api';

export interface OfficialProfileData extends OfficialResponseDto {
    federationName?: string;
}

export interface OfficialProfileFormValues {
    email: string;
    fullName: string;
}

export const OFFICIAL_PROFILE_FIELD_NAMES: { [K in keyof OfficialProfileFormValues]: K } = {
    email: 'email',
    fullName: 'fullName',
};

export const officialProfileSchema = Yup.object().shape({
    [OFFICIAL_PROFILE_FIELD_NAMES.email]: Yup.string()
        .email('El email no es válido.')
        .required('El email es obligatorio.'),
    [OFFICIAL_PROFILE_FIELD_NAMES.fullName]: Yup.string()
        .required('El nombre completo es obligatorio.')
        .min(3, 'El nombre debe tener al menos 3 caracteres.'),
});

export const useOfficialProfile = () => {
    const { user, token, updateUserInContext } = useAuth();

    const [profileData, setProfileData] = useState<OfficialProfileData | null>(null);
    const [initialFormValues, setInitialFormValues] = useState<OfficialProfileFormValues>({
        [OFFICIAL_PROFILE_FIELD_NAMES.email]: '',
        [OFFICIAL_PROFILE_FIELD_NAMES.fullName]: '',
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOfficialProfile = useCallback(async () => {
        if (!token || !user?.id) {
            setError("Usuario no autenticado o ID no disponible.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const officialRes = await api(token).get<OfficialResponseDto>(`users/official/${user.id}`);
            const officialData = officialRes.data;

            let federationName = 'N/A';
            if (officialData.federationCode) {
                try {
                    const fedRes = await api(token).get<FederationResponseDto>(`users/federation/by-code/${officialData.federationCode}`);
                    federationName = fedRes.data.name || 'Federación Desconocida';
                } catch (fedError) {
                    console.warn(`No se pudo cargar el nombre de la federación para el código ${officialData.federationCode}:`, errorHandler(fedError));
                    federationName = 'Federación (Error al cargar)';
                }
            }

            const completeProfileData: OfficialProfileData = { ...officialData, federationName };
            setProfileData(completeProfileData);
            setInitialFormValues({
                email: completeProfileData.email || '',
                fullName: completeProfileData.displayName || '',
            });

        } catch (err) {
            const errorMessage = errorHandler(err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [token, user?.id]);

    useEffect(() => {
        fetchOfficialProfile();
    }, [fetchOfficialProfile]);

    const handleUpdateOfficialProfile = useCallback(async (
        values: OfficialProfileFormValues,
        formikActions: FormikHelpers<OfficialProfileFormValues>
    ): Promise<void> => {
        if (!token || !user?.id) {
            toast.error("No se puede actualizar: usuario no autenticado.");
            formikActions.setSubmitting(false);
            return;
        }

        try {
            const payload: UpdateOfficialDto = {
                email: values.email,
                fullName: values.fullName,
            };
            await api(token).patch(`/users/official/${user.id}`, payload);

            updateUserInContext({ username: values.fullName, email: values.email });

            if (profileData) {
                const updatedProfileData: OfficialProfileData = {
                    ...profileData,
                    email: values.email,
                    displayName: values.fullName,
                };
                setProfileData(updatedProfileData);
                setInitialFormValues(values);
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
        validationSchema: officialProfileSchema,
        handleUpdateOfficialProfile,
        refetchProfile: fetchOfficialProfile,
        FIELD_NAMES: OFFICIAL_PROFILE_FIELD_NAMES,
    };
};