// app\(logged)\dashboard\(federation)\events\validate\components\EventValidationRow.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; 
import { CheckCircle2, XCircle, Loader2, CalendarDays, MapPin, Route, ShieldCheck } from 'lucide-react'; 
import { dateFormatter } from '@/lib/utils';
import { ValidationEvent } from '@/hooks/api/dashboard/federation/useEventsValidation';

interface EventValidationRowProps {
  event: ValidationEvent;
  onValidate: (eventId: string) => Promise<boolean>;
  onDelete: (eventId: string) => Promise<boolean>;
  isSubmitting: boolean;
}

export const EventValidationRow: React.FC<EventValidationRowProps> = ({
  event,
  onValidate,
  onDelete,
  isSubmitting,
}) => {
  return (
    <TableRow className="hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors group">
      <TableCell className="py-3 px-3 sm:px-4 font-medium text-foreground min-w-[150px] sm:min-w-[200px] truncate">
        {event.name}
      </TableCell>
      <TableCell className="py-3 px-3 sm:px-4 text-muted-foreground tabular-nums min-w-[100px]">
        <div className="flex items-center text-xs sm:text-sm">
          <CalendarDays size={14} className="mr-1.5 opacity-70 hidden sm:inline-block" />
          {dateFormatter(new Date(event.date))}
        </div>
      </TableCell>
      <TableCell className="py-3 px-3 sm:px-4 text-muted-foreground min-w-[150px] sm:min-w-[200px] truncate">
         <div className="flex items-center text-xs sm:text-sm">
          <MapPin size={14} className="mr-1.5 opacity-70 hidden sm:inline-block flex-shrink-0" />
          <span className="truncate">{`${event.location}, ${event.province}`}</span>
        </div>
      </TableCell>
      <TableCell className="py-3 px-3 sm:px-4 text-muted-foreground min-w-[120px]">
        <div className="flex items-center text-xs sm:text-sm">
           <Route size={14} className="mr-1.5 opacity-70 hidden sm:inline-block" />
            <div className="flex flex-wrap gap-1">
            {event.distances.map((distance) => (
              <Badge key={distance} variant="outline" className="text-xs">{`${distance}km`}</Badge>
            ))}
            </div>
        </div>
      </TableCell>
      <TableCell className="py-3 px-3 sm:px-4 text-right min-w-[200px]">
        <div className="flex justify-end items-center space-x-2">
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : !event.validated ? (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onValidate(event.id)}
                    variant="outline"
                    size="icon" 
                    className="h-8 w-8 border-green-500 text-green-600 hover:bg-green-500/10 hover:text-green-700 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400/10 dark:hover:text-green-300"
                    aria-label={`Validar evento ${event.name}`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top"><p>Validar Evento</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onDelete(event.id)}
                    variant="outline"
                    size="icon" 
                    className="h-8 w-8 border-destructive text-destructive hover:bg-destructive/10"
                    aria-label={`Rechazar/Borrar evento ${event.name}`}
                  >
                    <XCircle className="h-4 w-4" /> 
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top"><p>Rechazar Evento</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Badge variant="default" className="text-xs py-1 px-2.5">
              <ShieldCheck size={14} className="mr-1.5" />
              Validado
            </Badge>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};