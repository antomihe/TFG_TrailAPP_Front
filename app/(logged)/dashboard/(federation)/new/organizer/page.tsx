import { Head } from "@/components/layout";

import NewOrganizerForm from "../../components/newOrganizerForm";


export default function NewOrganizerPage() {
    return (
        <>
            <Head title="Organizadores" subtitle="Crea un nuevo organizador" />

            <NewOrganizerForm />
        </>
    )
}

