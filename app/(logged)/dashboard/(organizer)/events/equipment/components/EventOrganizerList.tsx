'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserState } from '@/store/user/user.store';
import api from '@/config/api';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { ChevronDown, ArrowUpDown, Wrench } from 'lucide-react';
import { dateFormatter } from '@/lib/utils';
import { PaginationComponent } from '@/components/ui/pagination-component';
import { Small } from '@/components/ui';

interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    province: string;
    validated: boolean;
    distances: number[];
}

const PAGE_SIZE = 4;

export default function EventsOrganizerList() {
    const router = useRouter();
    const user = useUserState().user;
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const res = await api(user.access_token).get(`events/organizer/future/${user.id}`);
                setEvents(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user.id]);

    const columns: ColumnDef<Event>[] = [
        {
            accessorKey: "name",
            header: () => (
                <div className="w-full text-center flex justify-center items-center">
                    Nombre
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            ),
            cell: ({ row }) => <div className="text-center">{row.getValue('name')}</div>,
            enableHiding: false,
        },
        {
            accessorKey: "date",
            header: () => (
                <div className="w-full text-center flex justify-center items-center">
                    Fecha
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            ),
            cell: ({ row }) => <div className="text-center">{dateFormatter(row.getValue('date'))}</div>,
        },
        {
            accessorKey: "location",
            header: () => (
                <div className="w-full text-center flex justify-center items-center">
                    Localidad
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            ),
            cell: ({ row }) => <div className="text-center">{row.getValue('location')}</div>,
        },
        {
            accessorKey: "province",
            header: () => (
                <div className="w-full text-center flex justify-center items-center">
                    Provincia
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            ),
            cell: ({ row }) => <div className="text-center">{row.getValue('province')}</div>,
        },
        {
            accessorKey: "distances",
            header: () => (
                <div className="w-full text-center">Distancias</div>
            ),
            enableSorting: false,
            cell: ({ row }) => (
                <div className="text-center">
                    {(row.getValue('distances') as number[]).map((element: number) => `${element}km`).join(', ')}
                </div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            enableSorting: false,
            cell: ({ row }) => {
                const event = row.original;
                return (
                    <div className="flex space-x-2 justify-end">
                        <Button
                            onClick={() => router.push(`/dashboard/events/equipment/${event.id}`)}
                            variant="outline"
                            className="flex items-center bg-transparent border-primary"
                            onMouseEnter={() => router.prefetch(`/dashboard/events/equipment/${event.id}`)}
                        >
                            <Wrench className="mr-2 h-4 w-4" /> Material
                        </Button>
                    </div>
                );
            },
        },
    ];


    const table = useReactTable({
        data: events,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            pagination: {
                pageSize: PAGE_SIZE,
                pageIndex: currentPage,
            },
        },
    });

    const paginatedEvents = table.getRowModel().rows;

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage - 1);

    };

    if (loading) {
        return <div className="text-center pt-5">Cargando...</div>;
    }

    if (events.length === 0) {
        return <div className="text-center pt-5">No hay eventos asociados a tu usuario</div>;
    }

    return (
        <div className="w-full items-center">
            <div className="flex items-center justify-between py-4 space-x-4 mx-2">
                <Input
                    placeholder="Filtrar por nombre de evento..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columnas <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {table.getAllColumns().map((column) => (
                            column.getCanHide() && (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(value)}
                                >
                                    {(() => {
                                        switch (column.id) {
                                            case "date":
                                                return "Fecha";
                                            case "location":
                                                return "Localidad";
                                            case "province":
                                                return "Provincia";
                                            case "distances":
                                                return "Distancias";
                                            default:
                                                return column.id;
                                        }
                                    })()}
                                </DropdownMenuCheckboxItem>
                            )
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead key={header.id} className='w-1/6'>
                                    {header.isPlaceholder || header.id === 'actions' ? null : (
                                        <Button
                                            variant="ghost"
                                            onClick={header.column.getToggleSortingHandler()}
                                            className={"w-full"}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </Button>
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {paginatedEvents.length > 0 ? (
                        paginatedEvents.map(row => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className='text-center'>No se encontraron eventos</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {table.getRowCount() > 0 && (
                <Small className='text-center mt-4 font-medium'>Mostrando {table.getRowCount()} elementos</Small>
            )}
            <PaginationComponent
                totalPages={table.getPageCount()}
                currentPage={currentPage + 1}
                handlePageChange={handlePageChange}
                className='mt-2'
            />
        </div>
    );
}
