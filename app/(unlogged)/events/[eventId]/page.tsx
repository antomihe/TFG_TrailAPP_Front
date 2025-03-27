import { Head } from "@/components/layout";
import Connection from "./components/connection";

export default function EventPage() {
    return (
        <div className="px-10 w-full ">
            
            <Head title="Eventos" subtitle="Inscripciones por evento" />

            <Connection />
        </div>
    )
}
