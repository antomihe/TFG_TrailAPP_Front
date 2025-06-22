// app\(logged)\dashboard\(nationalFederation)\jury\[eventId]\page.tsx
import { Head } from "@/components/layout";
import JuryForm from "./components/NationalJuryForm";

export default function EventJuryPage() {
    return (
        <>
            <Head title="Eventos" subtitle="Asignar jurado a evento" />

            <JuryForm />
        </>
    )
}
