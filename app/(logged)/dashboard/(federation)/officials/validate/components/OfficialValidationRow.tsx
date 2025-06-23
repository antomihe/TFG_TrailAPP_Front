// app\(logged)\dashboard\(federation)\officials\validate\components\OfficialValidationRow.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2, Mail, User, Shield, ShieldCheck } from 'lucide-react'; 
import { Official } from '@/hooks/api/dashboard/federation/useOfficialValidation';

interface OfficialValidationRowProps {
  official: Official;
  onValidate: (officialId: string) => Promise<boolean>;
  onDelete: (officialId: string) => Promise<boolean>;
  isSubmitting: boolean;
}

export const OfficialValidationRow: React.FC<OfficialValidationRowProps> = ({
  official,
  onValidate,
  onDelete,
  isSubmitting,
}) => {
  return (
    <TableRow className="hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors group">
      <TableCell className="py-3 px-3 sm:px-4 text-muted-foreground min-w-[180px] sm:min-w-[220px] truncate">
        <div className="flex items-center text-xs sm:text-sm">
          <Mail size={14} className="mr-1.5 opacity-70 hidden sm:inline-block flex-shrink-0" />
          <span className="truncate">{official.email}</span>
        </div>
      </TableCell>
      <TableCell className="py-3 px-3 sm:px-4 font-medium text-foreground min-w-[150px] sm:min-w-[200px] truncate">
        <div className="flex items-center text-xs sm:text-sm">
          <User size={14} className="mr-1.5 opacity-70 hidden sm:inline-block flex-shrink-0" />
          <span className="truncate">{official.fullName}</span>
        </div>
      </TableCell>
      <TableCell className="py-3 px-3 sm:px-4 text-muted-foreground min-w-[100px] sm:min-w-[120px]">
        <div className="flex items-center text-xs sm:text-sm">
          <Shield size={14} className="mr-1.5 opacity-70 hidden sm:inline-block flex-shrink-0" />
          <span className="truncate">{official.license || 'N/A'}</span>
        </div>
      </TableCell>
      <TableCell className="py-3 px-3 sm:px-4 text-right min-w-[120px]"> 
        <div className="flex justify-end items-center space-x-2">
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : !official.validatedByFederation ? (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onValidate(official.id)}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-green-500 text-green-600 hover:bg-green-500/10 hover:text-green-700 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400/10 dark:hover:text-green-300"
                    aria-label={`Validar juez ${official.fullName}`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top"><p>Validar Juez</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onDelete(official.id)}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-destructive text-destructive hover:bg-destructive/10"
                    aria-label={`Rechazar/Borrar juez ${official.fullName}`}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top"><p>Rechazar Juez</p></TooltipContent>
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