'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUserState } from '@/store/user/user.store';
import api from '@/config/api';

function useAuthRedirect(): boolean {
    const router = useRouter();
    const params = usePathname()
    const userState = useUserState();
    const [shouldRedirect, setShouldRedirect] = useState(true);
    const [fullyLoaded, setFullyLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userAccessToken = userState.user?.access_token;
                if (!userAccessToken) {
                    // Do nothing
                } else {
                    const res = await api.post(`/auth/validToken/${userAccessToken}`);
                    if (res.status === 200 && !!res.data.valid) setShouldRedirect(false);
                }
            } catch (err) {
                // Do nothing
            }

            setFullyLoaded(true);          
        };

        fetchData();
    }, [userState, router]);

    useEffect(() => {
        if (fullyLoaded) {
            if (shouldRedirect) {
                router.push(`/login?to=${params}`);
            }
        }
    }, [fullyLoaded]);

    return shouldRedirect;
}

export default useAuthRedirect;
