import React from 'react'
import { Head } from '@/components/layout';
import AthelteProfileForm from './components/AthelteProfileForm';

export default function ProfilePage() {
  return (
    <>
      <Head
        title="Perfil"
        subtitle="Edita tus datos personales"
      />

      <AthelteProfileForm/>
    </>
  )
}
