import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import LoginForm from "@/app/(unlogged)/(auth)/login/components/LoginForm"

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
      <CardFooter>

      </CardFooter>
    </Card>
  )
}