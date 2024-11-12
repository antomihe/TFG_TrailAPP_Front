import { Head } from "@/components/layout";
import DisqualificationList from "./components/DisqualificationList";

export default function NewDisqualificationPage() {
  return (
    <>
      <Head title="Descalificaciones" subtitle="Partes de descalificación recibidos" />

        <DisqualificationList />
    </>
  )
}
