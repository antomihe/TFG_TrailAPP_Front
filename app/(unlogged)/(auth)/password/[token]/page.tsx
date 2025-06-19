// app\(unlogged)\(auth)\password\[token]\page.tsx
'use client';

import ResetPasswordForm from './components/ResetPasswordForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  return (
    <div className="flex items-center justify-center p-4 ">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold">Establecer Nueva Contraseña</CardTitle>
          <CardDescription className="pt-1">
            Elige una contraseña segura para tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-2">
          <ResetPasswordForm token={params.token} />
        </CardContent>
        <CardFooter className="pt-4 flex flex-col items-center">
           <p className="text-sm text-muted-foreground">
            ¿Problemas? <Link href="/password" className="font-medium text-primary hover:underline">Solicita un nuevo enlace</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}