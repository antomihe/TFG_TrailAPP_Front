'use client';

import api from "@/config/api";
import { useEffect, useState } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { MapPin } from "lucide-react";
import { MapHeader } from "@/components/ui/map-header";
import { Large, H4, Small, Skeleton } from "@/components/ui";
import { dateToText } from "@/lib/utils";
import Link from "next/link";



export function EventsList() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {

        const fetchEvents = async () => {
            setLoading(true);
            try {
                const res = await api().get("/events");
                setEvents(res.data);
            } catch (error) {
                setError('Error fetching events');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <BentoGrid>
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="flex flex-col space-y-4 p-4 bg-card rounded-xl border border-transparent shadow-input dark:shadow-none group/bento">
                        <Skeleton className="min-h-32 w-full mb-2" />

                        <div className="flex items-center space-x-2 mb-2">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                        </div>

                        <Skeleton className="h-3 w-1/2" />
                    </div>
                ))}
            </BentoGrid>
        )
    }

    return (
        <>
            {error && <div>{error}</div>}
            {events.length === 0 ? <div>No hay eventos</div> : null}


            <BentoGrid className="mx-auto md:auto-rows-[20rem]">
                {events.map((item, i) =>
                    <BentoGridItem
                        key={i}
                        header={<MapHeader coordinates={item.coordinates} />}
                        title={
                            <Link
                                href={`https://www.google.com/maps?q=${item.coordinates[0]},${item.coordinates[1]}&ll=${item.coordinates[0]},${item.coordinates[1]}&z=12`}
                                key={i}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Large>{item.location} - {item.province}</Large>
                            </Link>
                        }

                        icon={<MapPin />}
                        description={
                            <Link href={`/events/${item.id}`} key={i}>
                                <H4>{item.name} </H4>
                                <Small className="text-primary">{dateToText(item.date)}</Small>
                            </Link>
                        }
                        coordinates={item.coordinates}
                    />
                )}
            </BentoGrid>

        </>
    );
}
