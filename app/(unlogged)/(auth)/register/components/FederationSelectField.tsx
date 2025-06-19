// app\(unlogged)\(auth)\register\components\FederationSelectField.tsx
// app(unlogged)/(auth)/register/components/FederationSelectField.tsx
'use client';

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useField, useFormikContext, FieldHookConfig } from 'formik';
import { Label } from "@/components/ui/label";
import { FederationOption } from "@/hooks/api/unlogged/auth/useOfficialRegistration";

interface FederationSelectFieldProps extends Omit<FieldHookConfig<string>, 'component' | 'children' | 'as' | 'render'> {
    label: string;
    options: FederationOption[];
    disabled?: boolean;
    placeholder?: string;
    popoverContentProps?: React.ComponentPropsWithoutRef<typeof PopoverContent>;
    loading?: boolean; 
}

export const FederationSelectField: React.FC<FederationSelectFieldProps> = ({
    label,
    options,
    disabled = false,
    placeholder = "Selecciona una federación...",
    popoverContentProps,
    loading = false,
    ...props 
}) => {
    const [field, meta, helpers] = useField(props.name);
    const { setFieldValue } = useFormikContext();
    const [open, setOpen] = React.useState(false);

    const selectedOption = options.find(option => option.code === field.value);

    return (
        <div className="space-y-1 w-full">
            {label && <Label htmlFor={props.id || props.name}>{label}</Label>}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={props.id || props.name}
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                            meta.touched && meta.error && "border-destructive focus-visible:ring-destructive"
                        )}
                        disabled={disabled || loading || options.length === 0}
                    >
                        {loading 
                            ? "Cargando federaciones..." 
                            : selectedOption 
                                ? selectedOption.name 
                                : <span className="text-muted-foreground">{options.length === 0 && !loading ? "No hay federaciones" : placeholder}</span>
                        }
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent 
                    className="w-[--radix-popover-trigger-width] p-0" 
                    onCloseAutoFocus={() => helpers.setTouched(true)}
                    {...popoverContentProps}
                >
                    <Command>
                        <CommandInput placeholder="Buscar federación..." />
                        <CommandList>
                            <CommandEmpty>Sin coincidencias.</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.code}
                                        value={option.name} 
                                        onSelect={() => {
                                            setFieldValue(field.name, option.code);
                                            helpers.setTouched(true);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                field.value === option.code ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option.name} ({option.code})
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {meta.touched && meta.error && (
                <p className="text-sm text-destructive mt-1">{meta.error}</p>
            )}
        </div>
    );
};