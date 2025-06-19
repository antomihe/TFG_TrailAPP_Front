
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RequestPasswordResetForm from "./components/RequestPasswordResetForm"; 
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function RequestPasswordResetPage() { 
  return (
    <div className="flex items-center justify-center p-4 ">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold">Recuperar Contraseña</CardTitle>
          <CardDescription className="pt-1">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-2"> 
          <RequestPasswordResetForm />
        </CardContent>
        <CardFooter className="pt-4 flex flex-col items-center">
          <Separator className="w-full mb-4" />
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Volver a Iniciar Sesión
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}