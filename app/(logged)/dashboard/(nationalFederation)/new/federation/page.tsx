import React from 'react'

import { Head } from '@/components/layout'
import  NewFederationForm  from './components/NewFederationForm'

export default function NewFederationPage() {
  return (
    <>
      <Head title="Federaciones autonómicas" subtitle="Crea una nueva federación" />

      <NewFederationForm />
    </>
  )
}
