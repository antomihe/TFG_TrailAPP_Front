// app(logged)/dashboard(organizer)/events/enrollments/components/OrganizerEventsTableControls.tsx
'use client';

import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import { Table as ReactTableType } from '@tanstack/react-table';

interface OrganizerEventsTableControlsProps<TData> {
  table: ReactTableType<TData>;
  filterValue: string;
  onFilterChange: (value: string) => void;
}

const columnIdToName = (id: string): string => {
    switch (id) {
        case "date": return "Fecha";
        case "location": return "Localidad";
        case "province": return "Provincia";
        case "validated": return "Validado"; 
        case "distances": return "Distancias";
        default: return id;
    }
};

export function OrganizerEventsTableControls<TData>({ 
    table,
    filterValue,
    onFilterChange
}: OrganizerEventsTableControlsProps<TData>) {
  return (
    <div className="flex items-center justify-between py-4 space-x-4 mx-2">
      <Input
        placeholder="Filtrar por nombre de evento..."
        value={filterValue}
        onChange={(event) => onFilterChange(event.target.value)}
        className="max-w-sm"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Columnas <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table.getAllColumns().filter(column => column.getCanHide()).map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {columnIdToName(column.id)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}