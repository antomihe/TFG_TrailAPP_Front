import { AlertComponent } from '@/components/ui/alert-component';
import api from '@/config/api';
import RolesEnum from '@/enums/Roles.enum';
import { useUserState } from '@/store/user/user.store';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { PaginationComponent } from '@/components/ui/pagination-component'; 

interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    province: string;
}

export function ChatList() {
    const getPageSize = () => {
        if (window.innerWidth >= 1024) return 3; // Desktop
        if (window.innerWidth >= 768) return 4; // Tablet
        return 3; // Mobile
    };

    const router = useRouter();
    const { user } = useUserState();
    const [validRole, setValidRole] = useState(true);
    const [errorLoading, setErrorLoading] = useState<string | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(getPageSize()); 
    
    useEffect(() => {
        const handleResize = () => setPageSize(getPageSize());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                let response;
                switch (user.role) {
                    case RolesEnum.ATHLETE:
                        response = await api(user.access_token).get(`/events/enroll/athlete/chat`);
                        setEvents(response.data || []);
                        break;
                    case RolesEnum.OFFICIAL:
                        response = await api(user.access_token).get(`/events/jury/today`);
                        router.push(`/dashboard/chat/${response.data.id}`);
                        break;
                    case RolesEnum.ORGANIZER:
                        response = await api(user.access_token).get(`/events/organizer/future/${user.id}`);
                        setEvents(response.data || []);
                        break;
                    default:
                        setValidRole(false);
                        return;
                }
            } catch (error) {
                const errorMessage = (error as any)?.response?.data?.message;
                setErrorLoading(errorMessage || 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user]);

    const paginatedEvents = events.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage - 1);
    };

    const handleCardClick = (eventId: string) => {
        router.push(`/dashboard/chat/${eventId}`);
    };

    if (!validRole) {
        return (
            <AlertComponent message="Acceso a chat no autorizado para este tipo de usuario" className="max-w-full" />
        );
    }

    if (errorLoading) {
        return <AlertComponent message={errorLoading} className="max-w-full" />;
    }

    if (loading) {
        return <div className="text-center pt-5">Cargando...</div>;
    }

    if (!events || events.length === 0) {
        return <AlertComponent message="No hay eventos disponibles" className="max-w-full" />;
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {paginatedEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleCardClick(event.id)}>
                        <CardHeader>
                            <CardTitle>{event.name}</CardTitle>
                            <CardDescription>{new Date(event.date).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Ubicación:</strong> {event.location}</p>
                            <p><strong>Provincia:</strong> {event.province}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {events.length > 0 && (
                <PaginationComponent
                    className="mt-4"
                    currentPage={currentPage + 1}
                    totalPages={Math.ceil(events.length / pageSize)}
                    handlePageChange={handlePageChange}
                />
            )}
        </div>
    );
}
