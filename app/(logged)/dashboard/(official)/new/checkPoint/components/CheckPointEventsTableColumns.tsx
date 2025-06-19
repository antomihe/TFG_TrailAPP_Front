// app\(logged)\dashboard\(official)\new\checkPoint\components\CheckPointEventsTableColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge"; 
import { ArrowUpDown, ArrowUp, ArrowDown, CalendarDays, MapPin, Building, Flag } from 'lucide-react'; 
import { dateFormatter, normalizeString, customDateSort } from '@/lib/utils';
import { CheckPointEventActionCell } from './CheckPointEventActionCell';
import { CheckPointEvent } from "@/hooks/api/dashboard/official/useFetchCheckPointEventsData";


const SortableHeader = ({ column, title, icon }: { column: any, title: string, icon?: React.ReactNode }) => {
  const isSorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(isSorted === "asc")}
      className="w-full justify-start px-2 hover:bg-muted/50 dark:hover:bg-muted/20 group" 
    >
      {icon && <span className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors">{icon}</span>}
      <span className="truncate">{title}</span>
      {isSorted === "asc" ? <ArrowUp className="ml-auto h-3.5 w-3.5 text-primary" />
        : isSorted === "desc" ? <ArrowDown className="ml-auto h-3.5 w-3.5 text-primary" />
        : <ArrowUpDown className="ml-auto h-3.5 w-3.5 opacity-30 group-hover:opacity-60 transition-opacity" />}
    </Button>
  );
};

export const getCheckPointEventsTableColumns = (): ColumnDef<CheckPointEvent>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="Nombre del Evento" />,
    cell: ({ row }) => <div className="font-medium text-foreground truncate pl-2">{row.getValue('name')}</div>,
    enableHiding: false, 
    sortingFn: (rowA, rowB, columnId) => {
      const valueA = normalizeString(rowA.getValue(columnId) as string);
      const valueB = normalizeString(rowB.getValue(columnId) as string);
      return valueA.localeCompare(valueB);
    },
    meta: {
      headerClassName: "w-[30%] sm:w-[25%]", 
    }
  },
  {
    accessorKey: "date",
    header: ({ column }) => <SortableHeader column={column} title="Fecha" icon={<CalendarDays size={16}/>} />,
    cell: ({ row }) => <div className="text-muted-foreground text-center tabular-nums">{dateFormatter(row.getValue('date'))}</div>,
    sortingFn: (rowA, rowB, columnId) => {
      return customDateSort(new Date(rowA.getValue(columnId)), new Date(rowB.getValue(columnId)));
    },
    meta: {
      headerClassName: "w-[120px] text-center",
      cellClassName: "text-center",
    }
  },
  {
    accessorKey: "location",
    header: ({ column }) => <SortableHeader column={column} title="Localidad" icon={<MapPin size={16}/>} />,
    cell: ({ row }) => <div className="text-muted-foreground text-center truncate">{row.getValue('location')}</div>,
    sortingFn: (rowA, rowB, columnId) => {
      const valueA = normalizeString(rowA.getValue(columnId) as string);
      const valueB = normalizeString(rowB.getValue(columnId) as string);
      return valueA.localeCompare(valueB);
    },
    meta: {
      headerClassName: "w-[20%] text-center hidden sm:table-cell", 
      cellClassName: "text-center hidden sm:table-cell",
    }
  },
  {
    accessorKey: "province",
    header: ({ column }) => <SortableHeader column={column} title="Provincia" icon={<Building size={16}/>} />,
    cell: ({ row }) => <div className="text-muted-foreground text-center truncate">{row.getValue('province')}</div>,
    sortingFn: (rowA, rowB, columnId) => {
      const valueA = normalizeString(rowA.getValue(columnId) as string);
      const valueB = normalizeString(rowB.getValue(columnId) as string);
      return valueA.localeCompare(valueB);
    },
    meta: {
      headerClassName: "w-[20%] text-center hidden md:table-cell", 
      cellClassName: "text-center hidden md:table-cell",
    }
  },
  {
    accessorKey: "distances",
    header: () => <div className="text-center font-medium text-muted-foreground px-2">Distancias</div>,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-center space-x-1">
        {(row.getValue('distances') as number[]).map((dist: number) => (
          <Badge key={dist} variant="secondary" className="text-xs">{`${dist}km`}</Badge>
        ))}
      </div>
    ),
    meta: {
      headerClassName: "w-[150px] text-center hidden sm:table-cell",
      cellClassName: "text-center hidden sm:table-cell",
    }
  },
  {
    id: "actions",
    header: () => <div className="text-center font-medium text-muted-foreground px-2">Acciones</div>,
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => <CheckPointEventActionCell row={row} />,
    meta: {
      headerClassName: "w-[120px] text-center",
      cellClassName: "text-center",
    }
  },
];