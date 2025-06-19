// app\(logged)\dashboard\(organizer)\events\equipment\components\OrganizerEquipmentEventActionCell.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PackagePlus } from 'lucide-react'; 
import { Row } from '@tanstack/react-table';
import { OrganizerEquipmentEvent } from '@/hooks/api/dashboard/organizer/useFetchOrganizerEquipmentEventsData';

interface OrganizerEquipmentEventActionCellProps {
  row: Row<OrganizerEquipmentEvent>;
}

export const OrganizerEquipmentEventActionCell: React.FC<OrganizerEquipmentEventActionCellProps> = ({ row }) => {
  const router = useRouter();
  const event = row.original;

  const handleClick = () => {
    router.push(`/dashboard/events/equipment/${event.id}`);
  };

  const handlePrefetch = () => {
    router.prefetch(`/dashboard/events/equipment/${event.id}`);
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
              aria-label={`Gestionar material para ${event.name}`}
            >
              <PackagePlus className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Material</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="md:hidden" side="top">
            <p>Gestionar Material</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};