
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { PaginationComponent } from '@/components/ui/pagination-component';
import { H3, H4, Small } from '@/components/ui';
import { Button } from '@/components/ui/button';
import EventCard from './EventCard';
import { useFutureAthleteEnrollableEvents } from '@/hooks/api/dashboard/athlete/useFutureAthleteEnrollableEvents';
import { Skeleton } from '@/components/ui/skeleton';
import { Frown } from 'lucide-react';

function getPageSizeBasedOnWindowWidth(): number {
    if (typeof window === 'undefined') return 3; 
    const width = window.innerWidth;
    if (width >= 1280) return 3; 
    if (width >= 768) return 2;  
    return 1;                    
}

export default function EventsEnrollPage() {
    const [pageSize, setPageSize] = useState(getPageSizeBasedOnWindowWidth());
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const { 
        events: allEvents, 
        updateEvent, 
        loading, 
        error,
        refetchEvents
    } = useFutureAthleteEnrollableEvents();

    useEffect(() => {
        const handleResize = () => {
            setPageSize(getPageSizeBasedOnWindowWidth());
        };
        handleResize(); 
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filteredEvents = useMemo(() => {
        if (!allEvents) return [];
        const lowerSearchTerm = searchTerm.toLowerCase();
        return allEvents.filter(event =>
            event.name.toLowerCase().includes(lowerSearchTerm) ||
            event.location.toLowerCase().includes(lowerSearchTerm) ||
            event.province.toLowerCase().includes(lowerSearchTerm)
        );
    }, [allEvents, searchTerm]);

    const paginatedEvents = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredEvents.slice(startIndex, startIndex + pageSize);
    }, [filteredEvents, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredEvents.length / pageSize);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); 
    };
    
    const renderSkeletons = () => (
        Array.from({ length: pageSize }).map((_, index) => (
            <div key={`skeleton-${index}`} className="p-4 border rounded-lg shadow-sm bg-card flex flex-col">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-1" />
                <Skeleton className="h-4 w-2/3 mb-1" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="mt-auto space-y-3 pt-3 border-t border-border/40">
                    <Skeleton className="h-10 w-full mb-2" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        ))
    );

    if (error && !loading) { 
        return (
            <div className="container mx-auto py-10 px-4 text-center flex flex-col items-center">
                <Frown className="w-16 h-16 text-destructive mb-4" />
                <H3 className="mb-2 text-xl font-semibold text-destructive">Error al cargar eventos</H3>
                <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
                <Button onClick={refetchEvents}>Intentar de nuevo</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8 text-center">
              <H3 className="text-3xl font-bold tracking-tight">Próximos Eventos</H3>
              <p className="text-muted-foreground">
                Explora y únete a los próximos eventos deportivos.
              </p>
            </div>


            <div className="mb-6">
                <Input
                    aria-label="Filtrar eventos"
                    placeholder="Buscar por nombre, localidad o provincia..."
                    className="w-full md:max-w-lg mx-auto" 
                    value={searchTerm}
                    onChange={handleFilterChange}
                />
            </div>

            {loading && paginatedEvents.length === 0 ? ( 
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {renderSkeletons()}
                 </div>
            ) : !loading && filteredEvents.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <Frown className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <H4 className="text-xl font-medium">No hay eventos disponibles</H4>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                        {searchTerm 
                            ? "No se encontraron eventos que coincidan con tu búsqueda. Intenta con otros términos." 
                            : "Parece que no hay eventos programados por el momento. ¡Vuelve más tarde!"}
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {paginatedEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                updateEvent={updateEvent}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <PaginationComponent
                            className="mt-10 flex justify-center"
                            currentPage={currentPage}
                            totalPages={totalPages}
                            handlePageChange={handlePageChange}
                        />
                    )}
                    {filteredEvents.length > 0 && (
                        <Small className="text-center block mt-6 text-muted-foreground">
                            Mostrando {paginatedEvents.length} de {filteredEvents.length} eventos.
                        </Small>
                    )}
                </>
            )}
        </div>
    );
}