'use client';

import React, { useEffect, useState } from 'react';
import { useUserState } from '@/store/user/user.store';
import api from '@/config/api';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { TrashIcon, ChevronDown, NotebookPen } from 'lucide-react';
import { dateFormatter } from '@/lib/utils';
import { PaginationComponent } from '@/components/ui/pagination-component';
import { H4, Small } from '@/components/ui';
import { Formik, Form } from 'formik';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    province: string;
    distances: number[];
    enrolled: boolean;
    enrolledDistance?: number;
}

export default function EventsEnrollList() {
    function getPageSize() {
        if (window.innerWidth >= 1024) return 3; // Desktop
        if (window.innerWidth >= 768) return 4; // Tablet
        return 3; // Mobile
    }

    const [pageSize, setPageSize] = useState(getPageSize());

    useEffect(() => {
        const handleResize = () => setPageSize(getPageSize());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const user = useUserState().user;
    const [events, setEvents] = useState<Event[]>([]);
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const res = await api(user.access_token).get(`events/enroll/athlete`);
                setEvents(res.data);
                setFilteredEvents(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user.id]);

    const paginatedEvents = filteredEvents.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage - 1);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        const newFilteredEvents = events.filter(e => e.name.toLowerCase().includes(value));
        setFilteredEvents(newFilteredEvents);
        setCurrentPage(0);
    };

    if (loading) {
        return <div className="text-center pt-5">Cargando...</div>;
    }

    return (
        <div className="w-full items-center">
            <div className="flex items-center justify-between py-4 space-x-4 mx-2">
                <Input
                    placeholder="Filtrar por nombre de evento..."
                    className="md:max-w-sm w-full"
                    onChange={handleFilterChange}
                />
            </div>

            {filteredEvents.length === 0 ? (
                <div className="text-center pt-5">No hay eventos disponibles</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedEvents.map((event) => (
                        <div key={event.id} className="p-4 border rounded-lg shadow-sm bg-card">
                            <H4 className="text-lg text-primary font-bold mb-2">{event.name}</H4>
                            <p className="text-sm text-secondary">Fecha: {dateFormatter(event.date)}</p>
                            <p className="text-sm text-secondary">Localidad: {event.location}</p>
                            <p className="text-sm text-secondary">Provincia: {event.province}</p>

                            <Formik
                                initialValues={{ distance: event.enrolledDistance || '' }}
                                onSubmit={async (values, { setFieldError }) => {
                                    setSending(true);
                                    try {
                                        if (event.enrolled) {
                                            const data = {
                                                eventId: event.id,
                                                userId: user.id
                                            }

                                            const res = await api(user.access_token).delete('events/enroll/athlete', { data })

                                            values.distance = '';
                                            event.enrolled = false;
                                            event.enrolledDistance = undefined;
                                        } else {
                                            const data = {
                                                eventId: event.id,
                                                distance: values.distance,
                                                userId: user.id
                                            }
                                            const res = await api(user.access_token).post('events/enroll/athlete', data)

                                            event.enrolled = true;
                                            event.enrolledDistance = +values.distance;
                                        }

                                    } catch (err) {
                                        console.error(err);
                                        setFieldError('distance', 'Ha ocurrido un error');
                                    } finally {
                                        setSending(false);
                                    }
                                }}
                            >
                                {({ setFieldValue, values, errors }) => {
                                    const [open, setOpen] = useState(false);

                                    return (
                                        <Form className="mt-4 space-y-2">
                                            <Popover open={open} onOpenChange={setOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-between"
                                                        aria-expanded={open}
                                                        disabled={event.enrolled}
                                                    >
                                                        {values.distance ? `${values.distance} km` : "Selecciona una distancia"}
                                                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-40 p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Buscar distancia..." />
                                                        <CommandList>
                                                            <CommandEmpty>Sin coincidencias</CommandEmpty>
                                                            <CommandGroup>
                                                                {event.distances.map((distance, index) => (
                                                                    <CommandItem
                                                                        key={index}
                                                                        onSelect={() => {
                                                                            setFieldValue("distance", distance);
                                                                            setOpen(false);
                                                                        }}
                                                                    >
                                                                        {distance} km
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>

                                            <Button
                                                type="submit"
                                                variant={event.enrolled ? "destructive" : "default"}
                                                className="w-full"
                                                disabled={sending || (!event.enrolled && !values.distance)}
                                            >
                                                {event.enrolled ? (
                                                    <>
                                                        <TrashIcon className="mr-2 h-4 w-4" /> Eliminar
                                                    </>
                                                ) : (
                                                    <>
                                                        <NotebookPen className="mr-2 h-4 w-4" /> Inscribirse
                                                    </>
                                                )}
                                            </Button>

                                            {errors.distance && (
                                                <Small className="text-red-500 text-center">{errors.distance}</Small>
                                            )}
                                        </Form>
                                    )
                                }}
                            </Formik>
                        </div>
                    ))}

                </div>
            )}

            {filteredEvents.length > 0 && (
                <Small className="text-center mt-4 font-medium">
                    Mostrando {filteredEvents.length} eventos en total
                </Small>
            )}
            {filteredEvents.length > 0 && (
                <PaginationComponent
                    className="mt-4"
                    currentPage={currentPage + 1}
                    totalPages={Math.ceil(filteredEvents.length / pageSize)}
                    handlePageChange={handlePageChange}
                />
            )}
        </div>
    );
}
