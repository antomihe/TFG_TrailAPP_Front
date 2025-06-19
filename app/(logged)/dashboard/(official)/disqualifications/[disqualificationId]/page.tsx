// app\(logged)\dashboard\(official)\disqualifications\[disqualificationId]\page.tsx
import { Head } from "@/components/layout";
import DisqualificationReviewPage from "./components/DisqualificationReviewPage";

export default function NewDisqualificationPage() {
    return (
        <>
            <Head title="Descalificaciones" subtitle="Partes de descalificación recibidos" />

            <DisqualificationReviewPage />
        </>
    )
}
