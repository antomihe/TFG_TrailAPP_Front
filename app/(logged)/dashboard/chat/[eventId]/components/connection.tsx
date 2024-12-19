'use client';

import { useUserState } from '@/store/user/user.store';
import { useEffect, useState } from 'react';
import { Manager, Socket } from 'socket.io-client';
import { useParams } from 'next/navigation';
import { AlertComponent } from '@/components/ui/alert-component';
import api from '@/config/api';
import Chat from './chat';
import { H4 } from '@/components/ui';
import RolesEnum from '@/enums/Roles.enum';

let socket: Socket | null = null;

const connectToServer = (token: string, eventId: string) => {
    if (socket?.connected) return;

    if (socket) {
        socket.removeAllListeners();
        socket.close();
    }

    if (!token || !eventId) {
        console.error('Token o eventId vacío. No se puede conectar.');
        return;
    }

    const manager = new Manager('http://localhost:3001', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        query: { userToken: token, eventId },
    });

    socket = manager.socket('/chat');
};


export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: RolesEnum;
    message: string;
    createdAt: Date;
}

export default function Connection() {
    const { eventId } = useParams() as { eventId: string };
    const { user } = useUserState();
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [errorLoading, setErrorLoading] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [eventName, setEventName] = useState('');

    useEffect(() => {
        async function fetchEventName() {
            try {
                const response = await api(user.access_token).get(`/events/name/${eventId}`);
                setEventName(response.data.name);
            } catch (error) {
                const errorMessage = (error as any)?.response?.data?.message;
                setErrorLoading(errorMessage || 'Error desconocido');
            }
        }
        fetchEventName();
    }, [user.access_token, eventId]);


    useEffect(() => {
        async function fetchMessages() {
            setLoadingMessages(true);
            try {
                const response = await api(user.access_token).get(`/chat/messages/${eventId}`);
                const resMessages = response.data.map((msg: any) => ({
                    ...msg,
                    createdAt: new Date(msg.createdAt),
                }));
                setMessages(resMessages);
            } catch (error) {
                const errorMessage = (error as any)?.response?.data?.message;
                setErrorLoading(errorMessage || 'Error desconocido');
            } finally {
                setLoadingMessages(false);
            }
        }
        fetchMessages();
    }, [user.access_token, eventId]);

    useEffect(() => {
        if (user?.access_token) {
            connectToServer(user.access_token, eventId);

            socket?.on('connect', () => {
                setIsConnected(true);
                setError(null);
            });

            socket?.on('disconnect', (reason) => {
                setIsConnected(false);
                if (reason === 'io server disconnect') {
                    setError('Desconectado por el servidor.');
                }
            });

            socket?.on('connect_error', (err) => {
                setError(`Error de conexión: ${err.message}`);
                setIsConnected(false);
            });

            socket?.on('error', (err) => {
                setError(`Error de envío: ${err.message}`);
            });

            socket?.on('newMessage', (message: Message) => {
                setMessages((prevMessages) => [message, ...prevMessages]);
            });

            return () => {
                socket?.off('connect');
                socket?.off('disconnect');
                socket?.off('connect_error');
                socket?.off('newMessage');
                socket?.close();
                setIsConnected(false);
            };
        }
    }, [user?.access_token, eventId]);

    if (loadingMessages) {
        return <div>Cargando mensajes...</div>;
    }

    if (errorLoading) {
        return <AlertComponent message={errorLoading} className="w-full" />;
    }

    return (
        <div>
            <div className='flex justify-between mx-4'>
                <H4>{eventName}</H4>
                <div>Conexión: {isConnected ? '✅ Conectado' : '❌ Desconectado'}</div>
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {isConnected && (
                <Chat
                    userId={user.id}
                    messages={messages}
                    handleSend={({ message }: { message: string }) => {
                        if (!message) return;
                        const userMessage = {
                            message,
                            eventId,
                            userId: user.id,
                        };
                        socket?.emit('sendMessage', userMessage);
                    }}
                />
            )}
        </div>
    );
}
