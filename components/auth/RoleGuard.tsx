// components\auth\RoleGuard.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { Loading } from '@/components/pages';
import { RolesEnum } from '@/lib/auth-types';
import { toast } from 'sonner';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: RolesEnum[];
  redirectPath?: string;
}

export default function RoleGuard({ children, allowedRoles, redirectPath }: RoleGuardProps) {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        toast.error('Acceso denegado. Debes iniciar sesión.');
        router.replace(`/login?to=${pathname}`);
      } else if (!user || !allowedRoles.includes(user.role)) {
        toast.error('No tienes los permisos necesarios para acceder a esta sección.');
        router.replace(redirectPath || '/dashboard');
      } else {
        setShouldRender(true);
      }
    }
  }, [isAuthLoading, isAuthenticated, user, allowedRoles, router, pathname, redirectPath]);

  if (isAuthLoading) return <Loading />;

  if (!shouldRender) return null;

  return <>{children}</>;
}
