'use client'

import React, { useEffect, useState } from 'react';
import { useUserState } from '@/store/user/user.store';
import { Large, Skeleton } from '@/components/ui';
import api from '@/config/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckIcon, TrashIcon } from 'lucide-react';
import { dateFormatter } from '@/lib/utils';

interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    province: string;
    validated: boolean;
}

const SkeletonLoader = () => (
    <div className="p-4">
        <Skeleton height="h-20" width="w-full" className="my-4" />
    </div>
);

export default function EventsValidationList() {
    const user = useUserState().user;
    const [events, setEvents] = useState<Event[]>([]);
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const resFed = await api(user.access_token).get(`users/federation/id/${user.id}`);
                const federationCode = resFed.data.code;
                const res = await api(user.access_token).get(`events/unvalidated/${federationCode}`);
                for (let i = 0; i < res.data.length; i++) {
                    res.data[i].validated = false;
                }   
                setEvents(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user.id]);

    const handleValidate = async (eventId: string) => {
        setSending(true);
        try {
            await api(user.access_token).patch(`events/${eventId}/validate`);
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === eventId
                        ? { ...event, validated: true }
                        : event
                )
            );
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (eventId: string) => {
        setSending(true);
        try {
            await api(user.access_token).delete(`events/${eventId}`);
            setEvents((prevEvents) =>
                prevEvents.filter((event) => event.id !== eventId)
            );
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return <SkeletonLoader />;
    }

    if (events.length === 0) {
        return <Large className='text-center pt-5'>No hay eventos pendientes de validación</Large>;
    }

    return (
        <div className="w-full px-4">
            <div className="max-w-4xl mx-auto overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Ubicación</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell>{event.name}</TableCell>
                                <TableCell>{dateFormatter(new Date(event.date))}</TableCell>
                                <TableCell>{`${event.location} - ${event.province}`}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        {!event.validated ? (
                                            <>
                                                <Button 
                                                    onClick={() => handleValidate(event.id)} 
                                                    variant="outline" 
                                                    className="flex items-center" 
                                                    disabled={sending}
                                                >
                                                    <CheckIcon className="mr-2 h-4 w-4" /> Validar
                                                </Button>
                                                <Button 
                                                    onClick={() => handleDelete(event.id)} 
                                                    variant="destructive" 
                                                    className="flex items-center" 
                                                    disabled={sending}
                                                >
                                                    <TrashIcon className="mr-2 h-4 w-4" /> Borrar
                                                </Button>
                                            </>
                                        ) : (
                                            'Validado'
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
