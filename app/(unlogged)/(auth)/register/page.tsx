import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OfficialForm from "./components/OfficialRegistrationForm"
import AthleteForm from "./components/AthleteRegistrationForm"


export default function RegisterPage() {
  return (
    <div className="flex justify-center">
      <Tabs defaultValue="athlete" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="athlete">Atleta</TabsTrigger>
          <TabsTrigger value="official">Juez</TabsTrigger>
        </TabsList>
        <TabsContent value="official">
          <Card>
            <CardHeader>
              <CardTitle>Juez</CardTitle>
              <CardDescription>
                Deberá ser validada por la federación correspondiente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OfficialForm />
            </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="athlete">
          <Card>
            <CardHeader>
              <CardTitle>Atleta</CardTitle>
              <CardDescription>
                Auto-registo a la plataforma.
              </CardDescription>
            </CardHeader>
              <CardContent>
                <AthleteForm />
              </CardContent>
            <CardFooter>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
