'use client';

import { H1, Lead } from "@/components/ui";
import { EventsList } from "./components/EventsList";



export default function EventsPublicPage() {


  return (
    <div className="w-full px-10  ">
      <div className="text-center">
        <H1 className="mt-5">Eventos</H1>
        <Lead className="mb-5">Ver los próximos eventos</Lead>
      </div>

      <EventsList />
    </div>
  )
}

