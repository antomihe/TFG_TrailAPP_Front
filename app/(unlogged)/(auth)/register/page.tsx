// app\(unlogged)\(auth)\register\page.tsx
// app/(unlogged)/(auth)/register/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OfficialForm from "./components/OfficialRegistrationForm"
import AthleteForm from "./components/AthleteRegistrationForm"

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-start md:items-center">
      <Tabs defaultValue="athlete" className="w-[20rem] md:w-[28rem]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="athlete" className="w-full">Atleta</TabsTrigger>
          <TabsTrigger value="official" className="w-full">Juez</TabsTrigger>
        </TabsList>
        <TabsContent value="official">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Juez</CardTitle>
              <CardDescription>
                Deberá ser validada por la federación correspondiente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OfficialForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="athlete">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Atleta</CardTitle>
              <CardDescription>
                Auto-registo a la plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AthleteForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}