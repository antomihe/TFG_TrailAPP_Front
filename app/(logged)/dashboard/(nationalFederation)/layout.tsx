// app\(logged)\dashboard\(nationalFederation)\layout.tsx
'use client';

import React, { ReactNode } from 'react';
import RoleGuard from '@/components/auth/RoleGuard';
import { RolesEnum } from '@/lib/auth-types';

const NationalFederationLayout = ({ children }: { children: ReactNode }) => {
  return (
    <RoleGuard
      allowedRoles={[RolesEnum.NATIONALFEDERATION]}
      redirectPath="/dashboard"
    >
      {children}
    </RoleGuard>
  );
};

export default NationalFederationLayout;