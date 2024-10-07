'use client';

import Image from "next/image";
import { useTheme } from "next-themes";

interface LogoIconProps {
    className?: string; 
}

const LogoIcon: React.FC<LogoIconProps> = ({ className }) => {
    const { theme } = useTheme();

    return (
      <div className={className}>
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
      </div>
    );
}

export { LogoIcon };
