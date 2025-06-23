// components\pages\Loading.tsx
import { MountainSnow } from 'lucide-react';

const Loading = () => {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative flex flex-col items-center justify-center p-6 sm:p-8">
          <MountainSnow className="h-12 w-12 sm:h-16 text-primary animate-pulse mb-4" />

          <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-foreground text-center">
            Explorando senderos...
          </h2>

          <p className="text-sm text-muted-foreground text-center">
            Cargando tu próxima aventura.
          </p>

          <div className="absolute -bottom-2.5 w-full max-w-sm h-2.5 bg-primary/20 rounded-full overflow-hidden mt-6">
            <div className="h-full bg-primary animate-progress-indeterminate"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Loading };
