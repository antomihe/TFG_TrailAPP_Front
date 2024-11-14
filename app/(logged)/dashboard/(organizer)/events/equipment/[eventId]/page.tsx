import { Head } from "@/components/layout";
import EquipmentForm from "./components/EquipmentForm";

export default function NewEventPage() {
    return (
        <>
            <Head title="Eventos" subtitle="Asignación de material a un evento" />

            <EquipmentForm />
        </>
    )
}
