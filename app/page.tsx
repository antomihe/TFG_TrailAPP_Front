import React from 'react';

import { BackgroundLines } from '@/components/ui/background-lines';
import { Header, Footer } from '@/components/layout';

export default function Home() {

  return (
    <>
      <div className="container h-screen mx-auto flex flex-col py-2 px-4 md:px-6 lg:px-8">
        <Header />

        <main className="flex-grow min-h-[calc(100vh-160px)] flex flex-col">
          <BackgroundLines className="flex items-center justify-center h-full w-full flex-col px-4">
            <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-5xl md:text-6xl lg:text-8xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
              TrailApp
            </h2>
            <p className="max-w-xl mx-auto text-lg md:text-xl text-neutral-700 dark:text-neutral-400 text-center">
              Tu app para la gestión de trails
            </p>
          </BackgroundLines>
        </main>

        <Footer />
      </div >
      
    </>
  );
}

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

