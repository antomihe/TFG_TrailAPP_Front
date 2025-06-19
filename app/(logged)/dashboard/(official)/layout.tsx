// app\(logged)\dashboard\(official)\layout.tsx
'use client'; 

import React, { ReactNode } from 'react';
import RoleGuard from '@/components/auth/RoleGuard';  
import { RolesEnum } from '@/lib/auth-types';             

const OfficialLayout = ({ children }: { children: ReactNode }) => {
  return (
    <RoleGuard
      allowedRoles={[RolesEnum.OFFICIAL]} 
      redirectPath="/dashboard" 
    >
            {children}
    </RoleGuard>
  );
};

export default OfficialLayout;