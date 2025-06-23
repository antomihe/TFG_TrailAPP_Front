// app\(logged)\dashboard\(nationalFederation)\jury\[eventId]\components\NationalJuryFormInfoAlert.tsx
import { Alert, AlertTitle, AlertDescription, Button, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, EyeIcon, EyeOffIcon, InfoIcon, XIcon } from "lucide-react";

interface NationalJuryFormInfoAlertProps {
    isInfoAlertOpen: boolean;
    setIsInfoAlertOpen: (open: boolean) => void;
}

export const NationalJuryFormInfoAlert: React.FC<NationalJuryFormInfoAlertProps> = ({ isInfoAlertOpen, setIsInfoAlertOpen }) => {
    return (
        <Collapsible open={isInfoAlertOpen} onOpenChange={setIsInfoAlertOpen} className="mb-6 mx-2 sm:mx-0">
            <Alert className="bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700/50 text-blue-800 dark:text-blue-300">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <InfoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 sm:mr-3" />
                        <AlertTitle className="font-semibold text-blue-700 dark:text-blue-300">
                            Info Jurado Nacional
                        </AlertTitle>
                    </div>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50">
                            <span className="sr-only">{isInfoAlertOpen ? "Ocultar" : "Mostrar"} información</span>
                            <ChevronDownIcon className={cn("h-5 w-5 transition-transform", isInfoAlertOpen && "rotate-180")} />
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    <AlertDescription className="mt-3 text-sm space-y-2 text-blue-700/90 dark:text-blue-300/90">
                        <p>
                            Asigne jueces nacionales (RFEA) a este evento o devuelva designaciones.
                        </p>
                        <p className="mt-2 font-medium">Gestión:</p>
                        <ul className="list-disc list-inside pl-4 text-xs">
                            <li><strong>Asignar Juez Nacional:</strong> Si un puesto es 'Nacional', seleccione un oficial RFEA.</li>
                            <li><strong>Devolver a Autonómica:</strong> Para un puesto 'Nacional', use <EyeOffIcon className="inline h-3 w-3 relative -top-px" /> para convertirlo a designación autonómica. El nombre se borrará.</li>
                            <li><strong>Marcar como Nacional:</strong> Para un puesto autonómico, use <EyeIcon className="inline h-3 w-3 relative -top-px" />. La RFEA gestionará la asignación.</li>
                            <li><strong>Eliminar/Devolver (sin asignar):</strong> Use <XIcon className="inline h-3 w-3 relative -top-px" />. Si es nacional y sin nombre, se entiende como devolución. El Juez Árbitro no puede eliminarse.</li>
                        </ul>
                    </AlertDescription>
                </CollapsibleContent>
            </Alert>
        </Collapsible>
    )
}