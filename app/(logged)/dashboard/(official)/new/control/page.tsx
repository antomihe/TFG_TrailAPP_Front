import { Head } from "@/components/layout";
import ControlList from "./components/ControlList";

export default function ControlListPage() {
    return (
        <>
            <Head title="Eventos" subtitle="Asignación de controles de material" />

            <ControlList />
        </>
    )
}
