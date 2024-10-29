'use client'

import React, { PropsWithChildren, useState, useEffect, use } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconLayoutDashboard, IconUserBolt, IconMessages } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LogoIcon as LogoIconComponent, ThemeIconButton } from "@/components/theme/";
import { useUserState } from "@/store/user/user.store";
import { useRouter } from 'next/navigation'
import { Footer } from "@/components/layout/footer";
import { ScrollArea } from "@/components/ui/scroll-area";


export function Dashboard({ children }: PropsWithChildren) {
  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (shouldRedirect) router.push('/');
  }, [shouldRedirect]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={cn("flex flex-col md:flex-row w-full flex-1 max-w-full mx-auto md:overflow-hidden h-screen")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-accent rounded-tr-xl border-none">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {mainLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} className="hover:text-primary" />
              ))}
            </div>
          </div>
          <div className="flex justify-between">

            <SidebarLink
              link={{
                label: "Logout",
                href: "#",
                icon: (
                  <Image
                    src="/defaultAvatar.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full hover:text-primary"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
              onClick={() => {
                useUserState.getState().logout();
                setShouldRedirect(true);
              }}
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

export const Logo = () => (
  <Link href="/" className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20">
    <LogoIconComponent className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium whitespace-pre"
    >
      UPM TRAIL
    </motion.span>
  </Link>
);

export const LogoIcon = () => (
  <Link href="#" className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20">
    <LogoIconComponent className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    <Image
      src="/logo.png"
      alt="Acet Labs"
      width={20}
      height={24}
      className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
    />
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
    href: "#",
    icon: <IconMessages className="h-5 w-5 flex-shrink-0" />,
  },
];

const InnerDashboard = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col h-screen bg-inherit w-full">
    <div className="pr-1 pl-2 h-screen md:pr-2 md:pl-10 md:pt-2 md:pb-2 rounded-tl-2xl border ">
      <ScrollArea className="flex-1 pr-1 pt-2 md:pr-8 md:pt-8 w-full h-full overflow-y-auto">
        <div className={cn("flex flex-col gap-2 h-full w-full")}>
          <div className="flex-grow">{children}</div>
          <Footer />
        </div>
      </ScrollArea>
    </div>
  </div>


);

export default Dashboard;
