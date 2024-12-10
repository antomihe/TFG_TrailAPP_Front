import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "./alert";

export function AlertComponent({ message, className }: { message: string; className?: string }) {
    return (
        <div className={`flex items-center justify-center max-w-xl mx-auto p-4 ${className || ""}`}>
            <Alert className="flex items-center space-x-2 p-5">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertDescription>
                    {message}
                </AlertDescription>
            </Alert>
        </div>
    );
}
