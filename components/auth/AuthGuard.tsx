// components\auth\AuthGuard.tsx
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
        if (!isLoading && !isAuthenticated) {
            toast.error('Acceso denegado. Por favor, inicia sesión.');
            router.replace(`/login?to=${encodeURIComponent(pathname)}`);
        } else if (
            !isLoading &&
            isAuthenticated &&
            roles &&
            user &&
            !roles.includes(user.role as RolesEnum)
        ) {
            toast.error('No tienes permiso para acceder a esta página.');
            router.replace('/unauthorized');
        }
    }, [isAuthenticated, isLoading, router, pathname, user, roles]);

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
