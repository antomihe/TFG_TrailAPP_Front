// hooks\api\dashboard\federation\useFetchManagerEventsData.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import { customDateSort } from '@/lib/utils';
import { useAuth } from '@/hooks/auth/useAuth';
import type { EventResponseDto, FederationResponseDto } from '@/types/api';

export interface ManagerEvent {
    id: string;
    name: string;
    date: string; 
    location: string;
    province: string;
    validated: boolean;
    distances: number[];
}

export const useFetchManagerEventsData = () => {
    const {user, token} = useAuth();
    const [events, setEvents] = useState<ManagerEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sending, setSending] = useState(false);

    const fetchEvents = useCallback(async () => {
        if (!user || !token || !user.id) {
            setLoading(false);
            setError("Usuario no autenticado o información faltante.");
            setEvents([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const resFed = await api(token).get<FederationResponseDto>(`users/federation/${user.id}`);
            const federationCode = resFed.data.code;

            if (!federationCode) {
                throw new Error("Código de federación no encontrado para el usuario.");
            }

            const res = await api(token).get<EventResponseDto[]>(`events/by-federation/${federationCode}`, {
                params: { status: 'all' },
            });

            const eventsData: ManagerEvent[] = Array.isArray(res.data)
                ? res.data.map((event: EventResponseDto) => ({
                    id: event.id,
                    name: event.name,
                    date: event.date,
                    location: event.location,
                    province: event.province,
                    validated: !!event.validated,
                    distances: event.distances.map(d => Number(d)).filter(n => !isNaN(n)),
                }))
                : [];

            const sortedEvents = [...eventsData].sort((a, b) => customDateSort(a.date, b.date));
            setEvents(sortedEvents);
        } catch (err) {
            const errorMessage = errorHandler(err);
            toast.error(`Error al cargar eventos: ${errorMessage}`);
            setError(errorMessage);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [user, token]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleDeleteEvent = useCallback(async (eventId: string) => {
        if (!user || !token) {
            toast.error("No autenticado para realizar esta acción.");
            return;
        }
        setSending(true);
        try {
            await api(token).delete(`events/${eventId}`);
            setEvents(prevEvents =>
                prevEvents.filter(event => event.id !== eventId)
            );
            toast.success('Evento eliminado correctamente');
        } catch (err) {
            const errorMessage = errorHandler(err);
            toast.error(`Error al eliminar evento: ${errorMessage}`);
        } finally {
            setSending(false);
        }
    }, [user, token]);

    return { events, loading, error, sending, handleDeleteEvent, refetchEvents: fetchEvents };
};