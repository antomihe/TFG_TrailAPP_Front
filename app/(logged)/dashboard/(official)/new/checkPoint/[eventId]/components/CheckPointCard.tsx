// app/(logged)/dashboard/(official)/new/checkPoint/[eventId]/components/CheckPointCard.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; 
import { X, Tag, Ruler, MapPin, Package, AlertCircle, Loader2, Edit3 } from 'lucide-react'; 
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge'; 

import { toast } from 'sonner';
import { CheckPointItem, CheckPointType, MaterialItem } from '@/hooks/api/dashboard/official/useEventCheckPointsManager';

interface CheckPointCardProps {
  checkPoint: CheckPointItem;
  availableMaterial: MaterialItem[];
  onDelete: (id: string) => Promise<boolean>;
  isDeleting: boolean;
  // onEdit?: (checkPoint: CheckPointItem) => void; 
}

const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <span className={`mr-2 text-muted-foreground ${className}`}>{children}</span>
);

export const CheckPointCard: React.FC<CheckPointCardProps> = ({
  checkPoint,
  availableMaterial,
  onDelete,
  isDeleting,
  // onEdit, 
}) => {
  const [isCurrentlyDeleting, setIsCurrentlyDeleting] = React.useState(false);

  const getMaterialDisplayString = () => {
    if (!checkPoint.material || checkPoint.material.length === 0) {
      return <span className="italic text-muted-foreground">Ninguno</span>;
    }
    return checkPoint.material
      .map((materialId: string) => {
        const materialInfo: MaterialItem | undefined = availableMaterial.find((m: MaterialItem) => m.id === materialId);
        return materialInfo ? materialInfo.name : (
          <span key={materialId} className="inline-flex items-center text-xs px-1.5 py-0.5 bg-destructive/10 text-destructive rounded-sm">
            <AlertCircle size={12} className="mr-1"/> ID: {materialId} (desconocido)
          </span>
        );
      })
      .reduce((acc, curr, index, arr) => {
        acc.push(curr);
        if (index < arr.length - 1) {
          acc.push(<span key={`sep-${index}`}>, </span>);
        }
        return acc;
      }, [] as React.ReactNode[]);
  };

  const handleDeleteClick = async () => {
    if (!checkPoint.id) {
      toast.error("No se puede eliminar el punto de control: ID no encontrado.");
      return;
    }
    setIsCurrentlyDeleting(true);
    try {
      const success = await onDelete(checkPoint.id);
      if (success) {
        toast.success(`Punto de control "${checkPoint.name}" eliminado.`);
      } else {
        toast.error(`No se pudo eliminar el punto de control "${checkPoint.name}".`);
      }
    } catch (error) {
      toast.error("Error al eliminar el punto de control.");
      console.error("Delete failed:", error);
    } finally {
      setIsCurrentlyDeleting(false);
    }
  };

  const cardDisabled = isCurrentlyDeleting || isDeleting;

  return (
    <Card className={`border shadow-sm dark:border-neutral-800 flex flex-col h-full transition-opacity ${cardDisabled ? 'opacity-70 pointer-events-none' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base font-semibold leading-tight">{checkPoint.name}</CardTitle>
          {checkPoint.id && (
            <Button
              onClick={handleDeleteClick}
              variant="ghost"
              size="icon"
              className="p-1 w-7 h-7 text-destructive hover:bg-destructive/10 flex-shrink-0 rounded-full"
              disabled={cardDisabled}
              aria-label={`Eliminar ${checkPoint.name}`}
            >
              {isCurrentlyDeleting ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
            </Button>
          )}
        </div>
        <CardDescription className="pt-1">
          <Badge variant="outline" className="text-xs">
            <Tag size={12} className="mr-1.5" /> {checkPoint.type}
          </Badge>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-1.5 text-sm pt-0 flex-grow">
        <p className="flex items-center">
          <IconWrapper><Ruler size={14} /></IconWrapper>
          <span className="font-medium text-muted-foreground mr-1">Distancias:</span>
          {checkPoint.distances.join(', ')} km
        </p>
        {(checkPoint.type === CheckPointType.CONTROL || checkPoint.type === CheckPointType.LIFEBAG) && checkPoint.kmPosition !== undefined && (
          <p className="flex items-center">
            <IconWrapper><MapPin size={14} /></IconWrapper>
            <span className="font-medium text-muted-foreground mr-1">P. Kilométrico:</span>
            {checkPoint.kmPosition} km
          </p>
        )}
        <div className="flex items-start">
          <IconWrapper className="mt-0.5"><Package size={14} /></IconWrapper>
          <div>
            <span className="font-medium text-muted-foreground mr-1">Material:</span>
            {getMaterialDisplayString()}
          </div>
        </div>
      </CardContent>

      {/* {onEdit && checkPoint.id && ( // Uncomment if you plan to add edit functionality
        <CardFooter className="pt-3 pb-3 border-t dark:border-neutral-700 mt-auto">
          <Button variant="outline" size="sm" onClick={() => onEdit(checkPoint)} className="w-full" disabled={cardDisabled}>
            <Edit3 size={14} className="mr-2" /> Editar
          </Button>
        </CardFooter>
      )} */}
    </Card>
  );
};