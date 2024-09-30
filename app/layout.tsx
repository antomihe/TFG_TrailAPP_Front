import type { Metadata } from 'next';
import { inter } from '@/config/fonts';
import { ThemeProvider } from "@/components/ui/theme/theme-provider"
import { useTheme } from 'next-themes';
import Image from 'next/image';

import './globals.css';

export const metadata: Metadata = {
  title: 'TrailApp',
  description: 'Gestión de trails',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
