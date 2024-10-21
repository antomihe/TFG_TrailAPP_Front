import React from 'react';
import { Footer, Header } from '@/components/layout';

export default function UnloggedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container h-screen flex flex-col px-4 md:px-6 lg:px-8">
      <Header />

      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>

      <Footer />
    </div>
  )
}
