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
}

export function ProvincesComponent({ setError, province, location, setFieldValue }: Props) {
    const [open, setOpen] = React.useState(false)

    const getProvinces = async () => {
        try {
            const result = [];
            const { data } = await api().get('ubi/provinces');

            for (const province of data) {
                result.push({
                    label: province.name,
                    value: province.name
                });
            }

            return result;
        } catch (error) {
            setError('Error al cargar las provincias');
        }
    }

    const [provinces, setProvinces] = React.useState<{ label: any; value: any; }[]>([]);

    React.useEffect(() => {
        const fetchProvinces = async () => {
            const result = await getProvinces();
            if (result) {
                setProvinces(result);
            }
        };

        fetchProvinces();
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {province ? province : "Seleccione provincia..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Buscar provincia..." />
                    <CommandList>
                        <CommandEmpty>Sin coincidencias</CommandEmpty>
                        <CommandGroup>
                            {provinces.map((prov) => (
                                <CommandItem
                                    key={prov.value}
                                    onSelect={(currentValue) => {
                                        setOpen(false);
                                        setFieldValue('province', currentValue);
                                        location && setFieldValue('location', '');
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            province === prov.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {prov.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
