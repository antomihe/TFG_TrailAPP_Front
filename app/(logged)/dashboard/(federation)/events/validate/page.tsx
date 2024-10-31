import { Head } from '@/components/layout'

import EventsValidationList from './components/EventsValidationList'


export default function ValidateOfficialPage() {
  return (
    <>
      <Head title="Eventos" subtitle="Validación de nuevos eventos" />

      <EventsValidationList />

    </>
  )
}

