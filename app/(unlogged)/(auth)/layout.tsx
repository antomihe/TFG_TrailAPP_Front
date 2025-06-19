// app\(unlogged)\(auth)\layout.tsx
'use client';

import React, { ReactNode } from 'react';
import { PublicRedirect } from '@/components/auth/PublicRedirect'; 

const ChildrenRenderer = ({ children }: { children: ReactNode }) => {
    return <>{children}</>;
};

const PublicLayoutWrapper = PublicRedirect(ChildrenRenderer);

const UnloggedAuthLayout = ({ children }: { children: ReactNode }) => {
    return <PublicLayoutWrapper>{children}</PublicLayoutWrapper>;
};

export default UnloggedAuthLayout;