// app\(logged)\dashboard\(official)\disqualifications\[disqualificationId]\components\DisqualificationDetailsCard.tsx
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; // Para el estado
import { timeFormatter } from '@/lib/utils';
import { DisqualificationDetails } from '@/hooks/api/dashboard/official/useDisqualificationDetails'; // Ajusta la ruta

interface DisqualificationDetailsCardProps {
  disqualification: DisqualificationDetails | null; 
}

export const DisqualificationDetailsCard: React.FC<DisqualificationDetailsCardProps> = ({ disqualification }) => {
  if (!disqualification || !disqualification.id) { 
    return null;
  }

  const getStatusBadge = () => {
    if (disqualification.status === 'APPROVED') {
        return <Badge variant="destructive">Atleta Descalificado</Badge>;
    }
    if (disqualification.status === 'REJECTED') {
        return <Badge variant="default">Parte Desestimado</Badge>;
    }
    if (disqualification.status === 'PENDING') {
        return <Badge variant="outline" className="bg-yellow-500 hover:bg-yellow-600 text-white">Parte Pendiente</Badge>;
    }
    return <Badge variant="outline" className="bg-gray-500 hover:bg-gray-600 text-white">Estado Desconocido: {disqualification.status}</Badge>;
  };

  return (
    <Card className="shadow-lg border dark:border-gray-700">
      <CardHeader className="border-b dark:border-gray-600">
        <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">Parte de Descalificación</CardTitle>
            {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="pt-6"> 
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Atleta</p>
            <p className="text-lg font-medium">
                {disqualification.athlete.name}
                {disqualification.athlete.dorsal && ` (Dorsal: ${disqualification.athlete.dorsal})`}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Razón</p>
            <p className="text-lg font-medium">{disqualification.reason}</p>
          </div>

          {disqualification.description && (
            <div>
                <p className="text-sm text-muted-foreground">Descripción Adicional</p>
                <p className="text-base whitespace-pre-wrap">{disqualification.description}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground">Juez Emisor</p>
            <p className="text-base">
              {disqualification.official.name}
              {disqualification.createdAt && ` - ${timeFormatter(disqualification.createdAt)}`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};