// app\(logged)\dashboard\(federation)\layout.tsx

'use client';

import React, { ReactNode } from 'react';
import RoleGuard from '@/components/auth/RoleGuard';
import { RolesEnum } from '@/lib/auth-types';


const FederationLayout = ({ children }: { children: ReactNode }) => {
  return (
    <RoleGuard
      allowedRoles={[RolesEnum.FEDERATION]}
      redirectPath="/dashboard"
    >
      {children}
    </RoleGuard>
  );
};

export default FederationLayout;