'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserState } from '@/store/user/user.store';
import api from '@/config/api';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
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
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { AlertTriangle, ArrowUpDown, ChevronDown, EyeIcon, Flag } from 'lucide-react';
import { timeFormatter } from '@/lib/utils';
import { PaginationComponent } from '@/components/ui/pagination-component';
import { Small } from '@/components/ui';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from '@/components/ui/alert';

const PAGE_SIZE = 4;

export default function DisqualificationList() {
    const router = useRouter();
    const user = useUserState().user;
    const [filterInput, setFilterInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState<string | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [currentPage, setCurrentPage] = useState(0);
    const [disqualifications, setDisqualifications] = useState<Disqualification[]>([]);
    const [isReferee, setIsReferee] = useState<boolean>(false)

    // Función para cargar eventos y descalificaciones
    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const resEvent = await api(user.access_token).get(`events/jury/today`);
                const eventId = resEvent.data.id;
                setIsReferee(resEvent.data.isReferee);
                const res = await api(user.access_token).get(`events/disqualification/${eventId}`);
                setDisqualifications(res.data);
            } catch (error) {
                const errorMessage = (error as any)?.response?.data?.message;
                setErrorLoading(errorMessage || 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [user.id]);

    // Columnas de la tabla
    const columns: ColumnDef<Disqualification>[] = [
        {
            accessorKey: "athlete",
            header: () => (
                <div className="text-center flex justify-center items-center">
                    Atleta <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            ),
            cell: ({ row }) => <div className="text-center">{row.original.athlete.displayName}</div>,
            enableHiding: false,
        },
        {
            accessorKey: "official",
            header: () => (
                <div className="text-center flex justify-center items-center">
                    Juez <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            ),
            cell: ({ row }) => <div className='text-center'>{row.original.official.displayName}</div>,
            enableHiding: true,
        },
        {
            accessorKey: "reason",
            header: () => (
                <div className="text-center flex justify-center items-center">
                    Razón <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            ),
            cell: ({ row }) => <div className="text-center">{row.original.reason}</div>,
            enableHiding: true,
        },
        {
            accessorKey: "time",
            header: () => (
                <div className="text-center flex justify-center items-center">
                    Hora <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
            ),
            cell: ({ row }) => <div className="text-center">{timeFormatter(row.original.time)}</div >,
            enableHiding: true,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Button
                        onClick={() => router.push(`/dashboard/disqualifications/${row.original.id}`)}
                        variant="outline"
                        className="flex items-center bg-transparent border-primary"
                        onMouseEnter={() => router.prefetch(`/dashboard/disqualifications/${row.original.id}`)}
                    >
                        {row.original.reviewedByReferee ? <EyeIcon className="mr-2 h-4 w-4" /> : <Flag className="mr-2 h-4 w-4" />}
                        {row.original.reviewedByReferee ? 'Ver parte descalificación' : 'Resolver descalificación'}
                    </Button>
                </div>
            ),
        },
    ];

    const filteredData = React.useMemo(() => {
        const searchValue = filterInput.toLowerCase();
        return disqualifications.filter((row) =>
            row.athlete.displayName.toLowerCase().includes(searchValue) ||
            row.official.displayName.toLowerCase().includes(searchValue)
        );
    }, [filterInput, disqualifications]);


    const table = useReactTable({
        data: filteredData,
        columns,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            columnVisibility,
            pagination: {
                pageSize: PAGE_SIZE,
                pageIndex: currentPage,
            },
        },
    });

    if (loading) {
        return <div className="text-center pt-5">Cargando...</div>;
    }

    if (errorLoading) {
        return (
            <div className="flex items-center justify-center max-w-xl mx-auto p-4">
                <Alert className="flex items-center space-x-2 p-5">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <AlertDescription>
                        {errorLoading}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (disqualifications.length === 0) {
        if (errorLoading) {
            return (
                <div className="flex items-center justify-center max-w-xl mx-auto p-4">
                    <Alert className="flex items-center space-x-2 p-5">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <AlertDescription>
                            No hay eventos asociados a tu federación
                        </AlertDescription>
                    </Alert>
                </div>
            );
        }
    }

    if (!isReferee) {
        return (
            <div className="flex items-center justify-center max-w-xl mx-auto p-4">
                <Alert className="flex items-center space-x-2 p-5">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <AlertDescription>
                        <div className="text-center pt-5">No eres Juez Árbitro de la carrera actual</div>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4 space-x-4 mx-2">
                <Input
                    placeholder="Filtrar por nombre de atleta o juez..."
                    value={filterInput}
                    onChange={(e) => setFilterInput(e.target.value)}
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
                                            case "official":
                                                return "Juez";
                                            case "reason":
                                                return "Razón";
                                            case "time":
                                                return "Hora";
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
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className='w-1/6'>
                                    {header.isPlaceholder ? null : (
                                        <Button
                                            variant="ghost"
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="w-full"
                                            disabled={header.column.id === 'actions'}
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
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {table.getRowCount() > 0 && (
                <Small className="text-center mt-4 font-medium">
                    Mostrando {table.getRowCount()} elementos
                </Small>
            )}
            <PaginationComponent
                totalPages={table.getPageCount()}
                currentPage={currentPage + 1}
                handlePageChange={(newPage) => setCurrentPage(newPage - 1)}
                className="mt-2"
            />
        </div>
    );
}
