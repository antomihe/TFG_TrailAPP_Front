// app/(unlogged)/events/components/EventBentoCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, CalendarDays, ArrowRight } from 'lucide-react';
import { BentoGridItem } from '@/components/ui/bento-grid'; // Assuming this is your custom bento grid item
import { MapHeader } from '@/components/ui/map-header'; // Assuming this is your map component
import { H4, P, Small } from '@/components/ui/typography';
import { dateToText } from '@/lib/utils';
import { PublicEvent } from '@/hooks/api/unlogged/events/usePublicEvents'; // Assuming type path is correct
import { Badge } from '@/components/ui/badge';

interface EventBentoCardProps {
    event: PublicEvent;
}

export const EventBentoCard: React.FC<EventBentoCardProps> = ({ event }) => {
    return (
        <BentoGridItem
            key={event.id}
            className="group/bento flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/40 dark:border-neutral-800 dark:hover:border-primary/50"
            header={
                // Adjusted map height for better balance on mobile, sm and up gets more space
                <div className="relative h-36 xs:h-40 sm:h-48 md:h-full overflow-hidden">
                    <MapHeader latitude={event.latitude} longitude={event.longitude} zoom={9} />
                </div>
            }
            icon={null}
            title={null}
            description={
                // Padding adjusted slightly for mobile for more breathing room
                <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
                    {/* Top content block */}
                    <div>
                        {/* Location */}
                        <div className="flex items-center text-xs text-muted-foreground mb-1 sm:mb-1.5">
                            <MapPin className="h-3.5 w-3.5 mr-1.5 opacity-75 shrink-0" />
                            {/* Truncate text if it gets too long, especially on mobile */}
                            <span className="truncate">{event.location} - {event.province}</span>
                        </div>

                        {/* Event Name Link */}
                        <Link
                            href={`/events/${event.id}`}
                            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                            aria-label={`Ver detalles de ${event.name}`}
                        >
                            {/* Slightly larger title on mobile for emphasis, consistent leading */}
                            <H4 className="mb-1 text-[0.95rem] sm:text-base font-semibold leading-tight text-foreground transition-colors group-hover/bento:text-primary dark:group-hover/bento:text-primary">
                                {event.name}
                            </H4>
                        </Link>

                        {/* Date */}
                        <div className="flex items-center text-xs text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5 mr-1.5 opacity-75 shrink-0" />
                            <Small className="transition-colors">
                                {dateToText(event.date)}
                            </Small>
                        </div>
                    </div>

                    {/* Bottom action button, more pronounced on mobile */}
                    <div className="mt-3 sm:mt-4">
                        <Link href={`/events/${event.id}`} className="w-full inline-flex items-center justify-center">
                            <Badge
                                variant="default" // Could be 'default' or 'primary' if you have one
                                className="w-full justify-center text-xs font-medium py-2 sm:py-1.5 px-3 transition-all duration-200 group-hover/bento:scale-[1.03] group-hover/bento:bg-primary/90 active:scale-95"
                            >
                                Ver Detalles
                                <ArrowRight size={14} className="ml-1.5 sm:ml-2 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300 transform group-hover/bento:translate-x-1" />
                            </Badge>
                        </Link>
                    </div>
                </div>
            }
        />
    );
};