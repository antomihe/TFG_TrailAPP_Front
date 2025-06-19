// app\(logged)\dashboard\(nationalFederation)\jury\components\EventJuryList.tsx
'use client';

import React, { useState, useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    ColumnFiltersState, SortingState, VisibilityState, flexRender,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
    getSortedRowModel, useReactTable, ColumnDef,
} from "@tanstack/react-table";
import { Skeleton } from '@/components/ui/skeleton';
import { Button as UiButton } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { H2 } from '@/components/ui/typography';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    AlertTriangle, ServerCrash, ListX, Loader2, ClipboardList
} from 'lucide-react';
import { PaginationComponent } from '@/components/ui/pagination-component';
import { Small } from '@/components/ui/typography';

import { useFetchNationalJuryEventsData, NationalJuryEvent } from '@/hooks/api/dashboard/nationalFederation/useFetchNationalJuryEventsData';
import { NationalJuryEventsTableControls } from './NationalJuryEventsTableControls';
import { getNationalJuryEventsTableColumns } from './NationalJuryEventsTableColumns';

const PAGE_SIZE = 5;

const CenteredMessage: React.FC<{
    icon?: React.ReactNode;
    title: string;
    message: React.ReactNode;
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
                <AlertDescription className={`${variant === 'destructive' ? '!text-destructive' : ''} ${variant === 'warning' ? 'text-yellow-600 dark:text-yellow-500' : ''} mt-2 text-sm`}>
                    {message}
                </AlertDescription>
                {action && <div className="mt-6">{action}</div>}
            </Alert>
        </div>
    );
};

const IconTableHead: React.FC<{ icon?: React.ReactNode; className?: string; children: React.ReactNode }> = ({ icon, className, children }) => (
    <TableHead className={`py-2.5 px-1 sm:py-3 sm:px-2 md:px-3 whitespace-nowrap group ${className}`}>
        {children}
    </TableHead>
);

const ListSkeletonLoader = ({ rowCount = PAGE_SIZE, columnCount = 4 }: { rowCount?: number, columnCount?: number }) => (
    <div className="container mx-auto px-1 sm:px-2 py-8">
        <div className="text-center mb-8"> <Skeleton className="h-8 w-3/5 mx-auto mb-2" /> <Skeleton className="h-4 w-2/5 mx-auto" /> </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4 px-1"> <Skeleton className="h-10 w-full sm:w-1/3" /> <Skeleton className="h-10 w-full sm:w-auto sm:min-w-[120px]" /> </div>
        <div className="border rounded-lg dark:border-neutral-800 overflow-hidden">
            <Table className="min-w-full">
                <TableHeader> <TableRow> {Array.from({ length: columnCount }).map((_, i) => (<TableHead key={i} className="px-1 sm:px-2"><Skeleton className="h-4 w-full" /></TableHead>))} </TableRow> </TableHeader>
                <TableBody> {Array.from({ length: rowCount }).map((_, index) => (<TableRow key={index}> {Array.from({ length: columnCount }).map((_, j) => (<TableCell key={j} className="px-1 sm:px-2 py-2.5"><Skeleton className="h-4 w-full" /></TableCell>))} </TableRow>))} </TableBody>
            </Table>
        </div>
        <div className="flex items-center justify-between py-4 mt-4"> <Skeleton className="h-8 w-1/3" /> <div className="flex space-x-2"> <Skeleton className="h-8 w-12 sm:w-16" /> <Skeleton className="h-8 w-12 sm:w-16" /> </div> </div>
    </div>
);


export default function EventsJuryList() {
    const { events, loading, error, refetchEvents } = useFetchNationalJuryEventsData();

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        date: true,
        location: true,
        province: true,
        federation: true,
        name: true,
    });
    const [currentPage, setCurrentPage] = useState(0);

    const columns: ColumnDef<NationalJuryEvent>[] = useMemo(() => getNationalJuryEventsTableColumns(), []);

    const table = useReactTable({
        data: events,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        globalFilterFn: (row, columnId, filterValue) => {
            const eventName = String(row.getValue('name')).toLowerCase();
            const federationName = String(row.getValue('federation')).toLowerCase();
            const searchValue = String(filterValue).toLowerCase();
            return eventName.includes(searchValue) || federationName.includes(searchValue);
        },
        state: {
            sorting, columnFilters, globalFilter, columnVisibility,
            pagination: { pageSize: PAGE_SIZE, pageIndex: currentPage, },
        },
    });

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getVisibleColumnCountForSkeleton = () => {
        let count = columns.reduce((acc, colDef) => {
            const meta = colDef.meta as any;
            const isHiddenByClass = meta?.headerClassName?.includes('hidden sm:flex') ||
                meta?.headerClassName?.includes('hidden md:flex') ||
                meta?.headerClassName?.includes('hidden lg:flex');

            if (columnVisibility[colDef.id as string] !== false && (!isHiddenByClass || colDef.enableHiding === false)) {
                return acc + 1;
            }
            return acc;
        }, 0);
        return count || 3;
    };

    if (loading && (!events || events.length === 0)) {
        return <ListSkeletonLoader columnCount={getVisibleColumnCountForSkeleton()} />;
    }

    if (error && (!events || events.length === 0)) {
        return (
            <div className="container mx-auto px-1 sm:px-2 py-8">
                <H2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary dark:text-primary-foreground">
                    Asignación de Jurado Nacional
                </H2>
                <CenteredMessage
                    icon={<ServerCrash size={48} />}
                    title="Error al Cargar Eventos"
                    variant="destructive"
                    message={<>{error} <br /> No se pudo obtener la lista de eventos.</>}
                    action={refetchEvents && (
                        <UiButton onClick={refetchEvents} variant="destructive">
                            <AlertTriangle className="mr-2 h-4 w-4" /> Reintentar
                        </UiButton>
                    )}
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-1 sm:px-2 py-6 space-y-6">
       
            <NationalJuryEventsTableControls table={table} />

            {error && events && events.length > 0 && (
                <Alert variant="destructive" className="mx-1 sm:mx-0">
                    <ServerCrash className="h-4 w-4" />
                    <AlertTitle>Error de Actualización</AlertTitle>
                    <AlertDescription>
                        No se pudieron cargar los datos más recientes ({error}). Mostrando información previa.
                        {refetchEvents && <UiButton onClick={refetchEvents} variant="link" className="p-0 h-auto text-destructive-foreground underline ml-2">Reintentar</UiButton>}
                    </AlertDescription>
                </Alert>
            )}

            {(!events || events.length === 0) && !loading && !error ? (
                <div className="px-1 sm:px-0">
                    <CenteredMessage
                        icon={<ClipboardList size={48} />}
                        title="Sin Eventos"
                        message="No hay eventos validados disponibles para la asignación de jurado nacional."
                    />
                </div>
            ) : table.getRowModel().rows.length === 0 ? (
                <div className="px-1 sm:px-0">
                    <CenteredMessage
                        icon={<ListX size={48} />}
                        title="Sin Resultados"
                        message="No se encontraron eventos que coincidan con los filtros aplicados."
                    />
                </div>
            ) : (
                <div className="border rounded-lg overflow-hidden dark:border-neutral-800 shadow-md bg-card">
                    <ScrollArea className="max-h-[70vh] w-full">
                        <Table className="min-w-[360px] sm:min-w-full">
                            <TableHeader className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 shadow-sm dark:shadow-none dark:bg-neutral-900/95">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <IconTableHead key={header.id} className={(header.column.columnDef.meta as any)?.headerClassName}>
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </IconTableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.map(row => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors">
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id} className={`py-2.5 px-1 sm:py-3 sm:px-2 text-xs sm:text-sm ${(cell.column.columnDef.meta as any)?.cellClassName}`}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            )}

            {table.getRowCount() > 0 && table.getPageCount() > 1 && (
                <PaginationComponent
                    className="mt-8 flex justify-center"
                    totalPages={table.getPageCount()}
                    currentPage={currentPage + 1}
                    handlePageChange={handlePageChange}
                />
            )}
            {table.getRowCount() > 0 && (
                <div className='flex justify-center items-center mt-4'>
                    <Small className='text-muted-foreground'>
                        Mostrando {table.getRowModel().rows.length} de {table.getPrePaginationRowModel().rows.length} eventos (filtrados)
                    </Small>
                </div>
            )}
        </div>
    );
}