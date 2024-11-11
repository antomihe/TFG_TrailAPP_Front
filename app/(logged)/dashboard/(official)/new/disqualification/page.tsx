import { Head } from "@/components/layout";
import NewDisqualificationReportForm from "./components/NewDisqualificationReportForm";

export default function NewDisqualificationPage() {
  return (
    <>
      <Head title="Descalificaciones" subtitle="Envia un nuevo parte de descalificación" />

      <NewDisqualificationReportForm />
    </>
  )
}
