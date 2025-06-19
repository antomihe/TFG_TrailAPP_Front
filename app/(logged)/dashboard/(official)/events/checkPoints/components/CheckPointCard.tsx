// app\(logged)\dashboard\(official)\events\checkPoints\components\CheckPointCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { NotebookPen, Tag, Ruler, MapPin, Package, AlertCircle } from 'lucide-react';
import { CheckPointItem, CheckPointType, MaterialDetailsMap } from '@/hooks/api/dashboard/official/useCheckPointsData';

interface CheckPointCardProps {
  checkPoint: CheckPointItem;
  materialDetails: MaterialDetailsMap;
  isLoadingMaterial: boolean;
}

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="mr-2 text-primary">{children}</span>
);

export const CheckPointCard: React.FC<CheckPointCardProps> = ({
  checkPoint,
  materialDetails,
  isLoadingMaterial,
}) => {
  const getMaterialDisplayString = () => {
    if (checkPoint.material.length === 0) return <span className="italic text-muted-foreground">Ninguno</span>;
    return checkPoint.material
      .map(id => materialDetails[id] || <span className="text-xs px-1.5 py-0.5 bg-destructive/10 text-destructive rounded-sm inline-flex items-center"><AlertCircle size={12} className="mr-1"/> ID: {id}</span>)
      .reduce((acc, curr, index, arr) => {
        acc.push(curr);
        if (index < arr.length - 1) {
          acc.push(<span key={`sep-${index}`}>, </span>);
        }
        return acc;
      }, [] as React.ReactNode[]);
  };

  return (
    <Card className="relative border shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.02] dark:border-gray-700 group">
      <Link href={`/dashboard/events/checkPoints/${checkPoint.id}`} passHref>
        <div className="block cursor-pointer"> 
          <CardHeader className="border-b bg-gray-50 dark:bg-gray-800 rounded-t-lg group-hover:bg-gray-100 dark:group-hover:bg-gray-700/60 transition-colors">
            <CardTitle className="text-lg font-semibold text-primary truncate">
              {checkPoint.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-sm">
            <p className="flex items-center">
              <IconWrapper><Tag size={16} /></IconWrapper>
              <span className="font-semibold text-muted-foreground mr-1.5">Tipo:</span>
              {checkPoint.type}
            </p>
            <p className="flex items-center">
              <IconWrapper><Ruler size={16} /></IconWrapper>
              <span className="font-semibold text-muted-foreground mr-1.5">Distancias:</span>
              {checkPoint.distances.join(', ')} km
            </p>
            {(checkPoint.type === CheckPointType.CONTROL || checkPoint.type === CheckPointType.LIFEBAG) && checkPoint.kmPosition !== undefined && (
              <p className="flex items-center">
                <IconWrapper><MapPin size={16} /></IconWrapper>
                <span className="font-semibold text-muted-foreground mr-1.5">Punto kilométrico:</span>
                {checkPoint.kmPosition} km
              </p>
            )}
            <div className="flex items-start">
              <IconWrapper><Package size={16} className="mt-0.5"/></IconWrapper>
              <div className="flex-1">
                <span className="font-semibold text-muted-foreground mr-1.5">Material:</span>
                {isLoadingMaterial && checkPoint.material.length > 0 ? (
                  <Skeleton className="ml-1 h-5 w-3/4 inline-block" />
                ) : (
                  <span>{getMaterialDisplayString()}</span>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Link>
      <Button
        asChild
        variant="outline"
        size="icon"
        className="p-2 absolute top-3 right-3 w-9 h-9 bg-background/80 hover:bg-background  border-primary/30 hover:border-primary text-primary rounded-full z-10 opacity-80 group-hover:opacity-100 transition-opacity"
        aria-label={`Gestionar punto de control ${checkPoint.name}`}
      >
        <Link href={`/dashboard/events/checkPoints/${checkPoint.id}`}>
          <NotebookPen size={18} />
        </Link>
      </Button>
    </Card>
  );
};