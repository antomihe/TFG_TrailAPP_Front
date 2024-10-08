'use client'

import React, { use } from 'react'
import { Head } from '@/components/layout';
import { useUserState } from "@/store/user/user.store";

import AthelteProfileForm from './components/AthelteProfileForm';
import OfficialProfileForm from './components/OfficialProfileForm';

export default function ProfilePage() {
  const user = useUserState.getState().user;


  return (
    <>
      <Head
        title="Perfil"
        subtitle="Edita tus datos personales"
      />

      
      {user.role === "NationalFederation" && <AthelteProfileForm/>}
      {user.role === "Federation" && <AthelteProfileForm/>}
      {user.role === "Athlete" && <AthelteProfileForm/>}
      {user.role === "Official" && <OfficialProfileForm/>}
      {user.role === "Organizer" && <AthelteProfileForm/>}
      
    </>
  )
}
