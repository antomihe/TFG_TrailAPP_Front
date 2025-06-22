// app\(unlogged)\events\components\EventBentoCard.tsx


'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, CalendarDays, ArrowRight } from 'lucide-react';
import { BentoGridItem } from '@/components/ui/bento-grid';
import { MapHeader } from '@/components/ui/map-header';
import { H4, P, Small } from '@/components/ui/typography'; 
import { dateToText } from '@/lib/utils'; 
import { PublicEvent } from '@/hooks/api/unlogged/events/usePublicEvents';
import { Badge } from '@/components/ui/badge'; 

interface EventBentoCardProps {
    event: PublicEvent;
}

export const EventBentoCard: React.FC<EventBentoCardProps> = ({ event }) => {
    return (
        <BentoGridItem
            key={event.id}
            className="group/bento flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 dark:border-neutral-800 dark:hover:border-primary/50"
            header={
                <div className="relative h-40 sm:h-48 md:h-full overflow-hidden"> 
                    <MapHeader latitude={event.latitude} longitude={event.longitude} zoom={9} />
                </div>
            }
            icon={null} 
            title={null}  
            description={
                <div className="p-4 flex flex-col flex-grow justify-between">
                    <div>
                        <div className="flex items-center text-xs text-muted-foreground mb-1.5">
                            <MapPin className="h-3.5 w-3.5 mr-1.5 opacity-80" />
                            <span>{event.location} - {event.province}</span>
                        </div>
                        <Link href={`/events/${event.id}`} className="block focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">
                            <H4 className="mb-1 text-base font-semibold leading-tight text-foreground transition-colors group-hover/bento:text-primary dark:group-hover/bento:text-primary">
                                {event.name}
                            </H4>
                        </Link>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5 mr-1.5 opacity-80" />
                            <Small className="transition-colors">
                                {dateToText(event.date)} 
                            </Small>
                        </div>
                    </div>
                    <div className="mt-4">
                         <Link href={`/events/${event.id}`} className="w-full inline-flex items-center justify-center">
                            <Badge
                                variant="default"
                                className="w-full justify-center text-xs py-1.5 px-3 transition-transform duration-200 group-hover/bento:scale-[1.03] group-hover/bento:bg-primary/90"
                            >
                                Ver Detalles del Evento
                                <ArrowRight size={14} className="ml-2 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300 transform group-hover/bento:translate-x-1" />
                            </Badge>
                        </Link>
                    </div>
                </div>
            }
        />
    );
};