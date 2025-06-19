// hooks\api\dashboard\federation\useEditEventForm.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { format, parseISO } from 'date-fns';
import { useAuth } from '@/hooks/auth/useAuth';
import type { EventOrganizerResponseDto, UpdateEventDto } from '@/types/api';

export interface OrganizerInfo {
    name: string;
    email: string;
}

export interface ProcessedEventData {
    id: string;
    name: string;
    date: string; 
    originalDate: string; 
    province: string;
    location: string;
    distances: number[]; 
    organizer: OrganizerInfo;
    validated: boolean;
}

export interface EditableEventFormValues {
    name: string;
    date: string; 
}

export const EDIT_EVENT_FIELD_NAMES: { [K in keyof EditableEventFormValues]: K } = {
    name: 'name',
    date: 'date',
};

export const editEventSchema = Yup.object().shape({
    [EDIT_EVENT_FIELD_NAMES.name]: Yup.string()
        .required('El nombre es obligatorio.')
        .min(3, 'El nombre debe tener al menos 3 caracteres.'),
    [EDIT_EVENT_FIELD_NAMES.date]: Yup.string()
        .required('La fecha es obligatoria.')
});

export const useEditEventForm = () => {
    const { token } = useAuth();
    const params = useParams();
    const eventId = params.eventId as string | undefined;

    const [eventData, setEventData] = useState<ProcessedEventData | null>(null);
    const [initialFormValues, setInitialFormValues] = useState<EditableEventFormValues>({
        [EDIT_EVENT_FIELD_NAMES.name]: '',
        [EDIT_EVENT_FIELD_NAMES.date]: '',
    });

    const [loadingData, setLoadingData] = useState<boolean>(true);
    const [errorLoading, setErrorLoading] = useState<string | null>(null);

    const fetchEventData = useCallback(async () => {
        if (!token) {
            setErrorLoading("No autenticado.");
            setLoadingData(false);
            return;
        }
        if (!eventId) {
            setErrorLoading("ID del evento no encontrado en la URL.");
            setLoadingData(false);
            return;
        }

        setLoadingData(true);
        setErrorLoading(null);
        try {
            const response = await api(token).get<EventOrganizerResponseDto>(`events/${eventId}/organizer-details`);
            const loadedApiEvent = response.data;

            const processedData: ProcessedEventData = {
                id: loadedApiEvent.id,
                name: loadedApiEvent.name,
                date: loadedApiEvent.date ? format(parseISO(loadedApiEvent.date), 'yyyy-MM-dd') : '',
                originalDate: loadedApiEvent.date,
                province: loadedApiEvent.province,
                location: loadedApiEvent.location,
                distances: loadedApiEvent.distances.map(d => Number(d)).filter(n => !isNaN(n)),
                organizer: loadedApiEvent.organizer as OrganizerInfo, 
                validated: loadedApiEvent.validated,
            };
            setEventData(processedData);

            setInitialFormValues({
                name: processedData.name || '',
                date: processedData.date,
            });
        } catch (err) {
            const errorMessage = errorHandler(err);
            setErrorLoading(errorMessage);
            toast.error(`Error al cargar datos del evento: ${errorMessage}`);
        } finally {
            setLoadingData(false);
        }
    }, [token, eventId]);

    useEffect(() => {
        if (eventId && token) {
            fetchEventData();
        } else if (!token) {
             setLoadingData(false);
             setErrorLoading("Usuario no autenticado.");
        } else if (!eventId) {
            setLoadingData(false);
            setErrorLoading("ID de evento no especificado.");
        }
    }, [fetchEventData, eventId, token]);

    const handleUpdateEvent = useCallback(async (
        values: EditableEventFormValues,
        formikActions: FormikHelpers<EditableEventFormValues>
    ): Promise<void> => {
        if (!token || !eventId) {
            toast.error("No se puede actualizar: falta información de autenticación o ID del evento.");
            formikActions.setSubmitting(false);
            return;
        }

        const payload: UpdateEventDto = {
            name: values.name,
            date: values.date, 
        };

        try {
            await api(token).patch(`/events/${eventId}`, payload);
            toast.success('Los datos del evento han sido actualizados correctamente.');
            await fetchEventData();
        } catch (err) {
            const errorMessage = errorHandler(err);
            toast.error(`Error al actualizar el evento: ${errorMessage}`);
        } finally {
            formikActions.setSubmitting(false);
        }
    }, [token, eventId, fetchEventData]);

    return {
        eventData,
        initialFormValues,
        loadingData,
        errorLoading,
        validationSchema: editEventSchema,
        handleUpdateEvent,
        refetchEventData: fetchEventData,
        FIELD_NAMES: EDIT_EVENT_FIELD_NAMES,
    };
};