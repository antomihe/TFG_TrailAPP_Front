// hooks\api\dashboard\official\useNewDisqualificationReport.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useAuth } from '@/hooks/auth/useAuth';
import type {
    AthleteResponseDto,
    TodayJuryEventResponseDto,
    CreateDisqualificationDto
} from '@/types/api';

export interface AthleteOption {
    id: string; 
    name: string;
    dorsal?: number;
    isDisqualified?: boolean;
}

export interface EventInfo {
    id: string; 
    name: string;
}

export interface DisqualificationFormValues {
    reason: string;
    description: string;
    athlete: string; 
}

export const DISQUALIFICATION_FIELD_NAMES: { [K in keyof DisqualificationFormValues]: K } = {
    reason: 'reason',
    description: 'description',
    athlete: 'athlete',
};

export const newDisqualificationSchema = Yup.object().shape({
    [DISQUALIFICATION_FIELD_NAMES.reason]: Yup.string()
        .required('La razón es obligatoria.')
        .max(50, 'Máximo 50 caracteres para la razón.'), 
    [DISQUALIFICATION_FIELD_NAMES.description]: Yup.string()
        .required('La descripción es obligatoria.'),
    [DISQUALIFICATION_FIELD_NAMES.athlete]: Yup.string()
        .required('Debe seleccionar un atleta.'),
});

export const useNewDisqualificationReport = () => {
    const { token } = useAuth();

    const [loadingInitialData, setLoadingInitialData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [event, setEvent] = useState<EventInfo | null>(null);
    const [athletes, setAthletes] = useState<AthleteOption[]>([]);

    const fetchInitialData = useCallback(async () => {
        if (!token) {
            setError("Usuario no autenticado.");
            setLoadingInitialData(false);
            setEvent(null);
            setAthletes([]);
            return;
        }
        setLoadingInitialData(true);
        setError(null);
        setEvent(null);
        setAthletes([]);
        try {
            const eventResponse = await api(token).get<TodayJuryEventResponseDto>('events/jury/my-assignments', {
                params: { date: 'today' }
            });

            if (!eventResponse.data || !eventResponse.data.id) {
                setError("No se encontró un evento activo para hoy o el Juez no está asignado.");
                setLoadingInitialData(false);
                return;
            }
            const currentEventData = eventResponse.data;
            const currentEvent: EventInfo = {
                id: currentEventData.id,
                name: currentEventData.name
            };
            setEvent(currentEvent);

            const athletesResponse = await api(token).get<AthleteResponseDto[]>(`events/disqualification/related-athletes`, {
                params: { eventId: currentEvent.id }
            });

            const apiAthletes = Array.isArray(athletesResponse.data) ? athletesResponse.data : [];
            setAthletes(apiAthletes.map(a => ({
                id: a.id,
                name: a.name,
                dorsal: a.dorsal,
                isDisqualified: a.isDisqualified,
            })));

        } catch (err) {
            const errorMessage = errorHandler(err);
            setError(errorMessage);
        } finally {
            setLoadingInitialData(false);
        }
    }, [token]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const handleSubmitDisqualificationReport = useCallback(async (
        values: DisqualificationFormValues,
        formikActions: FormikHelpers<DisqualificationFormValues>
    ): Promise<void> => {
        if (!token || !event?.id || !values.athlete) {
            toast.error("No se puede enviar: falta información del usuario, evento o atleta.");
            formikActions.setSubmitting(false);
            return;
        }

        formikActions.setSubmitting(true);
        try {
            const requestPayload: CreateDisqualificationDto = {
                athleteId: values.athlete,
                eventId: event.id,
                reason: values.reason,
                description: values.description,
            };
            await api(token).post(`/events/disqualification`, requestPayload);
            toast.success('¡Éxito! Parte de descalificación enviado.');
            formikActions.resetForm();
        } catch (err) {
            const errorMessage = errorHandler(err);
            toast.error(`Error al enviar el parte: ${errorMessage}`);
        } finally {
            formikActions.setSubmitting(false);
        }
    }, [token, event]);

    const initialFormValues: DisqualificationFormValues = {
        [DISQUALIFICATION_FIELD_NAMES.reason]: '',
        [DISQUALIFICATION_FIELD_NAMES.description]: '',
        [DISQUALIFICATION_FIELD_NAMES.athlete]: '',
    };

    return {
        loadingInitialData,
        error,
        event,
        athletes,
        validationSchema: newDisqualificationSchema,
        handleSubmitDisqualificationReport,
        refetchData: fetchInitialData,
        initialFormValues,
        FIELD_NAMES: DISQUALIFICATION_FIELD_NAMES,
    };
};