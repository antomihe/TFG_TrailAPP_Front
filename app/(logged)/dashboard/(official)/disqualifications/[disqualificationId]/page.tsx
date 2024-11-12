import { Head } from "@/components/layout";
import DisqualificationForm from "./components/DisqualificationForm";

export default function NewDisqualificationPage() {
    return (
        <>
            <Head title="Descalificaciones" subtitle="Partes de descalificación recibidos" />

            <DisqualificationForm />
        </>
    )
}
