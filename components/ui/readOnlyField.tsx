// components\ui\readOnlyField.tsx
import { Input } from "./input";
import { Label } from "./label";
import { Skeleton } from "./skeleton";

export const ReadOnlyField: React.FC<{ label: string; value: string | undefined; isLoading?: boolean }> = ({
    label,
    value,
    isLoading = false,
}) => (
    <div className="space-y-1">
        <Label htmlFor={`display-${label.toLowerCase().replace(/\s/g, '-')}`}>{label}</Label>
        {isLoading ? (
            <Skeleton className="h-10 w-full" />
        ) : (
            <Input
                id={`display-${label.toLowerCase().replace(/\s/g, '-')}`}
                value={value || 'N/A'}
                disabled={true}
                readOnly
                className="cursor-not-allowed" 
            />
        )}
    </div>
);