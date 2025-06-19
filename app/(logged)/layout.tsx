// app\(logged)\dashboard\layout.tsx
import { ReactNode } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';        

export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
      <AuthGuard>
         <main> 
          {children}
        </main>
      </AuthGuard>
  );
}