// hooks\api\dashboard\nationalFederation\useFetchNationalJuryEventsData.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import { customDateSort } from '@/lib/utils';
import { useAuth } from '@/hooks/auth/useAuth';
import type { EventFederationResponseDto } from '@/types/api';

export interface NationalJuryEvent {
    id: string;
    name: string;
    date: string; 
    location: string;
    province: string;
    validated: boolean;
    federation: string;
}

export const useFetchNationalJuryEventsData = () => {
    const { user, token } = useAuth();
    const [events, setEvents] = useState<NationalJuryEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEvents = useCallback(async () => {
        if (!user || !token) {
            setLoading(false);
            setError("Usuario no autenticado.");
            setEvents([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await api(token).get<EventFederationResponseDto[]>(`events/for-national-federation`, {
                params: { status: 'validated' }
            });

            const eventsData: NationalJuryEvent[] = Array.isArray(res.data)
                ? res.data.map((event: EventFederationResponseDto) => ({
                    id: event.id,
                    name: event.name,
                    date: event.date,
                    location: event.location,
                    province: event.province,
                    validated: event.validated,
                    federation: event.federationName
                }))
                : [];

            const sortedEvents = [...eventsData].sort((a, b) => {
                return customDateSort(a.date, b.date);
            });
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

    return { events, loading, error, refetchEvents: fetchEvents };
};