// hooks\api\dashboard\federation\useNewOrganizerForm.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useAuth } from '@/hooks/auth/useAuth';
import type { CreateOrganizerDto, FederationResponseDto } from '@/types/api';

export type NewOrganizerFormValues = CreateOrganizerDto;

export const NEW_ORGANIZER_FIELD_NAMES: { [K in keyof NewOrganizerFormValues]: K } = {
    email: 'email',
    name: 'name',
    federationCode: 'federationCode',
};

export const newOrganizerSchema = Yup.object().shape({
    [NEW_ORGANIZER_FIELD_NAMES.email]: Yup.string()
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'El email no es válido.'
        )
        .required('El email es obligatorio.'),
    [NEW_ORGANIZER_FIELD_NAMES.name]: Yup.string()
        .required('El nombre es obligatorio.')
        .min(3, 'El nombre debe tener al menos 3 caracteres.'),
    [NEW_ORGANIZER_FIELD_NAMES.federationCode]: Yup.string()
        .required('El código de federación es un dato interno necesario.')
        .matches(/^[A-Z]{3}$/, 'El código de federación debe tener 3 letras mayúsculas.'),
});

export const useNewOrganizerForm = () => {
    const {token, user} = useAuth();

    const [federationCodeValue, setFederationCodeValue] = useState<string>('');
    const [loadingFedCode, setLoadingFedCode] = useState<boolean>(true);
    const [errorLoadingFedCode, setErrorLoadingFedCode] = useState<string | null>(null);

    const [initialFormValues, setInitialFormValues] = useState<NewOrganizerFormValues>({
        [NEW_ORGANIZER_FIELD_NAMES.email]: '',
        [NEW_ORGANIZER_FIELD_NAMES.name]: '',
        [NEW_ORGANIZER_FIELD_NAMES.federationCode]: '',
    });

    const fetchFederationCode = useCallback(async () => {
        if (!token || !user?.id) {
            setErrorLoadingFedCode("No autenticado o ID de usuario no disponible.");
            setLoadingFedCode(false);
            return;
        }
        setLoadingFedCode(true);
        setErrorLoadingFedCode(null);
        try {
            const response = await api(token).get<FederationResponseDto>(`users/federation/${user.id}`);
            const code = response.data.code || '';
            setFederationCodeValue(code);
            if (!code) {
                toast.warning("No se pudo obtener el código de federación asociado a tu usuario. Por favor, contacta con el administrador.", { duration: 7000 });
                setErrorLoadingFedCode("Código de federación no encontrado para el usuario.");
            }
        } catch (err) {
            const errorMessage = errorHandler(err);
            setErrorLoadingFedCode(errorMessage);
            toast.error(`Error al cargar código de federación: ${errorMessage}`);
        } finally {
            setLoadingFedCode(false);
        }
    }, [token, user?.id]);

    useEffect(() => {
        if (!federationCodeValue) {
            fetchFederationCode();
        } else {
            setLoadingFedCode(false);
        }
    }, [fetchFederationCode, federationCodeValue]);

    useEffect(() => {
        if (federationCodeValue) {
            setInitialFormValues(prev => ({
                ...prev,
                [NEW_ORGANIZER_FIELD_NAMES.federationCode]: federationCodeValue,
            }));
        }
    }, [federationCodeValue]);

    const handleCreateOrganizer = useCallback(async (
        values: NewOrganizerFormValues,
        formikActions: FormikHelpers<NewOrganizerFormValues>
    ): Promise<void> => {
        if (!token) {
            toast.error("No se puede crear el organizador: usuario no autenticado.");
            formikActions.setSubmitting(false);
            return;
        }

        if (!values.federationCode) {
            toast.error("Error interno: falta el código de federación. Por favor, recarga la página o verifica la configuración.", { duration: 7000 });
            formikActions.setFieldError(NEW_ORGANIZER_FIELD_NAMES.federationCode, "Código de federación no disponible.");
            formikActions.setSubmitting(false);
            return;
        }

        const payload: CreateOrganizerDto = {
            email: values.email,
            name: values.name,
            federationCode: values.federationCode,
        };

        try {
            await api(token).post(`/users/organizer`, payload);
            toast.success('¡Éxito! Nuevo organizador creado.');
            formikActions.resetForm({
                values: {
                    ...initialFormValues,
                    email: '',
                    name: '',
                }
            });
        } catch (err) {
            const errorMessage = errorHandler(err);
            toast.error(`Error al crear organizador: ${errorMessage}`);
        } finally {
            formikActions.setSubmitting(false);
        }
    }, [token, initialFormValues]);

    return {
        initialFormValues,
        loadingFedCode,
        errorLoadingFedCode,
        validationSchema: newOrganizerSchema,
        handleCreateOrganizer,
        federationCode: federationCodeValue,
        refetchFederationCode: fetchFederationCode,
        FIELD_NAMES: NEW_ORGANIZER_FIELD_NAMES,
    };
};