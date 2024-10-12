'use client';

import React from 'react';
import Image from 'next/image';
import { Head } from '@/components/layout';
import { useUserState } from '@/store/user/user.store';
import { H3 } from '@/components/ui/';

import AthelteProfileForm from './components/AthleteProfileForm';
import OfficialProfileForm from './components/OfficialProfileForm';
import FederationProfileForm from './components/FederationProfileForm';
import OrganizerProfileForm from './components/OrganizerProfileForm';

export default function ProfilePage() {
  const user = useUserState((state) => state.user);

  return (
    <>
      <Head title="Perfil" subtitle="Edita tus datos personales" />

      {user?.role === 'Athlete' && <AthelteProfileForm />}
      {user?.role === 'Official' && <OfficialProfileForm />}
      {user?.role === 'Organizer' && <OrganizerProfileForm />}
      {user?.role === 'Federation' && <FederationProfileForm />}
      {user?.role === 'NationalFederation' && <NationalFederationForm />}
    </>
  );
}

const NationalFederationForm: React.FC = () => {
  return (
      <H3 className='text-center mt-6'>El usuario RFEA no puede modificarse</H3>
  );
};
