import { Head } from '@/components/layout'

import EventsManagerList from './components/EventManagerList'


export default function ValidateOfficialPage() {
  return (
    <>
      <Head title="Eventos" subtitle="Administración de eventos" />

      <EventsManagerList />

    </>
  )
}

