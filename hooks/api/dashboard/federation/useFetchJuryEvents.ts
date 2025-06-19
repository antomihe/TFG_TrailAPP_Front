// hooks\api\dashboard\federation\useFetchJuryEvents.ts
import { useEffect, useState, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { customDateSort } from '@/lib/utils';
import { useAuth } from '@/hooks/auth/useAuth';
import type { EventResponseDto, FederationResponseDto } from '@/types/api';

export interface JuryEvent {
    id: string;
    name: string;
    date: string; 
    location: string;
    province: string;
    validated: boolean;
    distances: number[];
}

export const useFetchJuryEvents = () => {
    const { user, token } = useAuth();
    const [events, setEvents] = useState<JuryEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = useCallback(async () => {
        if (!user || !user.id || !token) {
            setLoading(false);
            setEvents([]);
            setError("Usuario no autenticado o ID de usuario no disponible.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const resFed = await api(token).get<FederationResponseDto>(`users/federation/${user.id}`);
            const federationCode = resFed.data.code;

            if (!federationCode) {
                setError("No se pudo obtener el código de la federación del usuario actual.");
                setLoading(false);
                return;
            }

            const res = await api(token).get<EventResponseDto[]>(`events/by-federation/${federationCode}`, {
                params: { status: 'validated' },
            });

            const eventsData: JuryEvent[] = Array.isArray(res.data)
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

            const sortedEvents = [...eventsData].sort((a: JuryEvent, b: JuryEvent) => {
                return customDateSort(a.date, b.date);
            });

            setEvents(sortedEvents);
        } catch (err) {
            const errorMessage = errorHandler(err);
            setError(errorMessage);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [user, token]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return { events, loading, error, refetch: fetchEvents };
};