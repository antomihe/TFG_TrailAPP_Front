import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserState } from '@/store/user/user.store';

function usePublicRedirect(): { shouldRedirect: boolean; loading: boolean } {
    const router = useRouter();
    const params = useSearchParams()
    const userState = useUserState();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userState.isNull()) {
            const redirectToParams = params.get('to')
            const to = redirectToParams || '/dashboard';
            setShouldRedirect(true);
            router.push(to);
        }
        setLoading(false);
    }, [userState.user]);

    return { shouldRedirect, loading };
}

export default usePublicRedirect;