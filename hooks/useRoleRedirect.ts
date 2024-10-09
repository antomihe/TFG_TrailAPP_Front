'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUserState } from '@/store/user/user.store';
import RolesEnum from '@/enums/Roles.enum';

function useRoleRedirect(requiredRole: RolesEnum): { shouldAccess: boolean; loading: boolean } {
    const userState = useUserState();
    const [shouldAccess, setShouldAccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setShouldAccess(false);
        setLoading(true);
        const userRole = userState.user?.role;
        if (userRole === requiredRole) {
            setShouldAccess(true);
        }
        setLoading(false);
    }, [userState.user]);

    return { shouldAccess, loading };
}

export default useRoleRedirect;
