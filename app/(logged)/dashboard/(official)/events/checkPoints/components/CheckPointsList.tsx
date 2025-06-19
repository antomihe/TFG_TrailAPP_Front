// app\(logged)\dashboard\(official)\events\checkPoints\components\CheckPointsList.tsx
'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button as UiButton } from '@/components/ui/button';
import { H2 } from '@/components/ui/typography';
import { AlertTriangle, Info, ListChecks, ServerCrash } from 'lucide-react';

import { CheckPointCard } from './CheckPointCard';
import { useCheckPointsData, CheckPointItem } from '@/hooks/api/dashboard/official/useCheckPointsData';
import { CenteredMessage } from '@/components/ui/centered-message';

const CardSkeleton = () => (
  <div className="border shadow-lg rounded-lg p-4 space-y-3 dark:border-gray-700 bg-card">
    <div className="flex justify-between items-start">
      <Skeleton className="h-6 w-3/5 mb-2" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
    <div className="space-y-2.5">
      <div className="flex items-center">
        <Skeleton className="h-4 w-4 mr-2 rounded-full" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/2 ml-2" />
      </div>
      <div className="flex items-center">
        <Skeleton className="h-4 w-4 mr-2 rounded-full" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-2/5 ml-2" />
      </div>
      <div className="flex items-center">
        <Skeleton className="h-4 w-4 mr-2 rounded-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3 ml-2" />
      </div>
      <div className="flex items-start">
        <Skeleton className="h-4 w-4 mr-2 mt-0.5 rounded-full" />
        <div>
          <Skeleton className="h-4 w-1/4 mb-1.5" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  </div>
);

const ListSkeletonLoader = ({ itemCount = 2 }: { itemCount?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: itemCount }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </div>
);

export default function CheckPointsList() {
  const {
    event,
    checkPoints,
    materialDetails,
    loadingEventAndCheckPoints,
    loadingMaterialDetails,
    error,
    refetchData,
  } = useCheckPointsData();

  const isLoading = loadingEventAndCheckPoints;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <Skeleton className="h-10 w-3/4 md:w-1/2 mx-auto mb-2" />
          <Skeleton className="h-6 w-1/2 md:w-1/3 mx-auto" />
        </div>
        <ListSkeletonLoader itemCount={checkPoints.length || 3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        {event && <H2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-primary dark:text-primary-foreground">{event.name}</H2>}
        <CenteredMessage
          variant='destructive'
          icon={<ServerCrash size={48} />}
          title="Error al Cargar Datos"
          message={error || "Ocurrió un error inesperado. Por favor, intente de nuevo."}
          action={
            <UiButton onClick={refetchData} variant="default">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Reintentar
            </UiButton>
          }
        />
      </div>
    );
  }

  if (!event) {
    return (
      <CenteredMessage
        icon={<Info size={48} />}
        variant='default'
        title="Sin Evento Asignado"
        message="No hay evento asignado para hoy o no se pudo cargar la información del evento."
      />
    );
  }

  if (checkPoints.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <H2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-primary dark:text-primary-foreground">{event.name}</H2>
        <CenteredMessage
          icon={<ListChecks size={48} />}
          title="Sin Puntos de Control"
          message="No hay puntos de control asignados para este evento."
          variant='default'
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <H2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-primary dark:text-primary-foreground">
        Puntos de Control: {event.name}
      </H2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {checkPoints.map((checkPoint: CheckPointItem) => (
          <CheckPointCard
            key={checkPoint.id}
            checkPoint={checkPoint}
            materialDetails={materialDetails}
            isLoadingMaterial={loadingMaterialDetails && checkPoint.material.some((id: string) => !materialDetails[id])}
          />
        ))}
      </div>
    </div>
  );
}