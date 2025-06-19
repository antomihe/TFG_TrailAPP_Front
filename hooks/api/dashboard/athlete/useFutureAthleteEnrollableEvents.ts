// hooks\api\dashboard\athlete\useFutureAthleteEnrollableEvents.ts
import { useEffect, useState, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import type { EventWithEnrollmentDto } from '@/types/api';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth/useAuth';

export function useFutureAthleteEnrollableEvents() {
  const { token } = useAuth();
  const [events, setEvents] = useState<EventWithEnrollmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setEvents([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api(token).get<EventWithEnrollmentDto[]>('events/enroll/athlete', {
        params: { filter: 'future' },
      });
      setEvents(res.data);
    } catch (err) {
      const friendlyError = errorHandler(err);
      toast.error(`Error al cargar eventos: ${friendlyError}`);
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const updateEvent = useCallback((updatedEvent: EventWithEnrollmentDto) => {
    setEvents(prevEvents =>
      prevEvents.map(ev => (ev.id === updatedEvent.id ? updatedEvent : ev))
    );
  }, []);

  return { events, updateEvent, loading, error, refetchEvents: fetchEvents };
}