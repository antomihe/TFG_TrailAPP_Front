// hooks\api\unlogged\events\usePublicEvents.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { getPageSize } from '@/utils/getPageSize';
import type { EventPaginatedResponseDto, EventResponseDto } from '@/types/api';

export type PublicEvent = EventResponseDto;

export const usePublicEvents = () => {
    const [events, setEvents] = useState<PublicEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalEvents, setTotalEvents] = useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = useState<number>(getPageSize());

    const fetchEvents = useCallback(async (pageToFetch: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api().get<EventPaginatedResponseDto>('/events', {
                timeout: 15000,
                params: {
                    pageSize: itemsPerPage,
                    page: pageToFetch,
                },
            });

            setEvents(Array.isArray(response.data.event) ? response.data.event : []);
            setTotalEvents(response.data.total || 0);
        } catch (err) {
            const errorMessage = errorHandler(err);
            console.error('Error fetching public events:', err);
            setError(errorMessage);
            setEvents([]);
            setTotalEvents(0);
        } finally {
            setLoading(false);
        }
    }, [itemsPerPage]);

    useEffect(() => {
        fetchEvents(currentPage);
    }, [currentPage, fetchEvents]);

    useEffect(() => {
        const handleResize = () => {
            const newSize = getPageSize();
            if (itemsPerPage !== newSize) {
                setItemsPerPage(newSize);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
        fetchEvents(1);
    }, [itemsPerPage, fetchEvents]);


    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const totalPages = itemsPerPage > 0 ? Math.ceil(totalEvents / itemsPerPage) : 0;

    return {
        events,
        loading,
        error,
        currentPage,
        totalPages,
        totalEvents,
        handlePageChange,
        itemsPerPage,
        refetchData: () => fetchEvents(currentPage),
    };
};