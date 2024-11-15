import { Head } from "@/components/layout";
import ControlList from "./components/ControlList";

export default function NewEventPage() {
    return (
        <>
            <Head title="Eventos" subtitle="Asignación de controles de material" />

            <ControlList />
        </>
    )
}
