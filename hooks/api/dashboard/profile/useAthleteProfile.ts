// hooks\api\dashboard\profile\useAthleteProfile.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { format, parse, isValid as isValidDate, parseISO, startOfDay } from 'date-fns';
import { FormikHelpers } from 'formik';
import { useAuth } from '@/hooks/auth/useAuth';
import type { UpdateAthleteDto } from '@/types/api';

interface AthleteProfileApiResponse {
    id: string;
    email: string;
    fullName: string;
    idNumber: string;
    dateOfBirth: string;
}

export interface AthleteProfileFormValues {
    email: string;
    fullName: string;
    idNumber: string;
    dateOfBirth: string;
}

export const ATHLETE_PROFILE_FIELD_NAMES: { [K in keyof AthleteProfileFormValues]: K } = {
    email: 'email',
    fullName: 'fullName',
    idNumber: 'idNumber',
    dateOfBirth: 'dateOfBirth',
};

const isValidIdNumber = (value: string | undefined): boolean => {
    if (!value) return false;
    value = value.toUpperCase();
    if (!/^((\d{8}[A-Z])|([XYZ]\d{7}[A-Z]))$/.test(value)) {
        return false;
    }
    const dniLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    let numberStr = value.slice(0, -1);
    if (value.startsWith('X')) numberStr = '0' + numberStr.substring(1);
    else if (value.startsWith('Y')) numberStr = '1' + numberStr.substring(1);
    else if (value.startsWith('Z')) numberStr = '2' + numberStr.substring(1);

    const number = parseInt(numberStr, 10);
    if (isNaN(number)) return false;
    return dniLetters[number % 23] === value.slice(-1);
};

const formatDateToDDMMYYYY = (dateStringISO: string | undefined): string => {
    if (!dateStringISO) return '';
    try {
        const dateObj = parseISO(dateStringISO);
        if (isValidDate(dateObj)) {
            return format(dateObj, 'dd/MM/yyyy');
        }
    } catch (e) {
        // console.error("Error al formatear la fecha ISO a dd/MM/yyyy:", e);
    }
    return dateStringISO || '';
};

const formatDateToYYYYMMDD = (dateStringDDMMYYYY: string | undefined): string | undefined => {
    if (!dateStringDDMMYYYY) return undefined;
    try {
        const parsedDate = parse(dateStringDDMMYYYY, 'dd/MM/yyyy', new Date());
        if (isValidDate(parsedDate)) {
            return format(parsedDate, 'yyyy-MM-dd');
        }
    } catch (e) {
        // console.error("Error al formatear la fecha dd/MM/yyyy a YYYY-MM-DD:", e);
    }
    return undefined;
};

export const athleteProfileSchema = Yup.object().shape({
    [ATHLETE_PROFILE_FIELD_NAMES.email]: Yup.string()
        .email('El email no es válido.')
        .required('El email es obligatorio.'),
    [ATHLETE_PROFILE_FIELD_NAMES.fullName]: Yup.string()
        .required('El nombre completo es obligatorio.')
        .min(3, 'El nombre debe tener al menos 3 caracteres.'),
    [ATHLETE_PROFILE_FIELD_NAMES.idNumber]: Yup.string()
        .required('El DNI/NIE es obligatorio.')
        .test('idNumber-validation', 'DNI o NIE no válido.', value => isValidIdNumber(value)),
    [ATHLETE_PROFILE_FIELD_NAMES.dateOfBirth]: Yup.string()
        .required('La fecha de nacimiento es obligatoria.')
        .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19\d\d|20\d\d)$/, 'Formato dd/mm/yyyy requerido.')
        .test('valid-date', 'La fecha no es válida.', value => {
            if (!value) return true;
            const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
            return isValidDate(parsedDate);
        })
        .test('dob-past', 'La fecha no puede ser posterior a hoy.', value => {
            if (!value) return true;
            const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
            return !isValidDate(parsedDate) || parsedDate <= startOfDay(new Date());
        })
        .test('dob-after-1900', 'Debe ser posterior al 01/01/1900.', value => {
            if (!value) return true;
            const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
            return !isValidDate(parsedDate) || parsedDate >= new Date(1900, 0, 1);
        }),
});

export const useAthleteProfile = () => {
    const { user, token, updateUserInContext } = useAuth();

    const [initialFormValues, setInitialFormValues] = useState<AthleteProfileFormValues>({
        [ATHLETE_PROFILE_FIELD_NAMES.email]: '',
        [ATHLETE_PROFILE_FIELD_NAMES.fullName]: '',
        [ATHLETE_PROFILE_FIELD_NAMES.idNumber]: '',
        [ATHLETE_PROFILE_FIELD_NAMES.dateOfBirth]: '',
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserProfile = useCallback(async () => {
        if (!token || !user?.id) {
            setError("Usuario no autenticado o ID no disponible.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await api(token).get<AthleteProfileApiResponse>(`users/athlete/${user.id}`);
            const userDataFromApi = response.data;

            setInitialFormValues({
                email: userDataFromApi.email || user.email || '',
                fullName: userDataFromApi.fullName || user.username || '',
                idNumber: userDataFromApi.idNumber || '',
                dateOfBirth: formatDateToDDMMYYYY(userDataFromApi.dateOfBirth),
            });
        } catch (err) {
            const errorMessage = errorHandler(err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [token, user?.id, user?.email, user?.username]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    const handleUpdateUserProfile = useCallback(async (
        values: AthleteProfileFormValues,
        formikActions: FormikHelpers<AthleteProfileFormValues>
    ): Promise<void> => {
        if (!token || !user?.id) {
            toast.error("No se puede actualizar: usuario no autenticado.");
            formikActions.setSubmitting(false);
            return;
        }

        const dateForApi = formatDateToYYYYMMDD(values.dateOfBirth);
        if (!dateForApi) {
            toast.error("Formato de fecha de nacimiento inválido para enviar.");
            formikActions.setFieldError(ATHLETE_PROFILE_FIELD_NAMES.dateOfBirth, "Formato de fecha inválido.");
            formikActions.setSubmitting(false);
            return;
        }

        const payload: UpdateAthleteDto = {
            email: values.email,
            fullName: values.fullName,
            idNumber: values.idNumber.toUpperCase(),
            dateOfBirth: dateForApi,
        };

        try {
            await api(token).patch(`/users/athlete/${user.id}`, payload);
            updateUserInContext({ username: values.fullName, email: values.email });
            const newFormValuesAfterSave = { ...values };
            setInitialFormValues(newFormValuesAfterSave);
            formikActions.resetForm({ values: newFormValuesAfterSave });
            toast.success('¡Éxito! Tus datos han sido actualizados.');
        } catch (err) {
            const errorMessage = errorHandler(err);
            toast.error(`Error al actualizar perfil: ${errorMessage}`);
        } finally {
            formikActions.setSubmitting(false);
        }
    }, [token, user?.id, updateUserInContext]);

    return {
        initialFormValues,
        loading,
        error,
        validationSchema: athleteProfileSchema,
        handleUpdateUserProfile,
        refetchProfile: fetchUserProfile,
        FIELD_NAMES: ATHLETE_PROFILE_FIELD_NAMES,
    };
};