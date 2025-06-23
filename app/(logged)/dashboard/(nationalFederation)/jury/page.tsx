// app\(logged)\dashboard\(nationalFederation)\jury\page.tsx
import { Head } from "@/components/layout"
import EventsJuryList from "./components/EventJuryList"

export default function EventsJuryPage() {
    return (
        <>
            <Head title="Eventos" subtitle="Asignación de Jurado Nacional" />

            <EventsJuryList />
        </>
    )
}