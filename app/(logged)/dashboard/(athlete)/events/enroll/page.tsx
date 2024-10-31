import { Head } from '@/components/layout'

import EventsEnrollList from './components/EventEnrollList'


export default function EventsEnrolPage() {
  return (
    <>
      <Head title="Eventos" subtitle="Administración de eventos" />

      <EventsEnrollList />
    </>
  )
}

