// hooks\api\unlogged\auth\useAthleteRegistration.ts
import { useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { format, parse, isValid as isValidDate, startOfDay } from 'date-fns';
import { FormikHelpers } from 'formik';
import type { CreateAthleteDto } from '@/types/api';

export interface AthleteRegistrationFormValues {
    email: string;
    fullName: string;
    idNumber: string;
    dateOfBirth: string; // Expected format: dd/MM/yyyy
}

export const ATHLETE_FIELD_NAMES: { [K in keyof AthleteRegistrationFormValues]: K } = {
    email: 'email',
    fullName: 'fullName',
    idNumber: 'idNumber',
    dateOfBirth: 'dateOfBirth',
};

const isValidDniNie = (value: string | undefined): boolean => {
    if (!value) return false;
    const upperValue = value.toUpperCase();
    if (!/^((\d{8}[A-Z])|([XYZ]\d{7}[A-Z]))$/.test(upperValue)) {
        return false;
    }
    const dniLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    let numberStr = upperValue.slice(0, -1);
    if (upperValue.startsWith('X')) numberStr = '0' + numberStr.substring(1);
    else if (upperValue.startsWith('Y')) numberStr = '1' + numberStr.substring(1);
    else if (upperValue.startsWith('Z')) numberStr = '2' + numberStr.substring(1);
    const number = parseInt(numberStr, 10);
    if (isNaN(number)) return false;
    return dniLetters[number % 23] === upperValue.slice(-1);
};

const formatDateToYYYYMMDD = (dateStringDDMMYYYY: string | undefined): string | undefined => {
    if (!dateStringDDMMYYYY) return undefined;
    try {
        const parsedDate = parse(dateStringDDMMYYYY, 'dd/MM/yyyy', new Date());
        if (isValidDate(parsedDate)) {
            return format(parsedDate, 'yyyy-MM-dd');
        }
    } catch (e) {
        // Error handling or logging can be done here if needed
    }
    return undefined;
};

export const athleteRegistrationSchema = Yup.object().shape({
    [ATHLETE_FIELD_NAMES.email]: Yup.string()
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'El email no es válido.'
        )
        .email('El email no es válido.')
        .required('El email es obligatorio.'),
    [ATHLETE_FIELD_NAMES.fullName]: Yup.string()
        .required('El nombre completo es obligatorio.')
        .min(3, 'El nombre debe tener al menos 3 caracteres.')
        .matches(
            /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s-]+$/,
            'El nombre solo puede contener letras, espacios y guiones.'
        ),
    [ATHLETE_FIELD_NAMES.idNumber]: Yup.string()
        .required('El DNI/NIE es obligatorio.')
        .test('idNumber-validation', 'DNI o NIE no válido.', value => isValidDniNie(value)),
    [ATHLETE_FIELD_NAMES.dateOfBirth]: Yup.string()
        .required('La fecha de nacimiento es obligatoria.')
        .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19\d\d|20\d\d)$/, 'Formato dd/mm/yyyy requerido.')
        .test('valid-date', 'La fecha no es válida.', value => {
            if (!value) return true;
            const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
            return isValidDate(parsedDate);
        })
        .test('dob-past', 'La fecha no puede ser en el futuro.', value => {
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

export const useAthleteRegistration = () => {
    const handleRegisterAthlete = useCallback(async (
        values: AthleteRegistrationFormValues,
        formikActions: FormikHelpers<AthleteRegistrationFormValues>
    ): Promise<void> => {
        const dateForApi = formatDateToYYYYMMDD(values.dateOfBirth);
        if (!dateForApi) {
            toast.error("Error interno: Formato de fecha de nacimiento inválido para enviar.");
            formikActions.setFieldError(ATHLETE_FIELD_NAMES.dateOfBirth, "Fecha inválida.");
            formikActions.setSubmitting(false);
            return;
        }

        const payload: CreateAthleteDto = {
            email: values.email,
            fullName: values.fullName,
            idNumber: values.idNumber.toUpperCase(),
            dateOfBirth: dateForApi,
        };

        formikActions.setSubmitting(true);
        try {
            await api().post('/users/athlete', payload);
            toast.success('¡Éxito! Revisa tu correo electrónico para confirmar tu cuenta.');
            formikActions.resetForm();
        } catch (error: any) {
            const errorMessage = errorHandler(error);
            toast.error(errorMessage || 'Error al registrar el atleta. Inténtalo de nuevo.');
        } finally {
            formikActions.setSubmitting(false);
        }
    }, []);

    const initialFormValues: AthleteRegistrationFormValues = {
        [ATHLETE_FIELD_NAMES.email]: '',
        [ATHLETE_FIELD_NAMES.fullName]: '',
        [ATHLETE_FIELD_NAMES.idNumber]: '',
        [ATHLETE_FIELD_NAMES.dateOfBirth]: '',
    };

    return {
        initialFormValues,
        validationSchema: athleteRegistrationSchema,
        handleRegisterAthlete,
        ATHLETE_FIELD_NAMES,
    };
};