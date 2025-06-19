// hooks\api\dashboard\profile\useOrganizerProfile.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useAuth } from '@/hooks/auth/useAuth';
import type { OrganizerResponseDto, FederationResponseDto, UpdateOrganizerDto } from '@/types/api';

export interface OrganizerProfileData extends OrganizerResponseDto {
    federationName?: string;
}

export interface OrganizerProfileFormValues {
    email: string;
    name: string;
}

export const ORGANIZER_PROFILE_FIELD_NAMES: { [K in keyof OrganizerProfileFormValues]: K } = {
    email: 'email',
    name: 'name',
};

export const organizerProfileSchema = Yup.object().shape({
    [ORGANIZER_PROFILE_FIELD_NAMES.email]: Yup.string()
        .email('El email no es válido.')
        .required('El email es obligatorio.'),
    [ORGANIZER_PROFILE_FIELD_NAMES.name]: Yup.string()
        .required('El nombre es obligatorio.')
        .min(3, 'El nombre debe tener al menos 3 caracteres.'),
});

export const useOrganizerProfile = () => {
    const { user, token, updateUserInContext } = useAuth();

    const [profileData, setProfileData] = useState<OrganizerProfileData | null>(null);
    const [initialFormValues, setInitialFormValues] = useState<OrganizerProfileFormValues>({
        [ORGANIZER_PROFILE_FIELD_NAMES.email]: '',
        [ORGANIZER_PROFILE_FIELD_NAMES.name]: '',
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrganizerProfile = useCallback(async () => {
        if (!token || !user?.id) {
            setError("Usuario no autenticado o ID no disponible.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const organizerRes = await api(token).get<OrganizerResponseDto>(`users/organizer/${user.id}`);
            const organizerData = organizerRes.data;

            let federationName = 'N/A';
            if (organizerData.federationCode) {
                try {
                    const fedRes = await api(token).get<FederationResponseDto>(`users/federation/by-code/${organizerData.federationCode}`);
                    federationName = fedRes.data.name || 'Federación Desconocida';
                } catch (fedError) {
                    console.warn(`No se pudo cargar el nombre de la federación para el código ${organizerData.federationCode}:`, errorHandler(fedError));
                    federationName = 'Federación (Error al cargar)';
                }
            }

            const completeProfileData: OrganizerProfileData = {
                ...organizerData,
                federationName
            };
            setProfileData(completeProfileData);
            setInitialFormValues({
                email: completeProfileData.email || '',
                name: completeProfileData.name || '',
            });

        } catch (err) {
            const errorMessage = errorHandler(err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [token, user?.id]);

    useEffect(() => {
        fetchOrganizerProfile();
    }, [fetchOrganizerProfile]);

    const handleUpdateOrganizerProfile = useCallback(async (
        values: OrganizerProfileFormValues,
        formikActions: FormikHelpers<OrganizerProfileFormValues>
    ): Promise<void> => {
        if (!token || !user?.id) {
            toast.error("No se puede actualizar: usuario no autenticado.");
            formikActions.setSubmitting(false);
            return;
        }

        try {
            const payload: UpdateOrganizerDto = {
                email: values.email,
                name: values.name,
            };
            await api(token).patch(`/users/organizer/${user.id}`, payload);

            updateUserInContext({ username: values.name, email: values.email });

            if (profileData) {
                const updatedProfileData: OrganizerProfileData = {
                    ...profileData,
                    email: values.email,
                    name: values.name,
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
        validationSchema: organizerProfileSchema,
        handleUpdateOrganizerProfile,
        refetchProfile: fetchOrganizerProfile,
        FIELD_NAMES: ORGANIZER_PROFILE_FIELD_NAMES,
    };
};