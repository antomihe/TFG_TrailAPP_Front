// hooks\api\dashboard\federation\useEventsValidation.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth/useAuth';
import { parseISO } from 'date-fns';
import type { EventResponseDto, FederationResponseDto } from '@/types/api';

export interface ValidationEvent {
    id: string;
    name: string;
    date: Date;
    location: string;
    province: string;
    distances: number[];
    validated: boolean;
}

export const useEventsValidation = () => {
    const { user, token } = useAuth();
    const [events, setEvents] = useState<ValidationEvent[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [submittingActionOnEventId, setSubmittingActionOnEventId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchUnvalidatedEvents = useCallback(async () => {
        if (!token || !user?.id) {
            setError("Usuario no autenticado o ID de usuario no disponible para obtener federación.");
            setIsLoading(false);
            setEvents([]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const resFed = await api(token).get<FederationResponseDto>(`users/federation/${user.id}`);
            const federationCode = resFed.data.code;

            if (!federationCode) {
                throw new Error("No se pudo obtener el código de la federación del usuario actual.");
            }

            const res = await api(token).get<EventResponseDto[]>(`events/by-federation/${federationCode}`, {
                params: { status: 'unvalidated' },
            });

            const eventsData: ValidationEvent[] = Array.isArray(res.data)
                ? res.data.map((event: EventResponseDto) => ({
                    id: event.id,
                    name: event.name,
                    date: event.date ? parseISO(event.date) : new Date(),
                    location: event.location,
                    province: event.province,
                    distances: event.distances.map(d => Number(d)).filter(n => !isNaN(n)),
                    validated: !!event.validated,
                }))
                : [];
            setEvents(eventsData);
        } catch (err) {
            const errorMessage = errorHandler(err);
            setError(errorMessage);
            setEvents([]);
        } finally {
            setIsLoading(false);
        }
    }, [token, user?.id]);

    useEffect(() => {
        fetchUnvalidatedEvents();
    }, [fetchUnvalidatedEvents]);

    const validateEvent = useCallback(async (eventId: string): Promise<boolean> => {
        if (!token) {
            toast.error("Acción no permitida: usuario no autenticado.");
            return false;
        }
        setSubmittingActionOnEventId(eventId);
        let success = false;
        const eventToValidate = events.find(e => e.id === eventId);
        try {
            await api(token).patch(`events/${eventId}/status`, undefined, {
                params: { status: 'VALIDATED' },
            });
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === eventId ? { ...event, validated: true } : event
                ).filter(event => event.id !== eventId) 
            );
            toast.success(`Evento "${eventToValidate?.name || eventId}" validado correctamente.`);
            success = true;
        } catch (err) {
            const errorMessage = errorHandler(err);
            toast.error(`Error al validar evento: ${errorMessage}`);
            success = false;
        } finally {
            setSubmittingActionOnEventId(null);
        }
        return success;
    }, [token, events]);

    const deleteEvent = useCallback(async (eventId: string): Promise<boolean> => {
        if (!token) {
            toast.error("Acción no permitida: usuario no autenticado.");
            return false;
        }
        setSubmittingActionOnEventId(eventId);
        let success = false;
        const eventToDelete = events.find(e => e.id === eventId);
        try {
            await api(token).delete(`events/${eventId}`);
            setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
            toast.success(`Evento "${eventToDelete?.name || eventId}" eliminado correctamente.`);
            success = true;
        } catch (err) {
            const errorMessage = errorHandler(err);
            toast.error(`Error al eliminar evento: ${errorMessage}`);
            success = false;
        } finally {
            setSubmittingActionOnEventId(null);
        }
        return success;
    }, [token, events]);

    return {
        events,
        isLoading,
        submittingActionOnEventId,
        error,
        validateEvent,
        deleteEvent,
        refetchEvents: fetchUnvalidatedEvents,
    };
};