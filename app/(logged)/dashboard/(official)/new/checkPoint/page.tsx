import { Head } from "@/components/layout";
import EventChecklist from "./components/EventCheckList";

export default function ControlListPage() {
    return (
        <>
            <Head title="Eventos" subtitle="Asignación de puntos de control de material" />

            <EventChecklist />
        </>
    )
}
