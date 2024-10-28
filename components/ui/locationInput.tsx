"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
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
import api from "@/config/api"

type Props = {
    setError: (error: string) => void;
    province: string;
    location: string;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
}

export function LocationComponent({ setError, province, location, setFieldValue, setFieldTouched }: Props) {
    const [open, setOpen] = React.useState(false)
    const [locations, setLocations] = React.useState<{ label: any; value: any; }[]>([]);
    
    const getLocations = async () => {
        try {
            const result = [];
            const { data } = await api().get(`ubi/locations/${province}`);

            for (const location of data) {
                result.push({
                    label: location.name,
                    value: location.name
                });
            }

            return result;
        } catch (error) {
            setError('Error al cargar las localidades');
        }
    }


    React.useEffect(() => {
        const fetchProvinces = async () => {
            const result = await getLocations();
            if (result) {
                setLocations(result);
            }
        };

        fetchProvinces();
    }, []);

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between font-normal", !location && "text-accent-foreground")}
                >
                    {location ? location : "Seleccione localidad..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[200px] p-0"
                onBlur={() => setFieldTouched('location', true)}
            >
                <Command>
                    <CommandInput placeholder="Buscar localidad..." />
                    <CommandList>
                        <CommandEmpty>Sin coincidencias</CommandEmpty>
                        <CommandGroup>
                            {locations.map((loc) => (
                                <CommandItem
                                    key={loc.value}
                                    onSelect={(currentValue) => {
                                        setOpen(false);
                                        setFieldValue('location', currentValue);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            location === loc.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {loc.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
