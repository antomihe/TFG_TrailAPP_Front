// hooks\api\dashboard\organizer\useNewEventForm.ts
import { useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { format, isValid, startOfDay } from 'date-fns'; 
import { useAuth } from '@/hooks/auth/useAuth';
import type { CreateEventDto } from '@/types/api';

export interface NewEventFormValues {
    name: string;
    date: Date | null; 
    province: string;
    location: string;
    distances: number[]; 
}

export const NEW_EVENT_FIELD_NAMES: { [K in keyof NewEventFormValues]: K } = {
    name: 'name',
    date: 'date',
    province: 'province',
    location: 'location',
    distances: 'distances',
};


export const newEventSchema = Yup.object().shape({
    [NEW_EVENT_FIELD_NAMES.name]: Yup.string()
        .required('El nombre es obligatorio.')
        .min(3, 'El nombre debe tener al menos 3 caracteres.'),
    [NEW_EVENT_FIELD_NAMES.location]: Yup.string()
        .required('La localidad es obligatoria.'),
    [NEW_EVENT_FIELD_NAMES.province]: Yup.string()
        .required('La provincia es obligatoria.'),
    [NEW_EVENT_FIELD_NAMES.distances]: Yup.array()
        .of(Yup.number().min(0.1, 'La distancia debe ser positiva.'))
        .min(1, 'Al menos una distancia es obligatoria.')
        .required('Al menos una distancia es obligatoria.'),
    [NEW_EVENT_FIELD_NAMES.date]: Yup.date()
        .nullable()
        .required('La fecha es obligatoria.')
        .min(startOfDay(new Date()), 'La fecha no puede ser en el pasado.') 
        .typeError('Formato de fecha inválido.'),
});

export const useNewEventForm = () => {
    const { token, user } = useAuth();

    const initialValues: NewEventFormValues = {
        [NEW_EVENT_FIELD_NAMES.name]: '',
        [NEW_EVENT_FIELD_NAMES.date]: null,
        [NEW_EVENT_FIELD_NAMES.province]: '',
        [NEW_EVENT_FIELD_NAMES.location]: '',
        [NEW_EVENT_FIELD_NAMES.distances]: [],
    };

    const handleSubmitNewEvent = useCallback(async (
        values: NewEventFormValues,
        formikActions: FormikHelpers<NewEventFormValues>
    ) => {
        if (!token || !user?.id) {
            toast.error("Usuario no autenticado o información de usuario no disponible.");
            formikActions.setSubmitting(false);
            return;
        }

        let formattedDate;
        if (values.date && isValid(values.date)) {
            formattedDate = format(values.date, 'yyyy-MM-dd'); 
        } else {
            toast.error("Fecha inválida proporcionada.");
            formikActions.setFieldError(NEW_EVENT_FIELD_NAMES.date, "Fecha inválida.");
            formikActions.setSubmitting(false);
            return;
        }

        const payload: CreateEventDto = {
            name: values.name,
            date: formattedDate, 
            province: values.province,
            location: values.location,
            distances: values.distances, 
        };

        formikActions.setSubmitting(true);
        try {
            await api(token).post(`/events`, payload);
            toast.success('¡Éxito! Evento creado correctamente.');
            formikActions.resetForm();
        } catch (error) {
            const errorMessage = errorHandler(error);
            toast.error(errorMessage || 'Error desconocido al crear el evento.');
        } finally {
            formikActions.setSubmitting(false);
        }
    }, [token, user?.id]);

    return {
        initialValues,
        validationSchema: newEventSchema,
        handleSubmitNewEvent,
        FIELD_NAMES: NEW_EVENT_FIELD_NAMES,
    };
};