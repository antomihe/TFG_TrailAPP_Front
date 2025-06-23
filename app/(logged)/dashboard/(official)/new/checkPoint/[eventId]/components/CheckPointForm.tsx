
'use client';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button as UiButton } from '@/components/ui/button';
import { H2, H3 } from '@/components/ui/typography';
import { AlertTriangle, ListPlus, ServerCrash, ClipboardList, Loader2 } from 'lucide-react';

import { CheckPointCard } from './CheckPointCard';
import { CheckPointInput } from './CheckPointInput';

import {
  useEventCheckPointsManager
} from '@/hooks/api/dashboard/official/useEventCheckPointsManager';
import { HoverEffectCard, CardContent, CardFooter, CardHeader } from '@/components/ui';


const InputFormSkeleton = () => (
  <HoverEffectCard className="shadow-lg dark:border-neutral-800">
    <CardHeader>
      <Skeleton className="h-7 w-3/5" /> {/* CardTitle */}
      <Skeleton className="h-4 w-4/5 mt-1" /> {/* CardDescription */}
    </CardHeader>
    <CardContent className="space-y-5">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-5 w-1/3" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input/Select */}
        </div>
      ))}
    </CardContent>
    <CardFooter>
      <Skeleton className="h-12 w-full" /> {/* Button */}
    </CardFooter>
  </HoverEffectCard>
);


const AddedCardSkeleton = () => (
  <HoverEffectCard className="border shadow-sm dark:border-neutral-800">
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start gap-2">
        <Skeleton className="h-5 w-3/4" /> {/* Title */}
        <Skeleton className="h-7 w-7 rounded-full" /> {/* Delete Button */}
      </div>
      <Skeleton className="h-4 w-1/3 mt-1" /> {/* Badge for Type */}
    </CardHeader>
    <CardContent className="space-y-1.5 text-sm pt-0">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center">
          <Skeleton className="h-4 w-4 mr-2 rounded-full" /> {/* Icon */}
          <Skeleton className="h-4 w-1/4 mr-1" /> {/* Label */}
          <Skeleton className="h-4 w-1/2" /> {/* Value */}
        </div>
      ))}
    </CardContent>
  </HoverEffectCard>
);


const CenteredMessage: React.FC<{
  icon?: React.ReactNode;
  title: string;
  message: string | React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
}> = ({ icon, title, message, action, variant = "default" }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Alert className={`max-w-md w-full dark:border-neutral-700 ${variant === 'destructive' ? 'border-destructive/50 text-destructive dark:border-destructive/30' : 'dark:bg-neutral-800/30'}`}>
      {icon && <div className={`mb-3 flex justify-center ${variant === 'destructive' ? 'text-destructive' : 'text-primary'}`}>{icon}</div>}
      <AlertTitle className={`text-lg font-semibold ${variant === 'destructive' ? '!text-destructive' : ''}`}>{title}</AlertTitle>
      <AlertDescription className={variant === 'destructive' ? '!text-destructive' : ''}>
        {message}
      </AlertDescription>
      {action && <div className="mt-4">{action}</div>}
    </Alert>
  </div>
);


export function CheckPointForm() {
  const {
    distances,
    availableMaterial,
    checkPoints,
    loading,
    creatingCheckPoint,
    deletingCheckPointId,
    error,
    addCheckPoint,
    removeCheckPoint,
    refetchData,
  } = useEventCheckPointsManager();

  if (loading && !checkPoints.length) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-10">
        <div className="text-center">
          <Skeleton className="h-8 w-1/2 mx-auto mb-2" />
          <Skeleton className="h-5 w-1/3 mx-auto" />
        </div>
        <InputFormSkeleton />
        <div>
          <Skeleton className="h-7 w-1/4 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AddedCardSkeleton />
            <AddedCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <H2 className="text-2xl font-bold text-center mb-6 text-primary dark:text-primary-foreground">
          Gestión de Puntos de Control
        </H2>
        <CenteredMessage
          icon={<ServerCrash size={40} />}
          title="Error al Cargar"
          variant="destructive"
          message={
            <>
              {error} <br /> No se pudo cargar la información necesaria.
            </>
          }
          action={
            <UiButton onClick={refetchData} variant="destructive">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Reintentar Carga
            </UiButton>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      <CheckPointInput
        existingCheckPointsNames={checkPoints.map(cp => cp.name.toLowerCase())}
        availableDistances={distances}
        availableMaterial={availableMaterial}
        onAddCheckPoint={addCheckPoint}
        isCreating={creatingCheckPoint}
      />

      {checkPoints.length > 0 && (
        <div className="mt-12">
          <H3 className="text-xl font-semibold mb-6 flex items-center">
            <ListPlus size={22} className="mr-3 text-primary" />
            Puntos de Control Añadidos ({checkPoints.length})
            {loading && <Loader2 className="ml-3 h-5 w-5 animate-spin text-muted-foreground" />}
          </H3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {checkPoints.map((cp) => (
              <CheckPointCard
                key={cp.id || cp.name}
                checkPoint={cp}
                availableMaterial={availableMaterial}
                onDelete={removeCheckPoint}
                isDeleting={deletingCheckPointId === cp.id}

              />
            ))}
          </div>
        </div>
      )}

      {checkPoints.length === 0 && !loading && !error && (
        <CenteredMessage
          icon={<ClipboardList size={40} />}
          title="Sin Puntos de Control"
          message="Aún no se han añadido puntos de control para este evento. Empieza utilizando el formulario de arriba."
        />
      )}
    </div>
  );
}