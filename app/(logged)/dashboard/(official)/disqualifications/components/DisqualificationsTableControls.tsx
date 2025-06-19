// app\(logged)\dashboard\(official)\disqualifications\components\DisqualificationsTableControls.tsx
'use client';

import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SlidersHorizontal, Search } from 'lucide-react';
import { Table as ReactTableType } from '@tanstack/react-table';

interface DisqualificationsTableControlsProps<TData> {
  table: ReactTableType<TData>;
  filterInput: string;
  onFilterInputChange: (value: string) => void;
}

const columnIdToName = (id: string): string => {
  const nameMap: Record<string, string> = {
    "athlete.name": "Atleta", 
    "official.name": "Juez",
    reason: "Razón",
    time: "Hora",
    status: "Estado",
    actions: "Acciones",
  };
  return nameMap[id] || id.charAt(0).toUpperCase() + id.slice(1);
};

export function DisqualificationsTableControls<TData>({
  table,
  filterInput,
  onFilterInputChange
}: DisqualificationsTableControlsProps<TData>) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4 px-1 md:px-2">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filtrar por atleta o juez..."
          value={filterInput}
          onChange={(e) => onFilterInputChange(e.target.value)}
          className="pl-9 w-full"
          aria-label="Filtrar descalificaciones por atleta o juez"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Columnas
            <ChevronDown className="ml-auto sm:ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Mostrar/Ocultar Columnas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table.getAllColumns().filter(column => column.getCanHide()).map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
              className="capitalize"
            >
              {columnIdToName(column.id)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}