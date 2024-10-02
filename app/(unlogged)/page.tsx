import Image from "next/image";

import { BackgroundLines } from "@/components/ui";

export default function Home() {
  return (
    <BackgroundLines className="flex items-center justify-center h-full w-full flex-col px-4">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-5xl md:text-6xl lg:text-8xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        TrailApp
      </h2>
      <p className="max-w-xl mx-auto text-lg md:text-xl text-neutral-700 dark:text-neutral-400 text-center">
        Tu app para la gestión de trails
      </p>
    </BackgroundLines>

  );
}
