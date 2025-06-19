// hooks\api\dashboard\official\useFetchDisqualificationsData.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { useAuth } from '@/hooks/auth/useAuth';
import type { DisqualificationResponseDto, TodayJuryEventResponseDto } from '@/types/api';

export interface DisqualificationData {
    id: string;
    athlete: {
        name: string;
    };
    official: {
        name: string;
    };
    reason: string;
    createdAt: string; 
    reviewedByReferee: boolean;
}

export const useFetchDisqualificationsData = () => {
    const {token} = useAuth();
    const [disqualifications, setDisqualifications] = useState<DisqualificationData[]>([]);
    const [isReferee, setIsReferee] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [eventId, setEventId] = useState<string | null>(null);

    const fetchDisqualificationData = useCallback(async () => {
        if (!token) {
            setLoading(false);
            setError("Usuario no autenticado.");
            setDisqualifications([]);
            setIsReferee(false);
            setEventId(null);
            return;
        }
        setLoading(true);
        setError(null);
        setEventId(null);
        try {
            const resEvent = await api(token).get<TodayJuryEventResponseDto>(`events/jury/my-assignments`, {
                params: { date: 'today' }
            });

            const eventData = resEvent.data;

            if (!eventData || !eventData.id) {
                setError("No hay evento asignado para hoy o el Juez no está activo en un evento.");
                setDisqualifications([]);
                setIsReferee(false);
                setLoading(false);
                return;
            }

            const currentEventId = eventData.id;
            const currentIsReferee = eventData.isReferee;

            setEventId(currentEventId);
            setIsReferee(currentIsReferee);

            const resDisqualifications = await api(token).get<DisqualificationResponseDto[]>(`events/disqualification/by-event`, {
                params: { eventId: currentEventId }
            });

            const disqualificationApiData = Array.isArray(resDisqualifications.data)
                ? resDisqualifications.data
                : [];

            const formattedDisqualifications: DisqualificationData[] = disqualificationApiData.map(d => ({
                id: d.id,
                athlete: {
                    name: d.athlete?.name || 'Atleta Desconocido',
                },
                official: {
                    name: d.official?.name || 'Oficial Desconocido',
                },
                reason: d.reason,
                createdAt: d.createdAt,
                reviewedByReferee: d.reviewedByReferee,
            }));

            const sortedData = [...formattedDisqualifications].sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });

            setDisqualifications(sortedData);

        } catch (err) {
            const errorMessage = errorHandler(err);
            setError(errorMessage);
            setDisqualifications([]);
            setIsReferee(false);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchDisqualificationData();
    }, [fetchDisqualificationData]);

    return {
        disqualifications,
        isReferee,
        loading,
        error,
        eventId,
        refetchDisqualifications: fetchDisqualificationData
    };
};