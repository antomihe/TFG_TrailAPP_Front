// components\ui\provinceInput.tsx
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { useProvinces } from "@/hooks/components/useProvinces"

export interface ProvincesComponentProps {
    label?: string;
    id?: string;
    name?: string;
    locationName?: string;
    provinceValue: string;
    locationValue?: string;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
    disabled?: boolean;
}

export function ProvincesComponent({
    label,
    id = "province",
    name = "province",
    locationName = "location",
    provinceValue,
    locationValue,
    setFieldValue,
    setFieldTouched,
    disabled = false,
}: ProvincesComponentProps) {
    const [open, setOpen] = React.useState(false);
    const { provinces, isLoading, error: fetchError } = useProvinces();

    return (
        <div className="space-y-1 w-full">
            {label && <Label htmlFor={id}>{label}</Label>}
            <Popover open={open} onOpenChange={(open) => {
                setOpen(open);
                if (!open) {
                    setFieldTouched(name, true, true); 
                }
            }}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        variant="outline"
                        role="combobox"
                        name={name}
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between font-normal",
                            !provinceValue && "text-muted-foreground"
                        )}
                        disabled={disabled || isLoading || (provinces.length === 0 && !isLoading && !fetchError)}
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {provinceValue
                            ? provinceValue
                            : (provinces.length === 0 && !isLoading && !fetchError) ? "No hay provincias" : "Seleccione provincia..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder="Buscar provincia..." />
                        <CommandList>
                            {fetchError && <CommandEmpty className="text-destructive py-2 px-4 text-sm">{fetchError} Inténtalo de nuevo.</CommandEmpty>}
                            {!fetchError && isLoading && <CommandEmpty>Cargando...</CommandEmpty>}
                            {!fetchError && !isLoading && provinces.length === 0 && <CommandEmpty>No hay provincias disponibles.</CommandEmpty>}
                            <CommandGroup>
                                {provinces.map((provOption) => (
                                    <CommandItem
                                        key={provOption.value}
                                        value={provOption.label}
                                        onSelect={() => {
                                            setFieldValue(name, provOption.value, true);
                                            try {
                                                setFieldValue(locationName, '', false);
                                                setFieldTouched(locationName, false, false);
                                            } catch (e) {
                                                console.warn('Campo location aún no disponible en Formik. Será limpiado más tarde si existe.');
                                            }
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                provinceValue === provOption.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {provOption.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
