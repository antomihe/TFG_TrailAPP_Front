import { ScrollArea } from '@/components/ui/scroll-area';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

export default function UnloggedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen flex flex-col mx-auto px-3 py-2">
      <ScrollArea className="flex flex-col overflow-y-auto flex-grow w-full mx-auto px-8 md:px-16">
        <div className="w-full">
          <Header />

          <main className="flex-grow flex items-center justify-center w-full min-h-[calc(100vh-160px)]">
            {children}
          </main>

          <Footer />
        </div>
      </ScrollArea>
    </div>
  );
}

