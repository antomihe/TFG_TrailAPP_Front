
import { Head } from '@/components/layout';
import EditElementForm from './components/EditElement';


export default function EditEventPage() {

  return (
    <>
      <Head title="Evento" subtitle="Editar evento" />

      <EditElementForm />      
    </>
  );
}
