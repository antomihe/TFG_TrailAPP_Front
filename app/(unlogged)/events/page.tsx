'use client';

import { H1, Lead } from "@/components/ui";
import { MapHeader } from "@/components/ui/map-header";
import { EventsList } from "./components/EventsList";



export default function EventsPublicPage() {

      
  return (
    <div className="h-screen w-full px-10">
      <H1 className="mt-5">Eventos</H1>
      <Lead className="mb-5">Ver los próximos eventos</Lead>

      <EventsList />
      
    </div>
  )
}

