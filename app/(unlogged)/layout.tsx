// src/app/(unlogged)/layout.tsx
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

export default function UnloggedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background overflow-x-hidden py-2">
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="container mx-auto flex-1 flex items-center justify-center w-full px-2 py-4 md:px-4 lg:px-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}