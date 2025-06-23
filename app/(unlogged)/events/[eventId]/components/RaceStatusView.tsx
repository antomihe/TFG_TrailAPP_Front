// app\(unlogged)\events\[eventId]\components\RaceStatusView.tsx
// app/(unlogged)/events/[eventId]/components/RaceStatusView.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui';
import { Loader2, ServerCrash } from 'lucide-react';
import { useRaceStatus } from '@/hooks/api/unlogged/events/useRaceStatus';
import { RaceStatusHeader } from './RaceStatusHeader';
import EnrollmentList from './EnrollmentList';
import { CenteredMessage } from '@/components/ui/centered-message';

const SkeletonLoader = () => (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        <Skeleton className="h-12 w-full md:w-2/5 lg:w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
    </div>
);

export default function RaceStatusView() {
    const {
        enrollments,
        isConnected,
        socketError,
        loadingInitialData,
        initialDataError,
        refetchInitialEnrollments,
    } = useRaceStatus();

    const [filterTerm, setFilterTerm] = useState('');

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterTerm(e.target.value);
    };

    const filteredEnrollments = useMemo(() => {
        const lowercasedFilter = filterTerm.toLowerCase();
        if (!lowercasedFilter) {
            return enrollments;
        }
        return enrollments.filter(
            (enrollment) =>
                enrollment.athleteName.toLowerCase().includes(lowercasedFilter) ||
                enrollment.dorsal.toString().includes(lowercasedFilter)
        );
    }, [enrollments, filterTerm]);

    if (loadingInitialData) {
        return <SkeletonLoader />;
    }

    if (initialDataError) {
        return (
            <CenteredMessage
                icon={<ServerCrash size={48} />}
                title="Error al Cargar Datos"
                variant="destructive"
                message={<>{initialDataError} <br /> <strong>No se pudo obtener el estado de la carrera.</strong></>}
                action={refetchInitialEnrollments && (
                    <Button onClick={refetchInitialEnrollments} variant="destructive">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reintentar
                    </Button>
                )}
            />
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-6 md:pt-4 space-y-6">
            <RaceStatusHeader
                onFilterChange={handleFilterChange}
                isConnected={isConnected}
                socketError={socketError}
                filterValue={filterTerm}
            />
            <div className="w-full">
                <EnrollmentList enrollments={filteredEnrollments} />
            </div>
        </div>
    );
}