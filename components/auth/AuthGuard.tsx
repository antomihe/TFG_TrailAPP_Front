// components\auth\AuthGuard.tsx
// components/auth/AuthGuard.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import type RolesEnum from '@/enums/Roles.enum';
import { useRouter, usePathname } from 'next/navigation';
import { Loading } from '@/components/pages';
import { toast } from 'sonner';

interface AuthGuardProps {
    children: ReactNode;
    roles?: RolesEnum[];
}

export default function AuthGuard({ children, roles }: AuthGuardProps) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (!isAuthenticated) {
            router.replace(`/login?to=${encodeURIComponent(pathname)}`);
            return;
        }

        if (roles && user && !roles.includes(user.role as RolesEnum)) {
            toast.error('Acceso Denegado', {
                description: 'No tienes los permisos necesarios para acceder a esta página.',
                duration: 5000
            });
            router.replace('/unauthorized');
        }

    }, [isAuthenticated, isLoading, user, roles, router, pathname]);

    if (isLoading) {
        return <Loading />;
    }

    if (!isAuthenticated) {
        return null;
    }

    if (roles && user && !roles.includes(user.role as RolesEnum)) {
        return null;
    }

    return <>{children}</>;
}