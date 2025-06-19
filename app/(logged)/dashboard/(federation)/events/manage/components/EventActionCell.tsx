// app\(logged)\dashboard\(federation)\events\manage\components\EventActionCell.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pencil, Trash2, Loader2 } from 'lucide-react'; 
import { Row } from '@tanstack/react-table';
import { ManagerEvent } from '@/hooks/api/dashboard/federation/useFetchManagerEventsData';

interface ManagerEventActionCellProps {
  row: Row<ManagerEvent>;
  onDelete: (eventId: string) => Promise<void>;
  isSending: boolean;
}

export const ManagerEventActionCell: React.FC<ManagerEventActionCellProps> = ({ row, onDelete, isSending }) => {
  const router = useRouter();
  const event = row.original;

  const [isDeletingThisRow, setIsDeletingThisRow] = React.useState(false);

  const handleDeleteClick = async () => {
    setIsDeletingThisRow(true);
    await onDelete(event.id);
    
  };

  const handleEditClick = () => {
    router.push(`/dashboard/events/manage/${event.id}`);
  };
  
  const prefetchEdit = () => {
     router.prefetch(`/dashboard/events/manage/${event.id}`);
  }

  const currentActionIsForThisRow = isSending && isDeletingThisRow; 

  return (
    <div className="flex space-x-1 sm:space-x-2 justify-center sm:justify-end">
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleEditClick}
              variant="outline"
              size="icon"
              className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-2.5 border-blue-500 text-blue-600 hover:bg-blue-500/10 hover:text-blue-700 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400/10 dark:hover:text-blue-300"
              disabled={isSending} 
              onMouseEnter={prefetchEdit}
              aria-label={`Editar evento ${event.name}`}
            >
              <Pencil className="h-4 w-4" />
              <span className="hidden sm:inline ml-1.5 text-xs">Editar</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="sm:hidden"><p>Editar</p></TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleDeleteClick}
              variant="outline" 
              size="icon"
              className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-2.5 border-destructive text-destructive hover:bg-destructive/10"
              disabled={isSending} 
              aria-label={`Borrar evento ${event.name}`}
            >
              {currentActionIsForThisRow ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span className="hidden sm:inline ml-1.5 text-xs">Borrar</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="sm:hidden"><p>Borrar</p></TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};