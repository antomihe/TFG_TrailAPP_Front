import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui"
import LoginForm from "@/app/(unlogged)/(auth)/login/components/LoginForm"
import Link from "next/link"

export default function LoginFormPage() {
  return (
    <Card className="w-full max-w-md mx-auto ">
      <CardHeader>
        <CardTitle>Inicia sesión</CardTitle>
        <CardDescription>Introduce tus credenciales de acceso</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-6">
          <LoginForm />
        </div>

      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <Separator className="mt-3 w-full" />
        <p className="text-center text-sm text-gray-600 mt-4 mb-2">
          {"¿Olvidaste tu contraseña? "}
          <Link href="/password" className="text-blue-500 hover:underline">
            recupera tu cuenta
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}