// components/layout/header.tsx
'use client'

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuList } from "@/components/ui/navigation-menu";
import { ThemeIconButton, LogoIcon } from "@/components/theme/";
import { Button } from "@/components/ui";
import { useAuth } from '@/hooks/auth/useAuth';
import { Separator } from '@/components/ui/separator';

export const Header = () => {
    const [isClient, setIsClient] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSheetNavigate = () => {
        setIsSheetOpen(false);
    };

    if (!isClient) {
        return <header className="h-20 w-full shrink-0" />;
    }

    return (
        <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between bg-background/95 px-4 sm:px-6 md:px-12 lg:px-20 backdrop-blur-sm">
            <div className="flex items-center gap-4 md:gap-6">
                <Link href="/" className="flex items-center" prefetch={false} onClick={isSheetOpen ? handleSheetNavigate : undefined}>
                    <LogoIcon />
                    <span className="ml-2 whitespace-nowrap text-lg font-semibold tracking-tight text-foreground">
                        TRAILAPP
                    </span>
                </Link>
                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList>
                        <DesktopNavItem href="/" label="Home" />
                        <DesktopNavItem href="/events" label="Eventos" />
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <ThemeIconButton />

                <div className="hidden lg:flex items-center gap-2">
                    {isAuthenticated ? <UserMenuDesktop logout={logout} /> : <GuestMenuDesktop />}
                </div>

                <div className="lg:hidden">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="Abrir menú de navegación">
                                <MenuIcon className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col p-6 w-full max-w-xs sm:max-w-sm text-sm">
                            <Link href="/" className="mb-6 self-start flex items-center gap-2" onClick={handleSheetNavigate}>
                                <LogoIcon />
                                <span>TRAILAPP</span>
                            </Link>
                            <nav className="grid gap-2 font-medium">
                                <SheetNavItem href="/" label="Home" onNavigate={handleSheetNavigate} />
                                <SheetNavItem href="/events" label="Eventos" onNavigate={handleSheetNavigate} />
                            </nav>

                            <Separator className="my-4" />

                            <div className="grid gap-2">
                                {isAuthenticated ? (
                                    <>
                                        <Link href="/dashboard" passHref prefetch={true} onClick={handleSheetNavigate}>
                                            <Button variant="ghost" className="w-full justify-start">Ir al dashboard</Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                            onClick={async () => {
                                                await logout();
                                                handleSheetNavigate();
                                            }}
                                        >
                                            Cerrar sesión
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" passHref prefetch={true} onClick={handleSheetNavigate}>
                                            <Button variant="ghost" className="w-full justify-start">Iniciar sesión</Button>
                                        </Link>
                                        <Link href="/register" passHref prefetch={true} onClick={handleSheetNavigate}>
                                            <Button variant="ghost" className="w-full justify-start">Registrarse</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                            <div className="mt-auto pt-6">
                                <p className="text-center text-xs text-muted-foreground">
                                    © {new Date().getFullYear()} TrailApp
                                </p>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}

const DesktopNavItem = ({ href, label }: { href: string, label: string }) => (
    <Link
        href={href}
        className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
        prefetch={false}
    >
        {label}
    </Link>
);

const SheetNavItem = ({ href, label, onNavigate }: { href: string, label: string, onNavigate: () => void }) => (
    <Link
        href={href}
        onClick={onNavigate}
        className="block rounded-lg px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
        prefetch={false}
    >
        {label}
    </Link>
);

const UserMenuDesktop = ({ logout }: { logout: () => Promise<void> }) => (
    <>
        <Link href="/dashboard" passHref prefetch={true}>
            <Button variant="outline" size="default">Dashboard</Button>
        </Link>
        <Button onClick={() => logout()} size="default">Cerrar sesión</Button>
    </>
);

const GuestMenuDesktop = () => (
    <>
        <Link href="/login" passHref prefetch={true}>
            <Button variant="outline" size="default">Iniciar sesión</Button>
        </Link>
        <Link href="/register" passHref prefetch={true}>
            <Button size="default">Registrarse</Button>
        </Link>
    </>
);

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
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