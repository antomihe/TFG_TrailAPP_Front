'use client'

import PageNotFound from "@/components/not-found/PageNotFound"
import YearComponent from "@/components/ui/YearComponent"
import Link from "next/link"
import { Button } from "@/components/ui"
import { ModeToggle } from "@/components/theme/themeIcon"
import LogoIcon from "@/components/ui/LogoIcon"
import React from "react"
import { useUserState } from '@/store/user/user.store';

export default function NotFound() {
  const [isClient, setIsClient] = React.useState(false);
  const [isUserLogged, setIsUserLogged] = React.useState(false);

  React.useEffect(() => {
    setIsUserLogged(useUserState.getState().isNull());
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <div className="container h-screen mx-auto flex flex-col px-4 md:px-6 lg:px-8">

          <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">

            <Link href="/" className="mr-6 flex items-center" prefetch={false}>
              <LogoIcon className="h-6 w-6" />
            </Link>

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
          </header>
          <div className="flex-grow flex items-center justify-center">
            <PageNotFound />
          </div>
          <footer className="flex h-20 w-full shrink-0 items-center justify-center px-4 md:px-6">
            <p className="text-sm font-semibold">© <YearComponent /> - TRAILAPP</p>
          </footer>
        </div>
      )}

    </>
  )
}
