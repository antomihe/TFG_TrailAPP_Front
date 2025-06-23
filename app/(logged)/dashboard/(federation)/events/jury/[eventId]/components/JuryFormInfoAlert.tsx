import { Alert, AlertDescription, AlertTitle, Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui"
import { cn } from "@/lib/utils";
import { ChevronDownIcon, EyeIcon, EyeOffIcon, InfoIcon, XIcon } from "lucide-react";

type JuryFormInfoAlertProps = {
    isInfoAlertOpen: boolean;
    setIsInfoAlertOpen: (open: boolean) => void;
    alertDescription: string;
}

export const JuryFormInfoAlert: React.FC<JuryFormInfoAlertProps> = ({isInfoAlertOpen, setIsInfoAlertOpen, alertDescription}: JuryFormInfoAlertProps) => {
    return (
        <Collapsible open={isInfoAlertOpen} onOpenChange={setIsInfoAlertOpen} className="mb-6 mx-2 sm:mx-0">
            <Alert className="bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700/50 text-amber-800 dark:text-amber-300">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <InfoIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 sm:mr-3" />
                        <AlertTitle className="font-semibold text-amber-700 dark:text-amber-300">
                            Info Designaciones
                        </AlertTitle>
                    </div>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/50">
                            <span className="sr-only">{isInfoAlertOpen ? "Ocultar" : "Mostrar"} información</span>
                            <ChevronDownIcon className={cn("h-5 w-5 transition-transform", isInfoAlertOpen && "rotate-180")} />
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    <AlertDescription className="mt-3 text-sm space-y-2 text-amber-700/90 dark:text-amber-300/90">
                        <p>{alertDescription}</p>
                        <p className="mt-2 font-medium">Gestión:</p>
                        <ul className="list-disc list-inside pl-4 text-xs">
                            <li><strong>Juez Local:</strong> Seleccione un oficial.</li>
                            <li><strong>Nacional (RFEA):</strong> No editable aquí. Para cambiar a local, use <EyeOffIcon className="inline h-3 w-3 relative -top-px" />.</li>
                            <li><strong>Solicitar Nacional:</strong> Para un puesto local, use <EyeIcon className="inline h-3 w-3 relative -top-px" />. Nombre local se borrará.</li>
                            <li><strong>Eliminar:</strong> Use <XIcon className="inline h-3 w-3 relative -top-px" /> (no para Juez Árbitro).</li>
                        </ul>
                    </AlertDescription>
                </CollapsibleContent>
            </Alert>
        </Collapsible>
    )
}