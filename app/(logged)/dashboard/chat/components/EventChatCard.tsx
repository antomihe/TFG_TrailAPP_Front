// app\(logged)\dashboard\chat\components\EventChatCard.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; 
import { useRouter } from 'next/navigation';
import { EventForChatList } from '@/hooks/api/dashboard/chat/useChatList';
import { CalendarDays, MapPin, MessageSquare, ArrowRight } from 'lucide-react'; 

interface EventChatCardProps {
  event: EventForChatList;
}

export const EventChatCard: React.FC<EventChatCardProps> = ({ event }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/dashboard/chat/${event.id}`);
  };

  return (
    <Card
      className="group flex flex-col justify-between h-full overflow-hidden rounded-lg border shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:border-primary/50 dark:border-neutral-800 dark:hover:border-primary/70 bg-card"
      
    >
      <div>
        <CardHeader className="pb-3 border-b dark:border-neutral-700/70 group-hover:bg-muted/30 dark:group-hover:bg-muted/10 transition-colors">
          <CardTitle className="text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors truncate">
            {event.name}
          </CardTitle>
          <CardDescription className="flex items-center text-xs pt-1">
            <CalendarDays size={14} className="mr-1.5 opacity-70" />
            {new Date(event.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-1.5 text-sm">
          <div className="flex items-start">
            <MapPin size={15} className="mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
            <p className="text-muted-foreground">
              {event.location}, {event.province}
            </p>
          </div>
        </CardContent>
      </div>

      <CardFooter className="pt-3 pb-4 mt-auto">
        <Button
          onClick={handleCardClick}
          variant="default" 
          size="sm"
          className="w-full"
          aria-label={`Abrir chat para ${event.name}`}
        >
          <MessageSquare size={16} className="mr-2" />
          Abrir Chat
          <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};