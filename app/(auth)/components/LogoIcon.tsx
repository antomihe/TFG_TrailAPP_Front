'use client';

import Image from "next/image";
import { useTheme } from "next-themes";

function LogoIcon(props: any) {
    const { theme } = useTheme();
  
    return (
      <>
        {theme === "dark" ? (
          <Image
            src="/logo_blanco.png"
            alt="TrailApp Logo"
            width={32}
            height={32}
          />
        ) : (
          <Image
            src="/logo.png"
            alt="TrailApp Logo"
            width={32}
            height={32}
          />
        )}
        <h1 className="hidden lg:flex scroll-m-20 text-l ml-2 font-extrabold tracking-tight lg:text-xl">
          TrailApp
        </h1>
      </>
    )
  }

  export default LogoIcon;