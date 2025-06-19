// app\(logged)\dashboard\(organizer)\events\enrollments\page.tsx
import { Head } from "@/components/layout";
import EventsOrganizerList from "./components/EventOrganizerList";

export default function NewEventPage() {
    return (
        <>
            <Head title="Eventos" subtitle="Inscripciones por evento" />
            <EventsOrganizerList />
        </>
    )
}
