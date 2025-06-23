'use client';

import React, { useState } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { H3, P } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileSearch, Hash, User, Activity, CircleUserRound, ChevronLeft, ChevronRight } from 'lucide-react';
import { EnrollmentStatus } from '@/hooks/api/unlogged/events/useRaceStatus';

type Props = {
    enrollments: EnrollmentStatus[];
    itemsPerPage?: number;
}

const DEFAULT_ITEMS_PER_PAGE = 3;

const EnrollmentItem = ({ athlete }: { athlete: EnrollmentStatus }) => (
    <div
        className="block sm:table-row hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors"
        role="row"
    >
        <div className="hidden sm:table-cell sm:p-0 sm:w-[90px] align-middle" role="cell">
            <div className="sm:flex h-full items-center justify-center p-3">
                <Badge variant="secondary" className="font-mono text-xs sm:text-sm px-2 py-0.5">
                    {athlete.dorsal || 'N/A'}
                </Badge>
            </div>
        </div>

        <div className="hidden sm:table-cell sm:px-3 sm:py-3 align-middle" role="cell">
            <p className="text-sm font-medium text-foreground truncate">{athlete.athleteName}</p>
        </div>

        <div className="hidden sm:table-cell sm:px-3 sm:py-3 sm:w-[180px] align-middle" role="cell">
            <div className="sm:text-center">
                <p className="text-sm font-medium">{athlete.status}</p>
            </div>
        </div>

        <div className="sm:hidden flex justify-between items-start w-full p-4">
            <div className="flex flex-col gap-3 mr-2">
                <div>
                    <span className="flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <CircleUserRound size={14} className="mr-2" aria-hidden="true" />
                        Atleta
                    </span>
                    <p className="mt-1 text-sm font-medium text-foreground break-words">
                        {athlete.athleteName}
                    </p>
                </div>
                <div>
                    <span className="flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <Activity size={14} className="mr-2" aria-hidden="true" />
                        Estado
                    </span>
                    <p className="mt-1 text-sm font-medium text-foreground">
                        {athlete.status}
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-end text-right shrink-0">
                <span className="text-lg font-bold text-primary">
                    #{athlete.dorsal || 'N/A'}
                </span>
            </div>
        </div>
    </div>
);

export default function EnrollmentList({ enrollments, itemsPerPage = DEFAULT_ITEMS_PER_PAGE }: Props) {
    const [currentPage, setCurrentPage] = useState(1);

    if (!enrollments || enrollments.length === 0) {
        return (
            <div
                className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card/50 p-8 text-center text-muted-foreground dark:border-neutral-700 dark:bg-neutral-900/30"
                aria-live="polite"
            >
                <FileSearch size={48} className="mb-4 text-primary/70" aria-hidden="true" />
                <H3 className="text-lg font-medium text-foreground">No se encontraron inscripciones</H3>
                <P className="mt-2 max-w-xs text-sm">
                    Prueba a modificar los filtros o espera a que se actualice la información.
                </P>
            </div>
        );
    }

    const totalPages = Math.ceil(enrollments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedEnrollments = enrollments.slice(startIndex, endIndex);

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    return (
        <div className="overflow-hidden rounded-lg border bg-card shadow-md dark:border-neutral-800">
            <ScrollArea className="w-full">
                <div
                    className="w-full sm:table sm:table-fixed"
                    role="table"
                    aria-label="Lista de Inscripciones"
                >
                    <div
                        className="hidden sm:table-header-group sticky top-0 z-10 bg-background/95 backdrop-blur-sm"
                        role="rowgroup"
                    >
                        <div className="shadow-sm sm:table-row dark:shadow-none" role="row">
                            <div
                                className="w-[90px] py-3 px-3 text-center sm:table-cell text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                                role="columnheader"
                            >
                               Dorsal
                            </div>
                            <div
                                className="py-3 px-3 text-left sm:table-cell text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                                role="columnheader"
                            >
                                Nombre
                            </div>
                            <div
                                className="w-[180px] py-3 px-3 text-center sm:table-cell text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                                role="columnheader"
                            >
                                Estado
                            </div>
                        </div>
                    </div>
                    <div
                        className="divide-y divide-border sm:table-row-group sm:divide-y-0"
                        role="rowgroup"
                    >
                        {paginatedEnrollments.map((athlete, index) => (
                            <EnrollmentItem
                                key={athlete.dorsal || `enrollment-${startIndex + index}`}
                                athlete={athlete}
                            />
                        ))}
                    </div>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {totalPages > 1 && (
                <div className="flex items-center justify-between gap-4 p-3 sm:p-4 border-t dark:border-neutral-700 bg-background/50">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 text-xs sm:text-sm"
                    >
                        <ChevronLeft size={16} />
                        Anterior
                    </Button>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 text-xs sm:text-sm"
                    >
                        Siguiente
                        <ChevronRight size={16} />
                    </Button>
                </div>
            )}
        </div>
    );
}