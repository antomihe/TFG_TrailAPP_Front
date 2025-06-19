// app\(logged)\dashboard\(federation)\events\jury\components\JuryEventTableColumns.tsx

import { ColumnDef } from "@tanstack/react-table";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ArrowUp, ArrowDown, CalendarDays, MapPin, Building, UsersRound as RefereeIcon } from 'lucide-react';
import { customDateSort, dateFormatter, normalizeString } from '@/lib/utils';
import { JuryEvent } from '@/hooks/api/dashboard/federation/useFetchJuryEvents';
import { JuryEventActionCell } from "./JuryEventActionCell";

const SortableHeader = ({ column, title, icon, headerClassName }: { column: any, title: string, icon?: React.ReactNode, headerClassName?: string }) => {
  const isSorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(isSorted === "asc")}
      className={`w-full justify-start px-1 sm:px-2 hover:bg-muted/50 dark:hover:bg-muted/20 group ${headerClassName}`}
    >
      {icon && <span className="mr-1 sm:mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary transition-colors">{icon}</span>}
      <span className="truncate text-xs sm:text-sm">{title}</span>
      {isSorted === "asc" ? <ArrowUp className="ml-auto h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
        : isSorted === "desc" ? <ArrowDown className="ml-auto h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
          : <ArrowUpDown className="ml-auto h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-30 group-hover:opacity-60 transition-opacity" />}
    </Button>
  );
};

export const getJuryEventTableColumns = (): ColumnDef<JuryEvent>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="Evento" />,
    cell: ({ row }) => <div className="font-medium text-foreground truncate pl-1 pr-0.5 sm:pl-2 text-xs sm:text-sm min-w-[120px]">{row.getValue('name')}</div>,
    sortingFn: (rowA, rowB, columnId) => normalizeString(rowA.getValue(columnId) as string).localeCompare(normalizeString(rowB.getValue(columnId) as string)),
    enableHiding: false,
    meta: {

      headerClassName: "w-auto sm:w-[35%] md:w-[30%]",
      cellClassName: "py-2.5 px-1 sm:px-2",
    }
  },
  {
    accessorKey: "date",
    header: ({ column }) => <SortableHeader column={column} title="Fecha" icon={<CalendarDays size={14} />} headerClassName="hidden sm:flex" />,
    cell: ({ row }) => <div className="text-muted-foreground text-center tabular-nums text-xs sm:text-sm">{dateFormatter(row.getValue('date'))}</div>,
    sortingFn: (rowA, rowB, columnId) => customDateSort(rowA.getValue(columnId) as string, rowB.getValue(columnId) as string),
    enableHiding: true,
    meta: {
      headerClassName: "w-[100px] text-center hidden sm:table-cell",
      cellClassName: "text-center py-2.5 px-1 sm:px-2 hidden sm:table-cell",
    }
  },
  {
    accessorKey: "location",
    header: ({ column }) => <SortableHeader column={column} title="Lugar" icon={<MapPin size={14} />} headerClassName="hidden md:flex" />,
    cell: ({ row }) => <div className="text-muted-foreground text-center truncate text-xs sm:text-sm">{row.getValue('location')}</div>,
    sortingFn: (rowA, rowB, columnId) => normalizeString(rowA.getValue(columnId) as string).localeCompare(normalizeString(rowB.getValue(columnId) as string)),
    enableHiding: true,
    meta: {
      headerClassName: "w-[20%] text-center hidden md:table-cell",
      cellClassName: "text-center py-2.5 px-1 sm:px-2 hidden md:table-cell",
    }
  },
  {
    accessorKey: "province",
    header: ({ column }) => <SortableHeader column={column} title="Prov." icon={<Building size={14} />} headerClassName="hidden lg:flex" />,
    cell: ({ row }) => <div className="text-muted-foreground text-center truncate text-xs sm:text-sm">{row.getValue('province')}</div>,
    sortingFn: (rowA, rowB, columnId) => normalizeString(rowA.getValue(columnId) as string).localeCompare(normalizeString(rowB.getValue(columnId) as string)),
    enableHiding: true,
    meta: {
      headerClassName: "w-[15%] text-center hidden lg:table-cell",
      cellClassName: "text-center py-2.5 px-1 sm:px-2 hidden lg:table-cell",
    }
  },
  {
    id: "actions",
    header: () => <div className="text-center font-medium text-muted-foreground px-0.5 sm:px-2 text-xs sm:text-sm">Acción</div>,
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => <JuryEventActionCell row={row} />,
    meta: {
      headerClassName: "w-[80px] sm:w-[140px] text-center",
      cellClassName: "text-center py-2.5 px-0.5 sm:px-2",
    }
  },
];