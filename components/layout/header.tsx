'use client'

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { useUserState } from "@/store/user/user.store";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { ThemeIconButton, LogoIcon } from "@/components/theme/";
import { Button } from "@/components/ui";

export const Header = () => {
    const [isClient, setIsClient] = useState(false);
    const isUserLogged = useUserState((state) => !state.isNull());

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                        <MenuIcon className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <Link href="#" prefetch={false}>
                        {isClient && <LogoIcon className="h-6 w-6" />}
                    </Link>
                    <div className="grid gap-2 py-6">
                        <NavItem href="/" label="Home" />
                        <NavItem href="#" label="Eventos" />
                    </div>
                </SheetContent>
            </Sheet>

            <Link href="/" className="mr-6 hidden lg:flex items-center" prefetch={false}>
                {isClient && <LogoIcon className="h-6 w-6" />}
            </Link>

            <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList>
                    <NavItem href="/" label="Home" />
                    <NavItem href="#" label="Eventos" />
                </NavigationMenuList>
            </NavigationMenu>

            <div className="ml-auto flex gap-2">
                {isClient && <ThemeIconButton />}
                {isClient && isUserLogged ? (
                    <UserMenu />
                ) : (
                    <GuestMenu />
                )}
            </div>
        </header>
    )
}

const NavItem = ({ href, label }: { href: string, label: string }) => (
    <Link
        href={href}
        className="group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        prefetch={false}
    >
        {label}
    </Link>
);

const UserMenu = () => (
    <>
        <Button
            variant="outline"
            className="distance-opacity hover:bg-accent border-0"
            onClick={() => {
                useUserState.getState().logout();
            }}
        >
            Cerrar sesión
        </Button>
        <Link href="/dashboard" passHref prefetch={true}>
            <Button className="distance-opacity hover:bg-accent border-0">Ir al dashboard</Button>
        </Link>
    </>
);

const GuestMenu = () => (
    <>
        <Link href="/login" passHref prefetch={true}>
            <Button variant="outline" className="distance-opacity hover:bg-accent border-0">Iniciar sesión</Button>
        </Link>
        <Link href="/register" passHref prefetch={true}>
            <Button className="distance-opacity hover:bg-accent">Registrarse</Button>
        </Link>
    </>
);

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
