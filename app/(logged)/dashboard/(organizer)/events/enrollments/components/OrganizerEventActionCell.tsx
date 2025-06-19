// app\(logged)\dashboard\(organizer)\events\enrollments\components\OrganizerEventActionCell.tsx

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Users2 } from 'lucide-react'; 
import { Row } from '@tanstack/react-table';
import { OrganizerEvent } from '@/hooks/api/dashboard/organizer/useFetchOrganizerEventsData';

interface OrganizerEventActionCellProps {
  row: Row<OrganizerEvent>;
}

export const OrganizerEventActionCell: React.FC<OrganizerEventActionCellProps> = ({ row }) => {
  const router = useRouter();
  const event = row.original;

  const handleClick = () => {
    router.push(`/dashboard/events/enrollments/${event.id}`);
  };

  const handlePrefetch = () => {
    router.prefetch(`/dashboard/events/enrollments/${event.id}`);
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
              aria-label={`Gestionar inscripciones para ${event.name}`}
            >
              <Users2 className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Inscripciones</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="md:hidden" side="top">
            <p>Inscripciones</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};