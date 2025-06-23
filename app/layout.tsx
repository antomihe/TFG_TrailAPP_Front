// app\layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { inter } from '@/config/fonts';
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from '@/contexts/AuthContext';
import DemoToast from '@/components/layout/demoWarning';

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
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />

        <meta name="theme-color" content="#ffffff" />

        <title>TrailApp - Explora Nuevas Aventuras</title>
        <meta name="description" content="TrailApp es tu compañero ideal para descubrir, seguir y participar en eventos de trail running en toda España." />
        <meta name="keywords" content="Trail, Trail Running, Senderismo, Carreras, Eventos, Naturaleza, España, TrailApp" />
        <meta name="author" content="Antonio Miguel Herrero" />

        <meta property="og:title" content="TrailApp - Explora Nuevas Aventuras" />
        <meta property="og:description" content="Descubre rutas y eventos de trail por toda España con TrailApp." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://trailapp.antomihe.es" />

        <link rel="icon" href="./favicon.ico" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <AuthProvider>

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <DemoToast />
            {children}
          </ThemeProvider>
          <Toaster position='top-right' expand={false} richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  )
}
