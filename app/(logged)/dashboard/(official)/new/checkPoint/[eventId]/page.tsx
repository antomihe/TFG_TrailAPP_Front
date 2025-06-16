import { Head } from "@/components/layout";
import { CheckPointForm } from "./components/CheckPointForm";

export default function NewEventPage() {
    return (
        <>
            <Head title="Eventos" subtitle="Asignación de controles a un evento" />

            <CheckPointForm />
        </>
    )
}
