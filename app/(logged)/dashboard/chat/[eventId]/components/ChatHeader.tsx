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
    <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 p-3 sm:p-4 border-b dark:border-neutral-700 [--chat-header-h:auto] xs:[--chat-header-h:4.5rem] shrink-0">
      <H4 className="text-base sm:text-lg font-semibold truncate leading-tight">
        {eventName || "Chat del Evento"}
      </H4>
      <div className="text-xs sm:text-sm flex items-center self-end xs:self-center">
        <span className="mr-1.5 sm:mr-2 text-muted-foreground">Conexión:</span>
        <Badge
          variant={isConnected ? "default" : "destructive"}
          className={`text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 ${isConnected ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700" : ""}`}
        >
          {isConnected ? 'Conectado' : 'Desconectado'}
        </Badge>
      </div>
    </div>
  );
};