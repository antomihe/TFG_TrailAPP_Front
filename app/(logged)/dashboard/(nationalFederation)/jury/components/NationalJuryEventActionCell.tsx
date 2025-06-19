// app\(logged)\dashboard\(nationalFederation)\jury\components\NationalJuryEventActionCell.tsx

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UsersRound } from 'lucide-react'; 
import { Row } from '@tanstack/react-table';
import { NationalJuryEvent } from '@/hooks/api/dashboard/nationalFederation/useFetchNationalJuryEventsData';

interface NationalJuryEventActionCellProps {
  row: Row<NationalJuryEvent>;
}

export const NationalJuryEventActionCell: React.FC<NationalJuryEventActionCellProps> = ({ row }) => {
  const router = useRouter();
  const event = row.original;

  const handleClick = () => {
    router.push(`/dashboard/national-federation/jury/${event.id}`); 
  };

  const handlePrefetch = () => {
    router.prefetch(`/dashboard/national-federation/jury/${event.id}`); 
  };

  return (
    <div className="flex justify-center"> 
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleClick}
              variant="ghost"
              size="icon" 
              className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-2.5 
                         text-primary hover:bg-primary/10"
              onMouseEnter={handlePrefetch}
              aria-label={`Asignar jurado nacional para ${event.name}`}
            >
              <UsersRound className="h-4 w-4" />
              <span className="hidden sm:inline ml-1.5 text-xs">Asignar Jurado</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="sm:hidden">
            <p>Asignar Jurado</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};