'use client';

import React, { ReactNode } from 'react';
import { RoleRedirect } from '@/components/auth/RoleRedirect';
import RoleEnum from '@/enums/Roles.enum';

const OrganizerLayout = ({ children }: { children: ReactNode }) => {
    const RoleWrapper = RoleRedirect(
        ({ children }: { children: ReactNode }) => <>{children}</>,
        RoleEnum.ORGANIZER,
        { component: ({ children }: { children: ReactNode }) => <>{children}</>, role: RoleEnum.ORGANIZER }
    );

    return (
        <RoleWrapper>
            {children}
        </RoleWrapper>
    );
};

export default OrganizerLayout;

