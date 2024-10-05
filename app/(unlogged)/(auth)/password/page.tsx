import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import EmailForm from "./components/EmailForm"

export default function PasswordPage({ params }: { params: { token: string } }) {
 
  return (
    <Card className="w-full max-w-md mx-auto ">
      <CardHeader>
        <CardTitle>Recupera tu contraseña</CardTitle>
        <CardDescription>Enviaremos un link a tu email para restaurar la contraseña</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-6">
          <EmailForm />
        </div>

      </CardContent>
      <CardFooter>

      </CardFooter>
    </Card>



  )
}
