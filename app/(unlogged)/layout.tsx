'use client';

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NavigationMenu, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/ui/theme/themeIcon";
import LogoIcon from "@/app/(unlogged)/components/LogoIcon";
import YearComponent from "@/app/(unlogged)/components/YearComponent";

export default function NavigationMenuContainer({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
                  <Link href="/" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
                    Home
                  </Link>
                  <Link href="#" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
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
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100  dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                      prefetch={false}
                    >
                      Home
                    </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                    <Link
                      href="#"
                      className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50"
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
              <Link href="/login" passHref prefetch={true}>
                <Button variant="outline">Iniciar sesión</Button>
              </Link>
              <Link href="/register" passHref prefetch={true}>
                <Button>Registrarse</Button>
              </Link>
            </div>
          </header>

          <main className="flex-grow min-h-[calc(100vh-160px)] flex flex-col">
            {children}
          </main>

          <footer className="flex h-20 w-full shrink-0 items-center justify-center px-4 md:px-6">
            <p className="text-sm font-semibold">© <YearComponent /> - TRAILAPP</p>
          </footer>
        </div>
      )}
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
