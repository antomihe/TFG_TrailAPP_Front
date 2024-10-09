'use client';

import React from 'react';
import useRoleRedirect from '@/hooks/useRoleRedirect';
import { Loading } from '@/components/pages';
import RolesEnum from '@/enums/Roles.enum';
import { Unauthorized } from '@/components/pages/';

interface RoleRedirectProps<T> {
    component: React.ComponentType<React.PropsWithChildren<T>>;
    role: RolesEnum;
}

export function RoleRedirect<T>(p0: ({ children }: { children: React.ReactNode; }) => React.JSX.Element, NATIONALFEDERATION: RolesEnum, { component: Component, role }: RoleRedirectProps<T>) {
    return function AuthenticatedComponent(props: React.PropsWithChildren<T>) {
        const { shouldAccess, loading } = useRoleRedirect(role);

        if (loading) {
            return <Loading />;
        }

        if (shouldAccess) {
            return <Component {...props} />;
        }

        return <Unauthorized />;
    };
}
