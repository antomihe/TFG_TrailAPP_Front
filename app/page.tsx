'use client';

import React, { useEffect, useState } from 'react';
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NavigationMenu, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/theme/themeIcon";
import LogoIcon from "@/components/ui/LogoIcon";
import YearComponent from "@/components/ui/YearComponent";
import { useUserState } from '@/store/user/user.store';
import { BackgroundLines } from '@/components/ui';


export default function Home({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [isUserLogged, setIsUserLogged] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsUserLogged(useUserState.getState().isNull());
  }, []);

  return (
    <>
      {isClient && (
        <div className="container h-screen mx-auto flex flex-col px-4 md:px-6 lg:px-8">
          <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <MenuIcon className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Link href="#" prefetch={false}>
                  <LogoIcon className="h-6 w-6" />
                </Link>
                <div className="grid gap-2 py-6">
                  <Link href="/" className="flex w-full items-center py-2 text-lg font-semibold distance-opacity" prefetch={false}>
                    Home
                  </Link>
                  <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold distance-opacity" prefetch={false}>
                    Eventos
                  </Link>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="mr-6 hidden lg:flex items-center" prefetch={false}>
              <LogoIcon className="h-6 w-6" />
            </Link>

            {isClient && (
              <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors focus:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 distance-opacity"
                      prefetch={false}
                    >
                      Home </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="#"
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 distance-opacity"
                      prefetch={true}
                    >
                      Eventos
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuList>
              </NavigationMenu>
            )}

            <div className="ml-auto flex gap-2">
              <ModeToggle />
              {isUserLogged ? (
                <>
                  <Button
                    variant="outline"
                    className="distance-opacity"
                    onClick={() => {
                      useUserState.getState().logout();
                      setIsUserLogged(false);
                    }}
                  >
                    Cerrar sesión
                  </Button>
                  <Link href="/dashboard" passHref prefetch={true}>
                    <Button className="distance-opacity">Ir al dashboard</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" passHref prefetch={true}>
                    <Button variant="outline" className="distance-opacity">Iniciar sesión</Button>
                  </Link>
                  <Link href="/register" passHref prefetch={true}>
                    <Button className="distance-opacity">Registrarse</Button>
                  </Link>
                </>
              )}
            </div>
          </header >

          <main className="flex-grow min-h-[calc(100vh-160px)] flex flex-col">
            <BackgroundLines className="flex items-center justify-center h-full w-full flex-col px-4">
              <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-5xl md:text-6xl lg:text-8xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
                TrailApp
              </h2>
              <p className="max-w-xl mx-auto text-lg md:text-xl text-neutral-700 dark:text-neutral-400 text-center">
                Tu app para la gestión de trails
              </p>
            </BackgroundLines>
          </main>

          <footer className="flex h-20 w-full shrink-0 items-center justify-center px-4 md:px-6">
            <p className="text-sm font-semibold">© <YearComponent /> - TRAILAPP</p>
          </footer>
        </div >
      )
      }
    </>
  );
}

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

