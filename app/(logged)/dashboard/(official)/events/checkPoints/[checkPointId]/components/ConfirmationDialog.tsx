// app(logged)/dashboard(official)/new/checkPoint/[checkPointId]/components/ConfirmationDialog.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void; 
  title?: string;
  description?: string;
  isSubmitting?: boolean; 
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title = "¿Estás seguro?",
  description = "Algunos materiales obligatorios no han sido seleccionados. ¿Deseas continuar igualmente?",
  isSubmitting = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription className="pt-2">{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button disabled={isSubmitting} variant="outline" onClick={onCancel}> 
            Cancelar
          </Button>
          <Button disabled={isSubmitting} variant="default" onClick={onConfirm}>
            {isSubmitting ? "Confirmando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};