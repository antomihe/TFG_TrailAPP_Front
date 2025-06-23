// components\layout\footer.tsx
import { MountainSnow } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative h-20 w-full flex items-center justify-center px-4 md:px-6 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4 opacity-10 dark:opacity-10 pointer-events-none z-0 mb-6">
        <MountainSnow className="h-6 w-6 sm:h-8 sm:w-8 rotate-[8deg]" />
        <MountainSnow className="h-10 w-10 sm:h-12 sm:w-12 -rotate-[4deg]" />
        <MountainSnow className="h-6 w-6 sm:h-8 sm:w-8 rotate-[10deg]" />
      </div>

      <p className="text-sm font-semibold z-10 relative">
        © {currentYear} - TRAILAPP
      </p>
    </footer>
  );
};
