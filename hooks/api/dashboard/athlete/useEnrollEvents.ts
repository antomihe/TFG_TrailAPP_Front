// hooks\api\dashboard\athlete\useEnrollEvents.ts
import api, { errorHandler } from '@/config/api';
import { useAuth } from '@/hooks/auth/useAuth';
import type { EnrollEventDto, UnEnrollEventDto } from '@/types/api';

export function useEnrollEvents() {
  const { user, token } = useAuth();
  const userId = user?.id;

  const enrollInEvent = async (eventId: string, distance: number): Promise<void> => {
    if (!userId) {
      throw new Error("User ID is not available.");
    }
    const payload: EnrollEventDto = {
      eventId,
      distance,
      userId,
    };
    try {
      await api(token ?? undefined).post('events/enroll/athlete', payload);
    } catch (err) {
      throw new Error(errorHandler(err));
    }
  };

  const removeEnrollment = async (eventId: string): Promise<void> => {
    if (!userId) {
      throw new Error("User ID is not available.");
    }
    const payload: UnEnrollEventDto = {
      eventId,
      userId,
    };
    try {
      await api(token ?? undefined).delete('events/enroll/athlete', {
        data: payload,
      });
    } catch (err) {
      throw new Error(errorHandler(err));
    }
  };

  return {
    enrollInEvent,
    removeEnrollment,
  };
}