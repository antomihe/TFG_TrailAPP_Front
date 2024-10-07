import PasswordForm from '@/app/(unlogged)/(auth)/password/[token]/components/PasswordForm'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PasswordPage({ params }: { params: { token: string } }) {

  return (
    <Card className="w-full max-w-md mx-auto ">
      <CardHeader>
        <CardTitle>Registra tu contraseña</CardTitle>
        <CardDescription>Asocia una contraseña a tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <PasswordForm
          token={params.token}
        />
      </CardContent>
      <CardFooter>

      </CardFooter>
    </Card>



  )
}
