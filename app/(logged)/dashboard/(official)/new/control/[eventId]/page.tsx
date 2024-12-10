import { Head } from "@/components/layout";
import ControlForm from "./components/ControlForm";

export default function NewEventPage() {
    return (
        <>
            <Head title="Eventos" subtitle="Asignación de controles a un evento" />

            <ControlForm />
        </>
    )
}
