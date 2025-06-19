// app\(logged)\dashboard\(nationalFederation)\new\federation\components\RegionsSelectField.tsx
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
import { RegionOption } from "@/hooks/api/dashboard/nationalFederation/useNewFederationForm";

interface RegionsSelectFieldProps extends Omit<FieldHookConfig<string>, 'component' | 'children' | 'as' | 'render'> {
    label: string;
    options: RegionOption[];
    disabled?: boolean;
    placeholder?: string;
    popoverContentProps?: React.ComponentPropsWithoutRef<typeof PopoverContent>;
}

export const RegionsSelectField: React.FC<RegionsSelectFieldProps> = ({
    label,
    options,
    disabled = false,
    placeholder = "Seleccione una región...",
    popoverContentProps,
    ...props 
}) => {
    const [field, meta, helpers] = useField(props.name); 
    const { setFieldValue } = useFormikContext(); 
    const [open, setOpen] = React.useState(false);

    const selectedOption = options.find(option => option.value === field.value);

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
                        disabled={disabled || options.length === 0}
                    >
                        {selectedOption ? selectedOption.label : <span className="text-muted-foreground">{options.length === 0 ? "No hay regiones" : placeholder}</span>}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent 
                    className="w-[--radix-popover-trigger-width] p-0"
                    onCloseAutoFocus={() => helpers.setTouched(true)} 
                    {...popoverContentProps}
                >
                    <Command>
                        <CommandInput placeholder="Buscar región..." />
                        <CommandList>
                            <CommandEmpty>Sin coincidencias.</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label} 
                                        onSelect={() => {
                                            setFieldValue(field.name, option.value);
                                            helpers.setTouched(true);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                field.value === option.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option.label}
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