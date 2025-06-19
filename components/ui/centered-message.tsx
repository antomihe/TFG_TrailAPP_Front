// components\ui\centered-message.tsx
import { Alert, AlertDescription, AlertTitle } from "./alert";

export const CenteredMessage: React.FC<{
    icon?: React.ReactNode;
    title: string;
    message: string | React.ReactNode;
    action?: React.ReactNode;
    variant?: "default" | "destructive" | "warning";
}> = ({ icon, title, message, action, variant = "default" }) => {
    let alertClasses = "dark:bg-neutral-800/30";
    let iconClasses = "text-primary";
    if (variant === "destructive") {
        alertClasses = "border-destructive/50 text-destructive dark:border-destructive/30";
        iconClasses = "text-destructive";
    } else if (variant === "warning") {
        alertClasses = "border-yellow-500/50 text-yellow-700 dark:text-yellow-500 dark:border-yellow-500/30 bg-yellow-50 dark:bg-yellow-500/10";
        iconClasses = "text-yellow-600 dark:text-yellow-400";
    }

    return (
        <div className="flex flex-col items-center justify-center py-8 text-center min-h-[400px]">
            <Alert className={`max-w-lg w-full ${alertClasses}`}>
                {icon && <div className={`mb-4 flex justify-center ${iconClasses}`}>{icon}</div>}
                <AlertTitle className={`text-xl font-semibold ${variant === 'destructive' ? '!text-destructive' : ''} ${variant === 'warning' ? 'text-yellow-700 dark:text-yellow-300' : ''}`}>{title}</AlertTitle>
                <AlertDescription className={`${variant === 'destructive' ? '!text-destructive' : ''} ${variant === 'warning' ? 'text-yellow-600 dark:text-yellow-500' : ''} mt-2`}>
                    {message}
                </AlertDescription>
                {action && <div className="mt-6">{action}</div>}
            </Alert>
        </div>
    );
};
