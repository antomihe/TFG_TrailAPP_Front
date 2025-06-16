import { Head } from "@/components/layout";
import EnrollmentList from "./components/EnrollmentsList";

export default function NewEventPage() {
    return (
        <>
            <Head title="Eventos" subtitle="Inscripciones por evento" />
            
            <EnrollmentList />
        </>
    )
}
