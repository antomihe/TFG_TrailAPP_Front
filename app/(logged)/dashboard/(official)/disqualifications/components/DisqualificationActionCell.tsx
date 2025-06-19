// app\(logged)\dashboard\(official)\disqualifications\components\DisqualificationActionCell.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, ShieldCheck, Edit3, Flag } from 'lucide-react'; 
import { Row } from '@tanstack/react-table';
import { DisqualificationData } from '@/hooks/api/dashboard/official/useFetchDisqualificationsData';

interface DisqualificationActionCellProps {
  row: Row<DisqualificationData>;
}

export const DisqualificationActionCell: React.FC<DisqualificationActionCellProps> = ({ row }) => {
  const router = useRouter();
  const disqualification = row.original;

  const isReviewed = disqualification.reviewedByReferee;
  const actionText = isReviewed ? 'Ver Detalle' : 'Resolver';
  const Icon = isReviewed ? Eye : Edit3; 

  const handleClick = () => {
    router.push(`/dashboard/disqualifications/${disqualification.id}`);
  };

  const handlePrefetch = () => {
    router.prefetch(`/dashboard/disqualifications/${disqualification.id}`);
  };

  return (
    <div className="flex justify-center md:justify-end">
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleClick}
              variant={isReviewed ? "ghost" : "outline"} 
              size="sm"
              className={`h-9 w-9 p-0 md:h-auto md:w-auto md:px-3 md:py-1.5 
                          ${isReviewed 
                            ? 'text-primary hover:bg-primary/10 border-transparent hover:border-primary/50' 
                            : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                          }`}
              onMouseEnter={handlePrefetch}
              aria-label={`${actionText} descalificación de ${disqualification.athlete.name}`}
            >
              <Icon className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">{actionText}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="md:hidden" side="top">
            <p>{actionText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};