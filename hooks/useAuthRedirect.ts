'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUserState } from '@/store/user/user.store';
import api from '@/config/api';

function useAuthRedirect(): { shouldRedirect: boolean; loading: boolean } {
    const router = useRouter();
    const params = usePathname();
    const userState = useUserState();
    const [shouldRedirect, setShouldRedirect] = useState(true);
    const [loading, setLoading] = useState(true); 
    const [fullyLoaded, setFullyLoaded] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userAccessToken = userState.user?.access_token;
                if (userAccessToken) {
                    const res = await api().post(`/auth/validToken/${userAccessToken}`);
                    if (res.status === 200 && !!res.data.valid) {
                        setShouldRedirect(false);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setFullyLoaded(true); 
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (fullyLoaded && shouldRedirect) {
            userState.logout();
            router.push(`/login?to=${params}`);
        }
        setLoading(false)
    }, [fullyLoaded]);

    return { shouldRedirect, loading };
}

export default useAuthRedirect;
