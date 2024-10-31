import { Head } from "@/components/layout";
import JuryForm from "./components/juryForm";

export default function EventJuryPage() {
    return (
        <>
            <Head title="Eventos" subtitle="Asignar jurado a evento" />

            <JuryForm />
        </>
    )
}
