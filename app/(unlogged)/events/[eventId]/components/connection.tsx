'use client';

import { useUserState } from '@/store/user/user.store';
import { useEffect, useState } from 'react';
import { Manager, Socket } from 'socket.io-client';
import { useParams } from 'next/navigation';
import { AlertComponent } from '@/components/ui/alert-component';
import api from '@/config/api';
import { Skeleton, Input } from '@/components/ui';
import EnrollmentList from './EnrollmentsList';

let socket: Socket | null = null;

const SkeletonLoader = () => (
    <div className="p-4 h-[500px]">
        <Skeleton height="h-20" width="w-full" className="my-4" />
    </div>
);


const connectToServer = (eventId: string) => {
    if (socket?.connected) return;

    if (socket) {
        socket.removeAllListeners();
        socket.close();
    }

    if (!eventId) {
        console.error('EventId vacío. No se puede conectar.');
        return;
    }

    const manager = new Manager('http://localhost:3001', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        query: { eventId },
    });

    socket = manager.socket('/race-status');
};


export interface Enrollment {
    dorsal: number;
    athleteName: string;
    status: string
}

export default function Connection() {
    const { eventId } = useParams() as { eventId: string };
    const { user } = useUserState();
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState<string | null>(null);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        if (value === '') {
            setFilteredEnrollments(enrollments);
        } else {
            setFilteredEnrollments(
                enrollments.filter(
                    (enrollment) =>
                        enrollment.athleteName.toLowerCase().includes(value) ||
                        enrollment.dorsal.toString().includes(value)
                )
            );
        }
    };

    useEffect(() => {
        const fetchEnrollment = async () => {
            setLoading(true);
            try {
                const res = await api().get(`events/raceStatus/${eventId}`);
                setEnrollments(res.data);
            } catch (err) {
                const errorMessage = (error as any)?.response?.data?.message;
                setErrorLoading(errorMessage || 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollment();
    }, [user.id, eventId]);

    useEffect(() => {
        setFilteredEnrollments([...enrollments]);
    }, [enrollments])


    useEffect(() => {
        connectToServer(eventId);

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

        socket?.on('raceStatus', (payload) => {
            setEnrollments((prev) =>
                prev.map((enrollment) =>
                    enrollment.dorsal === payload.dorsal
                        ? { ...enrollment, ...payload }
                        : enrollment
                )
            );
        });
        

        return () => {
            socket?.off('connect');
            socket?.off('disconnect');
            socket?.off('connect_error');
            socket?.off('raceStatus');
            socket?.close();
            setIsConnected(false);
        };

    }, [eventId]);

    if (loading) {
        return <SkeletonLoader/>;
    }

    if (errorLoading) {
        return <AlertComponent message={errorLoading} className="w-full h-[500px]" />;
    }

    return (
        <div>


            {isConnected && (
                <div className="max-w-4xl px-4 mx-auto">

                    <div className="flex justify-between items-center mb-4">
                        <Input
                            type="text"
                            placeholder="Filtrar por nombre o dorsal "
                            className="p-2 bg-input border rounded w-2/5"
                            onChange={handleFilterChange}
                        />
                        <div>{isConnected ? 'Actualizado en directo 🔴' : 'Desconectado ❌'}</div>

                    </div>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <EnrollmentList
                        enrollments={filteredEnrollments}
                    />
                </div>

            )}
        </div>
    );
}
