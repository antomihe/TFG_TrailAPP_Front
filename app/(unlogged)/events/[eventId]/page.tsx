// app\(unlogged)\events\[eventId]\page.tsx

'use client';

import { Head } from "@/components/layout";
import RaceStatusView from "./components/RaceStatusView";

export default function EventPage() {
    return (
        <div className="w-full h-min-[500px] px-4 sm:px-6 lg:px-10" style={{ alignSelf: "flex-start" }}>
            <Head title="Estado de Carrera" subtitle="Resultados y seguimiento en directo del evento" />
            <RaceStatusView />
        </div>

    );
}