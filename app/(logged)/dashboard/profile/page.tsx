// app\(logged)\dashboard\profile\page.tsx
'use client';

import React from 'react';
import { Head } from '@/components/layout';

import AthelteProfileForm from './components/AthleteProfileForm';
import OfficialProfileForm from './components/OfficialProfileForm';
import FederationProfileForm from './components/FederationProfileForm';
import OrganizerProfileForm from './components/OrganizerProfileForm';
import { useAuth } from '@/hooks/auth/useAuth';
import { ShieldAlert } from 'lucide-react';
import { CenteredMessage } from '@/components/ui/centered-message';

export default function ProfilePage() {
  const { user } = useAuth();

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
    <div className="container mx-auto px-4 py-8">
      <CenteredMessage
        icon={<ShieldAlert size={48} />}
        title="Acceso No Autorizado"
        variant="warning"
        message="No tienes los permisos necesarios para acceder a esta sección de chats."
      />
    </div>
  );
};
