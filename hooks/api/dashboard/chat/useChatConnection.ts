// hooks\api\dashboard\chat\useChatConnection.ts

import { useState, useEffect, useCallback } from 'react';
import { Manager, Socket } from 'socket.io-client';
import { useParams } from 'next/navigation';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth/useAuth';
import type { EventNameResponseDto, MessageWithSenderResponseDto, UserRole } from '@/types/api';

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: UserRole;
    message: string;
    createdAt: Date;
}

let socketInstance: Socket | null = null;

export const useChatConnection = () => {
    const params = useParams<{ eventId: string }>();
    const eventId = params ? params.eventId : undefined;
    const { user, token } = useAuth();

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [eventName, setEventName] = useState<string>('');
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [socketError, setSocketError] = useState<string | null>(null);
    const [loadingInitialData, setLoadingInitialData] = useState<boolean>(true);
    const [initialDataError, setInitialDataError] = useState<string | null>(null);

    const fetchInitialChatData = useCallback(async () => {
        if (!token || !eventId) {
            setInitialDataError("Falta información de usuario o evento para cargar el chat.");
            setLoadingInitialData(false);
            return;
        }
        setLoadingInitialData(true);
        setInitialDataError(null);
        try {
            const [eventNameRes, messagesRes] = await Promise.all([
                api(token).get<EventNameResponseDto>(`/events/${eventId}/name`),
                api(token).get<MessageWithSenderResponseDto[]>(`/chat/event-messages/${eventId}`)
            ]);

            setEventName(eventNameRes.data.name || 'Chat del Evento');
            const rawMessages = Array.isArray(messagesRes.data) ? messagesRes.data : [];
            const processedMessages: ChatMessage[] = rawMessages
                .map((msg: MessageWithSenderResponseDto) => ({
                    id: msg.id,
                    senderId: msg.senderId,
                    senderName: msg.senderName,
                    senderRole: msg.senderRole as UserRole, 
                    message: msg.message,
                    createdAt: new Date(msg.createdAt),
                }))
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            setMessages(processedMessages);

        } catch (err) {
            const errorMessage = errorHandler(err);
            setInitialDataError(errorMessage);
            toast.error(`Error al cargar datos del chat: ${errorMessage}`);
        } finally {
            setLoadingInitialData(false);
        }
    }, [token, eventId]);

    useEffect(() => {
        if (eventId && token) {
            fetchInitialChatData();
        } else {
            setLoadingInitialData(false);
            if (!eventId) setInitialDataError("ID del evento no especificado.");
            if (!token) setInitialDataError("Usuario no autenticado.");
        }
    }, [fetchInitialChatData, eventId, token]);

    useEffect(() => {
        if (!token || !user?.id || !eventId) {
            if (socketInstance) {
                socketInstance.disconnect();
                socketInstance.removeAllListeners();
                socketInstance = null;
            }
            setIsConnected(false);
            setSocketError("Información requerida para el chat no disponible.");
            return;
        }

        if (socketInstance && socketInstance.connected && (socketInstance.io.opts.query as any)?.eventId === eventId) {
            setIsConnected(true);
        } else {
            if (socketInstance) {
                socketInstance.removeAllListeners();
                socketInstance.disconnect();
            }
            if (!process.env.NEXT_PUBLIC_SOCKET_URL) {
                setSocketError('NEXT_PUBLIC_SOCKET_URL is not defined in the environment variables.');
                setIsConnected(false);
                return;
            }
            const manager = new Manager(process.env.NEXT_PUBLIC_SOCKET_URL, {
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                timeout: 20000,
                query: { userToken: token, eventId: eventId, userId: user.id },
            });
            socketInstance = manager.socket('/chat');
        }

        const currentSocket = socketInstance;

        const onConnect = () => { setIsConnected(true); setSocketError(null); };
        const onDisconnect = (reason: Socket.DisconnectReason) => {
            setIsConnected(false);
            if (reason === 'io server disconnect') {
                setSocketError('Desconectado por el servidor.');
            } else if (reason !== 'io client disconnect') {
                setSocketError(`Desconectado: ${reason}`);
            }
        };
        const onConnectError = (err: Error) => {
            const msg = `Error de conexión al chat: ${err.message}`;
            setSocketError(msg);
            toast.error(msg, { id: `chat-connect-error-${eventId}` });
            setIsConnected(false);
        };
        const onErrorEvent = (err: { message?: string } | string ) => {
            const errorMsg = typeof err === 'string' ? err : err.message || 'Error desconocido del socket';
            const msg = `Error en socket: ${errorMsg}`;
            setSocketError(msg);
            toast.error(msg, { id: `chat-socket-error-${eventId}` });
        };

        const onNewMessage = (socketMessage: MessageWithSenderResponseDto) => {
            const newMessage: ChatMessage = {
                id: socketMessage.id,
                senderId: socketMessage.senderId,
                senderName: socketMessage.senderName,
                senderRole: socketMessage.senderRole as UserRole, 
                message: socketMessage.message,
                createdAt: new Date(socketMessage.createdAt),
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        currentSocket.on('connect', onConnect);
        currentSocket.on('disconnect', onDisconnect);
        currentSocket.on('connect_error', onConnectError);
        currentSocket.on('error', onErrorEvent);
        currentSocket.on('newMessage', onNewMessage);

        if (!currentSocket.connected) {
            currentSocket.connect();
        }

        return () => {
            currentSocket.off('connect', onConnect);
            currentSocket.off('disconnect', onDisconnect);
            currentSocket.off('connect_error', onConnectError);
            currentSocket.off('error', onErrorEvent);
            currentSocket.off('newMessage', onNewMessage);
        };
    }, [token, user?.id, eventId]);

    const sendMessage = useCallback((messageText: string) => {
        if (!socketInstance || !socketInstance.connected) {
            toast.error("No conectado al chat. No se puede enviar el mensaje.");
            return;
        }
        if (!messageText.trim() || !user?.id || !eventId) return;

        const messagePayload = {
            message: messageText,
            eventId: eventId,
            userId: user.id,
        };
        socketInstance.emit('sendMessage', messagePayload);
    }, [user?.id, eventId]);

    return {
        messages,
        eventName,
        isConnected,
        socketError,
        loadingInitialData,
        initialDataError,
        sendMessage,
        userId: user?.id || '',
        refetchInitialData: fetchInitialChatData,
    };
};