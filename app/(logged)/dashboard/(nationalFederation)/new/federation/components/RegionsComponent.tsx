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
    region: string;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
}

export function RegionsComponent({ setError, region, setFieldValue, setFieldTouched}: Props) {
    const [open, setOpen] = React.useState(false);
    const [regions, setRegions] = React.useState<{ label: string; value: string }[]>([]);

    React.useEffect(() => {
        const fetchRegions = async () => {
            try {
                const { data } = await api().get('users/federation/unregistered');
                
                const fetchedRegions = data.map((result: { region: string }) => ({
                    label: result.region,
                    value: result.region
                }));

                setRegions(fetchedRegions);
            } catch (error) {
                setError('Error al cargar las comunidades autónomas');
            }
        };

        fetchRegions();
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
                    {region ? region : <span className="text-muted-foreground">Seleccione comunidad autónoma...</span>}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
             className="w-[200px] p-0"
             onBlur={() => setFieldTouched('region', true)}
             >
                <Command>
                    <CommandInput placeholder="Buscar comunidad autónoma..." />
                    <CommandList>
                        <CommandEmpty>Sin coincidencias</CommandEmpty>
                        <CommandGroup>
                            {regions.map((reg) => (
                                <CommandItem
                                    key={reg.value}
                                    onSelect={(currentValue) => {
                                        setOpen(false);
                                        setFieldValue('region', currentValue);  
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            region === reg.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {reg.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
