// hooks\api\dashboard\organizer\useFetchEventEnrollments.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import type { AthleteListItemDto } from '@/types/api';

export type Enrollment = AthleteListItemDto;

export const useFetchEventEnrollments = () => {
    const { user, token } = useAuth();
    const params = useParams<{ eventId: string }>();
    const eventId = params?.eventId;
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const fetchEnrollmentData = useCallback(async () => {
        if (!token || !eventId) {
            setIsLoading(false);
            setError(!token && eventId ? "Usuario no autenticado." : "ID del evento no encontrado.");
            setEnrollments([]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const res = await api(token).get<AthleteListItemDto[]>(`events/enroll/event-reports/${eventId}/athlete-list`);

            setEnrollments(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            const errorMessage = errorHandler(err);
            setError(errorMessage);
            setEnrollments([]);
        } finally {
            setIsLoading(false);
        }
    }, [token, eventId]);

    useEffect(() => {
        if (eventId && token) {
            fetchEnrollmentData();
        } else {
            setIsLoading(false);
            if (!eventId) setError("ID del evento no encontrado en la URL.");
            else if (!token) setError("Usuario no autenticado.");
        }
    }, [fetchEnrollmentData, eventId, token]);

    const downloadFile = useCallback(async (urlPath: string, defaultFilename: string) => {
        if (!token || !eventId) {
            toast.error("No se puede descargar: falta información del usuario o evento.");
            return;
        }
        setIsDownloading(true);
        try {
            const response = await api(token).get(urlPath, {
                responseType: 'blob', 
            });

            const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            const contentDisposition = response.headers['content-disposition'];
            let filename = defaultFilename;
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
                if (filenameMatch && filenameMatch.length === 2) {
                    filename = filenameMatch[1];
                }
            }
            link.download = filename;

            document.body.appendChild(link);
            link.click();
            if (link.parentNode) {
                 link.parentNode.removeChild(link);
            }
            URL.revokeObjectURL(url);
            toast.success("Descarga iniciada.");
        } catch (err) {
            const errorMessage = errorHandler(err);
            toast.error(`Error al descargar el archivo: ${errorMessage}`);
        } finally {
            setIsDownloading(false);
        }
    }, [token, eventId]);

    const downloadBibsPDF = useCallback(() => {
        if (!eventId) return;
        return downloadFile(`events/enroll/event-reports/${eventId}/bibs-pdf`, `dorsales_evento_${eventId}.pdf`);
    }, [downloadFile, eventId]);

    const downloadEnrollmentsPDF = useCallback(() => {
        if (!eventId) return;
        return downloadFile(`events/enroll/event-reports/${eventId}/athlete-list-pdf`, `inscripciones_evento_${eventId}.pdf`);
    }, [downloadFile, eventId]);

    return {
        enrollments,
        isLoading,
        error,
        isDownloading,
        downloadBibsPDF,
        downloadEnrollmentsPDF,
        refetchEnrollments: fetchEnrollmentData,
    };
};