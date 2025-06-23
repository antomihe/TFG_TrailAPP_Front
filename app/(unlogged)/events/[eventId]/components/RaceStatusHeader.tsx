// app\(unlogged)\events\[eventId]\components\RaceStatusHeader.tsx
// app/(unlogged)/events/[eventId]/components/RaceStatusHeader.tsx
'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Wifi, WifiOff } from 'lucide-react';

interface RaceStatusHeaderProps {
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isConnected: boolean;
  socketError: string | null;
  filterValue: string;
}

export const RaceStatusHeader: React.FC<RaceStatusHeaderProps> = ({
  onFilterChange,
  isConnected,
  socketError,
  filterValue,
}) => {
  return (
    <div className="p-4 md:p-5 rounded-lg border bg-card dark:border-neutral-800 dark:bg-neutral-900/50 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:max-w-xs md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                  type="text"
                  placeholder="Filtrar por Nombre o Dorsal..."
                  className="pl-10 w-full h-11 text-base" 
                  onChange={onFilterChange}
                  value={filterValue}
                  aria-label="Filtrar por nombre o dorsal"
              />
            </div>
            <div className="flex items-center gap-2 self-center sm:self-auto">
                {isConnected ? (
                    <Wifi size={20} className="text-green-500 animate-pulse" />
                ) : (
                    <WifiOff size={20} className="text-destructive" />
                )}
                <Badge
                  variant={isConnected ? "default" : "destructive"}
                  className={`text-sm px-2 py-1.5 ${isConnected ? "bg-green-500 hover:bg-green-600 text-white" : ""}`}
                >
                    {isConnected ? "En Directo" : "Desconectado"}
                </Badge>
            </div>
        </div>
        {socketError && !isConnected && (
            <p className="text-sm text-destructive mt-3 text-center sm:text-right">
                Error de conexión: {socketError}
            </p>
        )}
    </div>
  );
};