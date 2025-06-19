// app\(logged)\dashboard\chat\[eventId]\components\ChatHeader.tsx
'use client';

import React from 'react';
import { H4 } from '@/components/ui'; 
import { Badge } from '@/components/ui/badge'; 

interface ChatHeaderProps {
  eventName: string;
  isConnected: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ eventName, isConnected }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 px-1 sm:px-4 py-2 border-b dark:border-gray-700">
      <H4 className="text-lg font-semibold mb-2 sm:mb-0">{eventName || "Chat del Evento"}</H4>
      <div className="text-sm flex items-center">
        <span className="mr-2">Conexión:</span>
        <Badge variant={isConnected ? "default" : "destructive"} className={isConnected ? "bg-green-500 hover:bg-green-600" : ""}>
          {isConnected ? 'Conectado' : 'Desconectado'}
        </Badge>
      </div>
    </div>
  );
};