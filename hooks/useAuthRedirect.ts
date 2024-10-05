'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';  
import { useUserState } from '@/store/user/user.store';

function useAuthRedirect(): boolean {
    const router = useRouter();  
    const userState = useUserState();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    
    useEffect(() => {
        if (!userState.isNull()) {
            router.push('/');
            setShouldRedirect(true);
        }
    }, [userState, router]);

    return shouldRedirect;  
}

export default useAuthRedirect;
