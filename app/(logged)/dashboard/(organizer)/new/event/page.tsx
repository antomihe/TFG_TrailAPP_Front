import { Head } from "@/components/layout";
import NewEventForm from "./components/newEventForm";

export default function NewEventPage() {
    return (
        <>
            <Head title="Eventos" subtitle="Crea un nuevo evento" />

            <NewEventForm />
        </>
    )
}
