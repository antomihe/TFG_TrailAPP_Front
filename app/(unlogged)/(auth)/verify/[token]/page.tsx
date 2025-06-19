import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import VerifyForm from "./components/AccountVerificationForm"

export default function PasswordPage({ params }: { params: { token: string } }) {

  return (
    <Card className="w-full max-w-md mx-auto ">
      <CardHeader>
        <CardTitle>Registra tu contraseña</CardTitle>
        <CardDescription>Asocia una contraseña a tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyForm
          token={params.token}
        />
      </CardContent>
      <CardFooter>

      </CardFooter>
    </Card>



  )
}
