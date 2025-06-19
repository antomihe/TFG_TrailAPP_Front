// hooks\api\dashboard\chat\useChatList.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import api, { errorHandler } from '@/config/api';
import RolesEnum from '@/enums/Roles.enum';
import { useAuth } from '@/hooks/auth/useAuth';
import type {
    EventWithEnrollmentDto,
    EventResponseDto,
    TodayJuryEventResponseDto
} from '@/types/api';

export interface EventForChatList {
    id: string;
    name: string;
    date: string;
    location: string;
    province: string;
}

const calculatePageSize = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth >= 1024) return 6;
    if (window.innerWidth >= 768) return 4;
    return 3;
};

export const useChatList = () => {
    const { user, token } = useAuth();

    const [events, setEvents] = useState<EventForChatList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isValidRoleForList, setIsValidRoleForList] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(calculatePageSize());

    useEffect(() => {
        const handleResize = () => setPageSize(calculatePageSize());
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchEventsForChat = useCallback(async () => {
        if (!token || !user?.role) {
            setError("Usuario no autenticado o rol no definido.");
            setLoading(false);
            setIsValidRoleForList(false);
            setEvents([]);
            return;
        }

        setLoading(true);
        setError(null);
        setIsValidRoleForList(true);

        try {
            let responseData: any[] = [];
            switch (user.role) {
                case RolesEnum.ATHLETE:
                    const athleteRes = await api(token).get<EventWithEnrollmentDto[]>('/events/enroll/athlete', {
                        params: { filter: 'chat' },
                    });
                    responseData = athleteRes.data;
                    break;
                case RolesEnum.ORGANIZER:
                    if (!user.id) {
                        throw new Error("ID del organizador no disponible.");
                    }
                    const organizerRes = await api(token).get<EventResponseDto[]>(`/events/by-organizer/${user.id}`, {
                        params: { dateRange: 'future' },
                    });
                    responseData = organizerRes.data;
                    break;
                case RolesEnum.OFFICIAL:
                    const officialRes = await api(token).get<TodayJuryEventResponseDto>('/events/jury/my-assignments', {
                        params: { date: 'today' },
                    });
                    if (officialRes.data && officialRes.data.id) {
                        responseData = [officialRes.data];
                    } else {
                        responseData = [];
                    }
                    break;
                default:
                    setIsValidRoleForList(false);
                    setError("Acceso a chat no autorizado para este tipo de usuario.");
                    break;
            }
            if (Array.isArray(responseData)) {
                 setEvents(responseData.map(event => ({
                    id: event.id,
                    name: event.name,
                    date: event.date,
                    location: event.location,
                    province: event.province,
                })));
            } else {
                setEvents([]);
            }

        } catch (err) {
            const errorMessage = errorHandler(err);
            setError(errorMessage);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }, [token, user?.id, user?.role]);

    useEffect(() => {
        fetchEventsForChat();
    }, [fetchEventsForChat]);

    const [redirectToEventId, setRedirectToEventId] = useState<string | null>(null);
    useEffect(() => {
        const handleOfficialRedirect = async () => {
            if (user?.role === RolesEnum.OFFICIAL && token && !loading) {
                try {
                    const response = await api(token).get<TodayJuryEventResponseDto>('/events/jury/my-assignments', {
                         params: { date: 'today' },
                    });
                    if (response.data && response.data.id) {
                        setRedirectToEventId(response.data.id);
                    } else if (!error) {
                        setError("No hay evento de jurado asignado para hoy para el chat.");
                    }
                } catch (err) {
                     if (!error) {
                        setError(errorHandler(err));
                     }
                }
            }
        };

        if (user?.role === RolesEnum.OFFICIAL && !loading) {
            handleOfficialRedirect();
        } else if (user?.role !== RolesEnum.OFFICIAL) {
            setRedirectToEventId(null);
        }
    }, [user?.role, token, loading, error]);

    const handlePageChange = (newPageIndex: number) => {
        setCurrentPage(newPageIndex);
    };

    const paginatedEvents = useMemo(() => {
        return events.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
    }, [events, currentPage, pageSize]);

    const totalPages = useMemo(() => {
        return Math.ceil(events.length / pageSize);
    }, [events.length, pageSize]);

    return {
        events: paginatedEvents,
        allEventsCount: events.length,
        loading,
        error,
        isValidRoleForList,
        redirectToEventId,
        currentPage,
        pageSize,
        totalPages,
        handlePageChange,
        refetchEvents: fetchEventsForChat,
    };
};