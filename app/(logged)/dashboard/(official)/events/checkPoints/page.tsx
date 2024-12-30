import { Head } from "@/components/layout";
import CheckPointsList from "./components/CheckPointsList";

export default function ControlListPage() {
    return (
        <>
            <Head title="Eventos" subtitle="Listados de controles de material" />

            <CheckPointsList />
        </>
    )
}
