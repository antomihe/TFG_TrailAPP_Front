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
import { ArrowUpDown, TrashIcon, ChevronDown, BookUser } from 'lucide-react';
import { dateFormatter } from '@/lib/utils';

interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    province: string;
    validated: boolean;
}

export default function EventsJuryList() {
    const router = useRouter()
    const user = useUserState().user;
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const res = await api(user.access_token).get(`events/validated`);
                setEvents(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user.id]);

    interface CustomSortingFnRow {
        getValue: (key: string) => string;
    }

    const customSortingFn = (rowA: CustomSortingFnRow, rowB: CustomSortingFnRow): number => {
        const dateA = new Date(rowA.getValue('date'));
        const dateB = new Date(rowB.getValue('date'));
        return dateA.getTime() - dateB.getTime();
    };

    const columns: ColumnDef<Event>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nombre <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue('name')}</div>,
            enableHiding: false,
        },
        {
            accessorKey: "date",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Fecha <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{dateFormatter(row.getValue('date'))}</div>,
            sortingFn: customSortingFn,
        },
        {
            accessorKey: "location",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Localidad <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue('location')}</div>,
        },
        {
            accessorKey: "province",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Provincia <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue('province')}</div>,
        },
        {
            accessorKey: "federation",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Federación <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue('federation')}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const event = row.original;
                return (
                    <div className="flex space-x-2 justify-end'">
                        <Button
                            onClick={() => router.push(`/dashboard/jury/${event.id}`)}
                            variant="outline"
                            className="flex items-center bg-transparent border-primary"
                            onMouseEnter={() => router.prefetch(`/dashboard/jury/${event.id}`)}
                        >
                            <BookUser className="mr-2 h-4 w-4" /> Asignar jurado
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
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        manualPagination: false,
        pageCount: Math.ceil(events.length / pageSize),
    });

    const paginatedEvents = table.getRowModel().rows.slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize
    );

    const hasNextPage = (currentPage + 1) * pageSize < events.length;
    const hasPreviousPage = currentPage > 0;

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return <div className="text-center pt-5">Cargando...</div>;
    }

    if (events.length === 0) {
        return <div className="text-center pt-5">No hay eventos asociados a tu federación</div>;
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4 space-x-4">
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
                                            case "validated":
                                                return "Validado";
                                            case "federation":
                                                return "Código de federación";
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
                                <TableHead key={header.id} className="w-1/5">
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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

            <div className="flex items-center justify-center mt-3">
                <Button onClick={() => handlePageChange(currentPage - 1)} disabled={!hasPreviousPage}>
                    Anterior
                </Button>
                <div className='mx-5'>
                    Página {currentPage + 1} de {Math.ceil(events.length / pageSize)}
                </div>
                <Button onClick={() => handlePageChange(currentPage + 1)} disabled={!hasNextPage}>
                    Siguiente
                </Button>
            </div>
        </div>
    );
}