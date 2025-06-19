// app\(logged)\dashboard\(official)\disqualifications\components\DisqualificationsTableColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ArrowUp, ArrowDown, UserCircle, ShieldAlert, FileText, Clock, UserCheck, ShieldCheck } from 'lucide-react'; 
import { timeFormatter, normalizeString } from '@/lib/utils';
import { DisqualificationActionCell } from './DisqualificationActionCell';
import { DisqualificationData } from "@/hooks/api/dashboard/official/useFetchDisqualificationsData";


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

export const getDisqualificationsTableColumns = (): ColumnDef<DisqualificationData>[] => [
  {
    accessorKey: "athlete.name",
    header: ({ column }) => <SortableHeader column={column} title="Atleta" icon={<UserCircle size={16}/>} />,
    cell: ({ row }) => <div className="font-medium text-foreground truncate pl-2">{row.original.athlete.name}</div>,
    sortingFn: (rowA, rowB) => {
      return normalizeString(rowA.original.athlete.name).localeCompare(normalizeString(rowB.original.athlete.name));
    },
    enableHiding: false,
    meta: {
      headerClassName: "w-[30%] sm:w-[25%]",
    }
  },
  {
    accessorKey: "official.name",
    header: ({ column }) => <SortableHeader column={column} title="Juez" icon={<UserCheck size={16}/>} />,
    cell: ({ row }) => <div className="text-muted-foreground text-center truncate">{row.original.official.name}</div>,
    sortingFn: (rowA, rowB) => {
      return normalizeString(rowA.original.official.name).localeCompare(normalizeString(rowB.original.official.name));
    },
    meta: {
      headerClassName: "w-[25%] text-center hidden md:table-cell",
      cellClassName: "text-center hidden md:table-cell",
    }
  },
  {
    accessorKey: "reason",
    header: ({ column }) => <SortableHeader column={column} title="Razón" icon={<FileText size={16}/>} />,
    cell: ({ row }) => (
      <div className="text-muted-foreground text-center truncate max-w-[200px] mx-auto" title={row.original.reason}>
        {row.original.reason}
      </div>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      return normalizeString(rowA.getValue(columnId) as string).localeCompare(normalizeString(rowB.getValue(columnId) as string));
    },
    meta: {
      headerClassName: "w-[30%] text-center hidden sm:table-cell",
      cellClassName: "text-center hidden sm:table-cell",
    }
  },
  {
    accessorKey: "createdAt",
    id: "time",
    header: ({ column }) => <SortableHeader column={column} title="Hora" icon={<Clock size={16}/>} />,
    cell: ({ row }) => <div className="text-muted-foreground text-center tabular-nums">{timeFormatter(row.original.createdAt)}</div>,
    sortingFn: (rowA, rowB) => new Date(rowA.original.createdAt).getTime() - new Date(rowB.original.createdAt).getTime(),
    meta: {
      headerClassName: "w-[120px] text-center",
      cellClassName: "text-center",
    }
  },
  {
    accessorKey: "reviewedByReferee",
    id: "status",
    header: () => <div className="text-center font-medium text-muted-foreground px-2">Estado</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.reviewedByReferee ? (
          <Badge variant="default" className="text-xs">
            <ShieldCheck size={12} className="mr-1.5" /> Revisado
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs">
            <ShieldAlert size={12} className="mr-1.5" /> Pendiente
          </Badge>
        )}
      </div>
    ),
    enableSorting: false, 
    meta: {
        headerClassName: "w-[130px] text-center",
        cellClassName: "text-center",
    }
  },
  {
    id: "actions",
    header: () => <div className="text-center font-medium text-muted-foreground px-2">Acciones</div>,
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => <DisqualificationActionCell row={row} />,
    meta: {
      headerClassName: "w-[120px] text-center",
      cellClassName: "text-center",
    }
  },
];