// app\(logged)\dashboard\(organizer)\events\enrollments\components\EventOrganizerList.tsx
'use client';

import React, { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button as UiButton } from '@/components/ui/button';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { PaginationComponent } from '@/components/ui/pagination-component';
import { Small } from '@/components/ui/typography';
import { AlertTriangle, ListX, ServerCrash, CalendarX, FolderOpen } from 'lucide-react'; 

import { useFetchOrganizerEventsData, OrganizerEvent } from '@/hooks/api/dashboard/organizer/useFetchOrganizerEventsData';
import { OrganizerEventsTableControls } from './OrganizerEventsTableControls';
import { getOrganizerEventsTableColumns } from './OrganizerEventsTableColumns';

const PAGE_SIZE = 5;


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
    <div className="flex flex-col items-center justify-center py-12 text-center min-h-[300px]">
      <Alert className={`max-w-md w-full ${alertClasses}`}>
        {icon && <div className={`mb-3 flex justify-center ${iconClasses}`}>{icon}</div>}
        <AlertTitle className={`text-lg font-semibold ${variant === 'destructive' ? '!text-destructive' : ''} ${variant === 'warning' ? 'text-yellow-700 dark:text-yellow-300' : ''}`}>{title}</AlertTitle>
        <AlertDescription className={`${variant === 'destructive' ? '!text-destructive' : ''} ${variant === 'warning' ? 'text-yellow-600 dark:text-yellow-500' : ''}`}>
          {message}
        </AlertDescription>
        {action && <div className="mt-4">{action}</div>}
      </Alert>
    </div>
  );
};


const TableSkeleton = ({ columnCount = 7, rowCount = PAGE_SIZE }: { columnCount?: number, rowCount?: number }) => (
  <div className="w-full space-y-3">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4 px-1 md:px-2">
      <Skeleton className="h-10 w-full sm:w-1/3" />
      <Skeleton className="h-10 w-full sm:w-auto sm:px-10" />
    </div>
    <div className="rounded-md border dark:border-neutral-800">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columnCount }).map((_, i) => (
              <TableHead key={i}><Skeleton className="h-5 w-full" /></TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: columnCount }).map((_, j) => (
                <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    <div className="flex items-center justify-between py-4">
      <Skeleton className="h-8 w-1/4" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  </div>
);


export default function EventsOrganizerList() {
    const {
        events,
        loading,
        error: fetchError,
        refetchEvents: refetchData, 
    } = useFetchOrganizerEventsData();

    const [filterValue, setFilterValue] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [currentPage, setCurrentPage] = useState(0);

    const columns: ColumnDef<OrganizerEvent>[] = useMemo(() => getOrganizerEventsTableColumns(), []);

    const table = useReactTable({
        data: events,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: (row, columnId, filterValueL) => {
            const eventName = String(row.getValue('name')).toLowerCase();
            const searchValue = String(filterValueL).toLowerCase();
            return eventName.includes(searchValue);
        },
        onGlobalFilterChange: setFilterValue,
        state: {
            sorting,
            columnFilters,
            globalFilter: filterValue,
            columnVisibility,
            pagination: {
                pageSize: PAGE_SIZE,
                pageIndex: currentPage,
            },
        },
    });

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return <div className="container mx-auto px-2 sm:px-4 py-8"><TableSkeleton columnCount={columns.length} /></div>;
    }

    if (fetchError && !events.length) {
        return (
          <div className="container mx-auto px-2 sm:px-4 py-8">
            <CenteredMessage
              icon={<ServerCrash size={48} />}
              title="Error al Cargar Eventos"
              variant="destructive"
              message={<>Ocurrió un problema al obtener los datos de tus eventos. <br/> ({fetchError || "Error desconocido"})</>}
              action={refetchData && (
                <UiButton onClick={refetchData} variant="destructive">
                  <AlertTriangle className="mr-2 h-4 w-4" /> Reintentar
                </UiButton>
              )}
            />
          </div>
        );
    }

    if (events.length === 0 && !fetchError) { 
        return (
          <div className="container mx-auto px-2 sm:px-4 py-8">
             <OrganizerEventsTableControls 
                table={table}
                filterValue={filterValue}
                onFilterChange={setFilterValue}
            />
            <CenteredMessage
              icon={<CalendarX size={48} />} 
              title="No Tienes Eventos"
              variant="default" 
              message="No hay eventos asociados a tu usuario como organizador o que coincidan con los filtros aplicados."
            />
          </div>
        );
    }

    return (
        <div className="container mx-auto px-1 sm:px-2 py-6">
            <OrganizerEventsTableControls
                table={table}
                filterValue={filterValue}
                onFilterChange={setFilterValue}
            />
            {fetchError && ( 
                <Alert variant="destructive" className="mb-4 mx-1 md:mx-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error de Actualización</AlertTitle>
                    <AlertDescription>
                        No se pudieron cargar los datos más recientes ({fetchError}). Mostrando información previa.
                        {refetchData && <UiButton onClick={refetchData} variant="link" className="p-0 h-auto text-destructive-foreground underline ml-2">Reintentar</UiButton>}
                    </AlertDescription>
                </Alert>
            )}
            <div className="rounded-md border dark:border-neutral-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id} className="bg-muted/30 dark:bg-muted/10">
                                    {headerGroup.headers.map(header => (
                                        <TableHead
                                            key={header.id}
                                            className={`py-3 px-2 md:px-3 whitespace-nowrap ${(header.column.columnDef.meta as any)?.headerClassName}`}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map(row => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors"
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell
                                                key={cell.id}
                                                className={`py-3 px-2 md:px-3 text-sm ${(cell.column.columnDef.meta as any)?.cellClassName}`}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                                            <FolderOpen size={32} /> 
                                            <span>No se encontraron eventos con los filtros aplicados.</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 pb-2 px-1 md:px-2 space-y-3 sm:space-y-0">
                {table.getRowCount() > 0 ? (
                    <Small className="text-muted-foreground">
                        Mostrando {table.getState().pagination.pageIndex * PAGE_SIZE + 1}-
                        {Math.min((table.getState().pagination.pageIndex + 1) * PAGE_SIZE, table.getRowCount())} de {table.getRowCount()} eventos.
                    </Small>
                ) : <div />}
                {table.getPageCount() > 1 && (
                    <PaginationComponent
                        totalPages={table.getPageCount()}
                        currentPage={currentPage + 1}
                        handlePageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}