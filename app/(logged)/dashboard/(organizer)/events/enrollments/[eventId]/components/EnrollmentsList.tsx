// app\(logged)\dashboard\(organizer)\events\enrollments\[eventId]\components\EnrollmentsList.tsx


'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button as UiButton } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { H2, H3 } from '@/components/ui/typography'; 
import { AlertTriangle, ServerCrash, Users, Loader2 } from 'lucide-react'; 
import {
    useFetchEventEnrollments,
    Enrollment,
} from '@/hooks/api/dashboard/organizer/useFetchEventEnrollments';
import { EnrollmentListControls } from './EnrollmentListControls';
import { EnrollmentTable } from './EnrollmentTable';


const CenteredMessage: React.FC<{
  icon?: React.ReactNode;
  title: string;
  message: string | React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "warning";
}> = ({ icon, title, message, action, variant = "default" }) => {
  let alertClasses = "dark:bg-neutral-800/30";
  let iconClasses = "text-primary";
  if (variant === "destructive") {
    alertClasses = "border-destructive/50 text-destructive dark:border-destructive/30";
    iconClasses = "text-destructive";
  } else if (variant === "warning") {
    alertClasses = "border-yellow-500/50 text-yellow-700 dark:text-yellow-500 dark:border-yellow-500/30 bg-yellow-50 dark:bg-yellow-500/10";
    iconClasses = "text-yellow-600 dark:text-yellow-400";
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center min-h-[400px]">
      <Alert className={`max-w-lg w-full ${alertClasses}`}>
        {icon && <div className={`mb-4 flex justify-center ${iconClasses}`}>{icon}</div>}
        <AlertTitle className={`text-xl font-semibold ${variant === 'destructive' ? '!text-destructive' : ''} ${variant === 'warning' ? 'text-yellow-700 dark:text-yellow-300' : ''}`}>{title}</AlertTitle>
        <AlertDescription className={`${variant === 'destructive' ? '!text-destructive' : ''} ${variant === 'warning' ? 'text-yellow-600 dark:text-yellow-500' : ''} mt-2`}>
          {message}
        </AlertDescription>
        {action && <div className="mt-6">{action}</div>}
      </Alert>
    </div>
  );
};

const ListSkeletonLoader = () => (
    <div className="max-w-6xl mx-auto px-2 sm:px-0 py-6 space-y-6">
        {/* Controls Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 rounded-lg border dark:border-neutral-800 bg-card dark:bg-neutral-900/50 shadow">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Skeleton className="h-10 w-full sm:w-[280px]" />
                <Skeleton className="h-10 w-full sm:w-[200px]" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Skeleton className="h-10 w-full sm:w-40" />
                <Skeleton className="h-10 w-full sm:w-40" />
            </div>
        </div>
        {/* Table Skeleton */}
        <div className="border rounded-lg dark:border-neutral-800 overflow-hidden">
            {/* Header */}
            <div className="p-3 border-b dark:border-neutral-800">
                <Skeleton className="h-6 w-1/3"/>
            </div>
            {/* Rows */}
            <div className="space-y-px bg-muted/30 dark:bg-neutral-800/50">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-background dark:bg-neutral-900">
                        <Skeleton className="h-5 w-1/5" />
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-5 w-1/6" />
                        <Skeleton className="h-5 w-1/6" />
                        <Skeleton className="h-5 w-1/12" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default function EnrollmentList() {
    const { 
        enrollments: allEnrollments,
        isLoading,
        error,
        isDownloading,
        downloadBibsPDF,
        downloadEnrollmentsPDF,
        refetchEnrollments,
    } = useFetchEventEnrollments();

    const [filterNameOrBib, setFilterNameOrBib] = useState('');
    const [filterDistance, setFilterDistance] = useState('');

    const handleFilterNameOrBibChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterNameOrBib(e.target.value);
    };

    const handleFilterDistanceChange = (value: string) => {
        setFilterDistance(value === "all" ? "" : value);
    };

    const filteredEnrollments = useMemo(() => {
        const lowercasedNameOrBibFilter = filterNameOrBib.toLowerCase();
        const distanceNumberFilter = filterDistance ? Number(filterDistance) : null;

        if (!lowercasedNameOrBibFilter && distanceNumberFilter === null) {
            return allEnrollments;
        }

        return allEnrollments.filter((enrollment) => {
            const nameMatch = lowercasedNameOrBibFilter
                ? enrollment.name.toLowerCase().includes(lowercasedNameOrBibFilter) ||
                  enrollment.dorsal.toString().includes(lowercasedNameOrBibFilter)
                : true;

            const distanceMatch = distanceNumberFilter !== null
                ? Number(enrollment.distance) === distanceNumberFilter 
                : true;

            return nameMatch && distanceMatch;
        });
    }, [allEnrollments, filterNameOrBib, filterDistance]);

    const uniqueDistances = useMemo(() => {
        if (!allEnrollments) return [];
        const distancesSet = new Set(allEnrollments.map(e => e.distance));
        return Array.from(distancesSet).sort((a, b) => a - b);
    }, [allEnrollments]);


    if (isLoading && allEnrollments.length === 0) { 
        return <ListSkeletonLoader />;
    }

    if (error && !isLoading && allEnrollments.length === 0) { 
        return (
            <div className="container mx-auto px-4 py-8">
              <CenteredMessage
                icon={<ServerCrash size={48} />}
                title="Error al Cargar Inscripciones"
                variant="destructive"
                message={<>{error} <br/> No se pudo obtener la lista de inscripciones.</>}
                action={
                  <UiButton onClick={refetchEnrollments} variant="destructive">
                    <AlertTriangle className="mr-2 h-4 w-4" /> Reintentar
                  </UiButton>
                }
              />
            </div>
        );
    }
    
    const pageTitle = "Lista de Inscripciones";
    const totalEnrollments = allEnrollments.length;
    const showingEnrollments = filteredEnrollments.length;

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 space-y-6">
            <div className="text-center md:text-left">
                <H2 className="text-2xl md:text-3xl font-bold text-primary dark:text-primary-foreground">{pageTitle}</H2>
                <p className="text-muted-foreground">
                    Total: {totalEnrollments} inscritos. Mostrando: {showingEnrollments}.
                    {isLoading && totalEnrollments > 0 && <span className="ml-2 inline-flex items-center text-sm"><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Actualizando...</span>}
                </p>
            </div>
            {error && isLoading && allEnrollments.length > 0 && ( 
                 <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error de Actualización</AlertTitle>
                    <AlertDescription>
                        No se pudieron cargar los datos más recientes ({error}). Mostrando información previa.
                        <UiButton onClick={refetchEnrollments} variant="link" className="p-0 h-auto text-destructive-foreground underline ml-2">Reintentar</UiButton>
                    </AlertDescription>
                </Alert>
            )}

            <EnrollmentListControls
                onFilterNameOrBibChange={handleFilterNameOrBibChange}
                filterNameOrBibValue={filterNameOrBib}
                onFilterDistanceChange={handleFilterDistanceChange}
                selectedDistanceFilter={filterDistance}
                availableDistances={uniqueDistances}
                onDownloadBibs={() => downloadBibsPDF?.() ?? Promise.resolve()}
                onDownloadEnrollments={() => downloadEnrollmentsPDF?.() ?? Promise.resolve()}
                isDownloading={isDownloading}
            />

            {(totalEnrollments === 0 && !isLoading && !error) ? (
                 <CenteredMessage
                    icon={<Users size={48} />}
                    title="No Hay Inscripciones"
                    variant="default"
                    message="Aún no hay participantes inscritos en este evento."
                 />
            ) : (
                <EnrollmentTable enrollments={filteredEnrollments} />
            )}
        </div>
    );
}