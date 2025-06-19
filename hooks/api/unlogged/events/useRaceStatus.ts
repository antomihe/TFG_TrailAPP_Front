// hooks\api\unlogged\events\useRaceStatus.ts
import { useState, useEffect, useCallback } from 'react';
import { Manager, Socket } from 'socket.io-client';
import { useParams } from 'next/navigation';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import type { AthleteStatusResponseDto } from '@/types/api';

export type EnrollmentStatus = AthleteStatusResponseDto;

let socketInstanceRS: Socket | null = null;

export const useRaceStatus = () => {
    const params = useParams<{ eventId: string }>();
    const eventId = params ? params.eventId : undefined;

    const [enrollments, setEnrollments] = useState<EnrollmentStatus[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [socketError, setSocketError] = useState<string | null>(null);

    const [loadingInitialData, setLoadingInitialData] = useState<boolean>(true);
    const [initialDataError, setInitialDataError] = useState<string | null>(null);

    const fetchInitialEnrollments = useCallback(async () => {
        if (!eventId) {
            setInitialDataError("ID del evento no disponible para cargar datos iniciales.");
            setLoadingInitialData(false);
            return;
        }
        setLoadingInitialData(true);
        setInitialDataError(null);
        try {
            const response = await api().get<AthleteStatusResponseDto[]>(`events/raceStatus/${eventId}`);
            setEnrollments(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            const errorMessage = errorHandler(err);
            setInitialDataError(errorMessage);
            toast.error(`Error al cargar estados iniciales: ${errorMessage}`);
            setEnrollments([]);
        } finally {
            setLoadingInitialData(false);
        }
    }, [eventId]);

    useEffect(() => {
        if (eventId) {
            fetchInitialEnrollments();
        } else {
            setLoadingInitialData(false);
            setEnrollments([]);
            setIsConnected(false);
        }
    }, [fetchInitialEnrollments, eventId]);

    useEffect(() => {
        if (!eventId) {
            if (socketInstanceRS) {
                socketInstanceRS.disconnect();
                socketInstanceRS.removeAllListeners();
                socketInstanceRS = null;
            }
            setIsConnected(false);
            setSocketError("ID del evento no especificado para la conexión de socket.");
            return;
        }

        if (socketInstanceRS && socketInstanceRS.connected && (socketInstanceRS.io.opts.query as {eventId: string}).eventId === eventId) {
            setIsConnected(true);
        } else {
            if (socketInstanceRS) {
                socketInstanceRS.disconnect();
                socketInstanceRS.removeAllListeners();
            }

            if (!process.env.NEXT_PUBLIC_SOCKET_URL) {
                setSocketError('NEXT_PUBLIC_SOCKET_URL is not defined in the environment variables.');
                setIsConnected(false);
                return;
            }

            const manager = new Manager(process.env.NEXT_PUBLIC_SOCKET_URL , {
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                timeout: 20000,
                query: { eventId },
            });
            socketInstanceRS = manager.socket('/race-status');
        }

        const currentSocket = socketInstanceRS;

        const onConnect = () => { setIsConnected(true); setSocketError(null); };
        const onDisconnect = (reason: Socket.DisconnectReason) => {
            setIsConnected(false);
            const msg = reason === 'io server disconnect' ? 'Desconexión del servidor.' : `Desconectado: ${reason}`;
            setSocketError(msg);
        };
        const onConnectError = (err: Error) => {
            const msg = `Error de conexión: ${err.message}`;
            setSocketError(msg);
            toast.warning(msg, { id: `socket-connect-error-${eventId}` });
            setIsConnected(false);
        };
        const onSocketErrorEvent = (err: { message?: string } | string) => {
            const errorMsg = typeof err === 'string' ? err : err.message || 'Error desconocido del socket';
            const msg = `Error en socket: ${errorMsg}`;
            setSocketError(msg);
            toast.error(msg, { id: `socket-general-error-${eventId}` });
            setIsConnected(false);
        };

        const onRaceStatusUpdate = (payload: AthleteStatusResponseDto) => {
            setEnrollments((prevEnrollments) =>
                prevEnrollments.map((enrollment) =>
                    enrollment.dorsal === payload.dorsal 
                        ? { ...enrollment, ...payload }
                        : enrollment
                )
            );
        };

        currentSocket.on('connect', onConnect);
        currentSocket.on('disconnect', onDisconnect);
        currentSocket.on('connect_error', onConnectError);
        currentSocket.on('error', onSocketErrorEvent);
        currentSocket.on(`raceStatus-${eventId}`, onRaceStatusUpdate);

        if (!currentSocket.connected) {
            currentSocket.connect();
        }

        return () => {
            currentSocket.off('connect', onConnect);
            currentSocket.off('disconnect', onDisconnect);
            currentSocket.off('connect_error', onConnectError);
            currentSocket.off('error', onSocketErrorEvent);
            currentSocket.off(`raceStatus-${eventId}`, onRaceStatusUpdate);
            if (socketInstanceRS === currentSocket) {
                 currentSocket.disconnect();
                 socketInstanceRS = null;
            }
        };
    }, [eventId]);

    return {
        enrollments,
        isConnected,
        socketError,
        loadingInitialData,
        initialDataError,
        refetchInitialEnrollments: fetchInitialEnrollments,
    };
};