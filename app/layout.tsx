// app\layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { inter } from '@/config/fonts';
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'TrailApp',
  description: 'Gestión de trails',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster position='top-right' expand={false} richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  )
}
