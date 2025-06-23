// components\pages\NotFound.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="text-center flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          ¡Sendero no encontrado!
        </h1>

        <Image
          src="/404.png"
          alt="Página no encontrada - Sendero perdido entre montañas"
          width={350}
          height={350}
          className="opacity-80 dark:opacity-70 mt-4"
          priority
        />
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
          Parece que te has desviado del camino. La página que buscas no existe o ha sido movida.
        </p>

        <Link href="/" passHref>
          <Button
            variant="default"
            size="lg"
            className="w-full sm:w-auto min-w-[200px] group transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.02] active:scale-95"
            aria-label="Volver a la página de inicio"
          >
            <Compass size={20} className="mr-2.5 transition-transform duration-300 group-hover:rotate-[25deg]" />
            Volver al Campamento Base
          </Button>
        </Link>
      </div>
    </div>
  );
}

export { NotFound };
