// app\(logged)\dashboard\(organizer)\layout.tsx
'use client';

import React, { ReactNode } from 'react';
import RoleGuard from '@/components/auth/RoleGuard';
import { RolesEnum } from '@/lib/auth-types';


const OrganizerLayout = ({ children }: { children: ReactNode }) => {
  return (
    <RoleGuard
      allowedRoles={[RolesEnum.ORGANIZER]}
      redirectPath="/dashboard"
    >
      {children}
    </RoleGuard>
  );
}

export default OrganizerLayout;