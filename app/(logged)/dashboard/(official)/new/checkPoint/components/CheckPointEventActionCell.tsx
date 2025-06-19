// app\(logged)\dashboard\(official)\new\checkPoint\components\CheckPointEventActionCell.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; 
import { Settings2 } from 'lucide-react'; 
import { Row } from '@tanstack/react-table';
import { CheckPointEvent } from '@/hooks/api/dashboard/official/useFetchCheckPointEventsData';

interface CheckPointEventActionCellProps {
  row: Row<CheckPointEvent>;
}

export const CheckPointEventActionCell: React.FC<CheckPointEventActionCellProps> = ({ row }) => {
  const router = useRouter();
  const event = row.original;

  const handleClick = () => {
    router.push(`/dashboard/new/checkPoint/${event.id}`);
  };

  const handlePrefetch = () => {
    router.prefetch(`/dashboard/new/checkPoint/${event.id}`);
  };

  return (
    <div className="flex justify-center md:justify-end"> 
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleClick}
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0 md:h-auto md:w-auto md:px-3 md:py-1.5 border-transparent hover:border-primary/50 hover:bg-primary/10 text-primary"
              onMouseEnter={handlePrefetch}
              aria-label={`Gestionar puntos de control para ${event.name}`}
            >
              <Settings2 className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Gestionar</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="md:hidden" side="top">
            <p>Gestionar Puntos</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};