// app\(logged)\dashboard\(organizer)\events\enrollments\[eventId]\components\EnrollmentListControls.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, ListFilter, Loader2 } from 'lucide-react'; // Added icons

interface EnrollmentListControlsProps {
  onFilterNameOrBibChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterDistanceChange: (value: string) => void;
  selectedDistanceFilter: string;
  availableDistances: number[];
  onDownloadBibs: () => Promise<void>;
  onDownloadEnrollments: () => Promise<void>;
  isDownloading: boolean;
  filterNameOrBibValue: string;
}

export const EnrollmentListControls: React.FC<EnrollmentListControlsProps> = ({
  onFilterNameOrBibChange,
  onFilterDistanceChange,
  selectedDistanceFilter,
  availableDistances,
  onDownloadBibs,
  onDownloadEnrollments,
  isDownloading,
  filterNameOrBibValue,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 p-4 rounded-lg border dark:border-neutral-800 bg-card dark:bg-neutral-900/50 shadow">
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative w-full sm:w-auto sm:min-w-[220px] md:min-w-[280px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Filtrar por Nombre o Dorsal"
            className="pl-9 w-full h-10" // Adjusted padding for icon
            onChange={onFilterNameOrBibChange}
            value={filterNameOrBibValue}
            aria-label="Filtrar por nombre o dorsal"
          />
        </div>
        {availableDistances && availableDistances.length > 0 && (
          <div className="relative w-full sm:w-auto sm:min-w-[200px]">
            <Select
              value={selectedDistanceFilter || "all"}
              onValueChange={(value) => onFilterDistanceChange(value)}
            >
              <SelectTrigger className="h-10 w-full" aria-label="Filtrar por distancia">
                 <SelectValue placeholder="Filtrar por distancia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las distancias</SelectItem>
                {availableDistances
                  .sort((a, b) => a - b)
                  .map((distance) => (
                    <SelectItem key={distance} value={distance.toString()}>
                      {distance} km
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-4 md:mt-0">
        <Button
          className="w-full sm:w-auto"
          onClick={onDownloadBibs}
          disabled={isDownloading}
          variant="outline"
        >
          {isDownloading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Dorsales (PDF)
        </Button>
        <Button
          className="w-full sm:w-auto"
          onClick={onDownloadEnrollments}
          disabled={isDownloading}
          variant="outline"
        >
          {isDownloading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Inscritos (PDF)
        </Button>
      </div>
    </div>
  );
};