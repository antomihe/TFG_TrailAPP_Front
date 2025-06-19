// app\(unlogged)\(auth)\login\page.tsx

'use client'; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; 
import LoginForm from "@/app/(unlogged)/(auth)/login/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">¡Bienvenido de nuevo!</CardTitle>
          <CardDescription>Introduce tus credenciales para acceder a tu cuenta.</CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col items-center pt-2 pb-6">
          <p className="text-center text-sm text-muted-foreground">
            {"¿Olvidaste tu contraseña? "}
            <Link href="/password" className="font-medium text-primary hover:underline">
              Recupérala aquí
            </Link>
          </p>
          <Separator className="my-4 w-full" />
          <p className="text-center text-sm text-muted-foreground">
            {"¿No tienes una cuenta? "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}