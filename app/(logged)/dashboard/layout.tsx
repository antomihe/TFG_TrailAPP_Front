// app/(logged)/dashboard/layout.tsx
'use client'

import React, { PropsWithChildren, useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconLayoutDashboard, IconUserBolt, IconMessages } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LogoIcon as LogoIconComponent, ThemeIconButton } from "@/components/theme/";
import { usePathname, useRouter } from 'next/navigation';
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/auth/useAuth";


export function Dashboard({ children }: PropsWithChildren) {
  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  useEffect(() => {
    if (shouldRedirect) router.push('/');
  }, [shouldRedirect, router]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLinkClick = () => {
    if (open) {
      setOpen(false);
    }
  };

  const handleLogoutClick = async () => {
    await logout();
    setShouldRedirect(true);
    setOpen(false);
  };

  return (
    <div className={cn("flex flex-col md:flex-row w-full flex-1 max-w-full mx-auto md:overflow-hidden h-screen")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 md:bg-accent md:rounded-tr-xl md:border-none">
          <div className="flex flex-col flex-1">
            <div onClick={handleLinkClick}>
              {open ? <Logo onClick={handleLinkClick} /> : <LogoIcon onClick={handleLinkClick} />}
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {mainLinks.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  className={cn(
                    "hover:text-primary",
                    pathname === link.href && "text-primary font-semibold"
                  )}
                  onClick={() => {
                    if (pathname !== link.href) {
                      handleLinkClick();
                    }
                  }}
                />
              ))}
            </div>
          </div>
          <div className={cn(
              "flex items-center",
              open ? "justify-between" : "justify-start" 
            )}
          >
            <SidebarLink
              link={{
                label: "Logout",
                href: "#",
                icon: (
                  <Image
                    src="/defaultAvatar.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
              className="hover:text-destructive dark:hover:text-destructive-foreground"
              onClick={handleLogoutClick}
            />
            {isClient && open && (
              <ThemeIconButton className="hover:text-primary hover:bg-transparent flex-shrink-0" />
            )}
          </div>
        </SidebarBody>
      </Sidebar>

      <InnerDashboard>
        {children}
      </InnerDashboard>
    </div>
  );
}

export const Logo = ({ onClick }: { onClick?: () => void }) => (
  <Link href="/" className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20" onClick={onClick}>
    <LogoIconComponent className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium whitespace-pre"
    >
      TRAIL APP
    </motion.span>
  </Link>
);

export const LogoIcon = ({ onClick }: { onClick?: () => void }) => (
  <Link href="/" className="font-normal flex items-center justify-center text-sm py-1 relative z-20" onClick={onClick}>
    <LogoIconComponent className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
  </Link>
);

const mainLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <IconLayoutDashboard className="h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Perfil",
    href: "/dashboard/profile",
    icon: <IconUserBolt className="h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Chat",
    href: "/dashboard/chat",
    icon: <IconMessages className="h-5 w-5 flex-shrink-0" />,
  },
];

const InnerDashboard = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col flex-1 h-full bg-inherit w-full overflow-y-auto">
    <div className="md:p-4 p-2 flex-1">
      <div className={cn("flex flex-col gap-2 h-full w-full")}>
        <div className="flex-grow">{children}</div>
        <Footer />
      </div>
    </div>
  </div>
);

export default Dashboard;