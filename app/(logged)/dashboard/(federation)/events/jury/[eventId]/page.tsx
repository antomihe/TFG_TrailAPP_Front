// app\(logged)\dashboard\(federation)\events\jury\[eventId]\page.tsx
import { Head } from "@/components/layout";
import JuryForm from "./components/JuryForm";

export default function EventJuryPage() {
    return (
        <>
            <Head title="Eventos" subtitle="Asignar jurado a evento" />

            <JuryForm />
        </>
    )
}
