// hooks\api\dashboard\official\useFetchCheckPointEventsData.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { customDateSort } from '@/lib/utils';
import { useAuth } from '@/hooks/auth/useAuth';
import type { EventResponseDto } from '@/types/api';

export interface CheckPointEvent {
    id: string;
    name: string;
    date: string; 
    location: string;
    province: string;
    validated: boolean;
    distances: number[];
}

export const useFetchCheckPointEventsData = () => {
    const { user, token } = useAuth();
    const [events, setEvents] = useState<CheckPointEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = useCallback(async () => {
        if (!user?.id || !token) {
            setLoading(false);
            setError("Usuario no autenticado o ID de oficial no disponible.");
            setEvents([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await api(token).get<EventResponseDto[]>(`events/jury/referee-assignments/${user.id}/events`, {
                params: { dateRange: 'future' }
            });

            const eventsData: CheckPointEvent[] = Array.isArray(response.data)
                ? response.data.map((event: EventResponseDto) => ({
                    id: event.id,
                    name: event.name,
                    date: event.date,
                    location: event.location,
                    province: event.province,
                    validated: event.validated,
                    distances: event.distances.map(d => Number(d)).filter(n => !isNaN(n)),
                }))
                : [];

            const sortedEvents = [...eventsData].sort((a, b) => {
                return customDateSort(a.date, b.date);
            });

            setEvents(sortedEvents);
        } catch (err) {
            const errorMessage = errorHandler(err);
            setError(errorMessage || 'Error desconocido al cargar eventos');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [user?.id, token]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return {
        events,
        loading,
        error,
        refetchEvents: fetchEvents
    };
};