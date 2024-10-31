'use client';

import React, { ReactNode } from 'react';
import { RoleRedirect } from '@/components/auth/RoleRedirect';
import RoleEnum from '@/enums/Roles.enum';

const NationalFederationLayout = ({ children }: { children: ReactNode }) => {
    const RoleWrapper = RoleRedirect(
        ({ children }: { children: ReactNode }) => <>{children}</>,
        RoleEnum.FEDERATION,
        { component: ({ children }: { children: ReactNode }) => <>{children}</>, role: RoleEnum.FEDERATION }
    );

    return (
        <RoleWrapper>
            {children}
        </RoleWrapper>
    );
};

export default NationalFederationLayout;

