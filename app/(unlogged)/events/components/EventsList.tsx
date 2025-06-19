// app\(unlogged)\events\components\EventsList.tsx
'use client';

import React from 'react';
import { usePublicEvents } from '@/hooks/api/unlogged/events/usePublicEvents';
import { EventBentoCard } from './EventBentoCard';
import { EventListSkeleton } from './EventListSkeleton';
import { BentoGrid } from '@/components/ui/bento-grid';
import { Alert, AlertDescription, AlertTitle, Button, SimplePagination } from '@/components/ui';
import { AlertTriangle, ServerCrash, CalendarX, Loader2 } from 'lucide-react';
import { CenteredMessage } from '@/components/ui/centered-message';


export const EventsList: React.FC = () => {
  const {
    events,
    loading,
    error,
    currentPage,
    totalPages,
    handlePageChange,
    itemsPerPage,
    refetchData,
  } = usePublicEvents();

  const isLoadingInitialData = loading && (!events || events.length === 0);
  const isLoadingMoreData = loading && events && events.length > 0;

  if (isLoadingInitialData) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-2">
        <EventListSkeleton itemCount={itemsPerPage || 3} />
      </div>
    );
  }

  if (error && (!events || events.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-2">
        <CenteredMessage
          icon={<ServerCrash size={48} />}
          title="Error al Cargar Eventos"
          variant="destructive"
          message={<>Ocurrió un problema al obtener los eventos. <br /> ({error})</>}
          action={
            <Button onClick={() => refetchData()} variant="destructive" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
              Reintentar
            </Button>
          }
        />
      </div>
    );
  }

  if (!loading && events.length === 0 && !error) {
    return (
      <div className="container mx-auto px-4 py-2">
        <CenteredMessage
          icon={<CalendarX size={48} />}
          title="Sin Eventos Próximos"
          message="No hay eventos disponibles en este momento. ¡Vuelve pronto!"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2">
      {error && events && events.length > 0 && (
        <Alert variant="destructive" className="mb-6 max-w-3xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error de Actualización</AlertTitle>
          <AlertDescription>
            No se pudieron cargar los datos más recientes ({error}). Mostrando información previa.
            <Button onClick={() => refetchData()} variant="link" className="p-0 h-auto text-destructive-foreground underline ml-2" disabled={loading}>
              {loading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className={`transition-opacity duration-300 ${isLoadingMoreData ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
        <BentoGrid className="mx-auto md:auto-rows-[22rem]">
          {events.map((event) => (
            <EventBentoCard key={event.id} event={event} />
          ))}
        </BentoGrid>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 pt-2 flex justify-center items-center relative">
          {isLoadingMoreData && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm z-10 rounded-md">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          <SimplePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
};