// app\(logged)\dashboard\(athlete)\layout.tsx
'use client'; 

import React, { ReactNode } from 'react';
import RoleGuard from '@/components/auth/RoleGuard';  
import { RolesEnum } from '@/lib/auth-types';             


const AthleteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <RoleGuard
      allowedRoles={[RolesEnum.ATHLETE]} 
      redirectPath="/dashboard" 
    >
            {children}
    </RoleGuard>
  );
};

export default AthleteLayout;