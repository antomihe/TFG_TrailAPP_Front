// components\ui\locationInput.tsx
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
import { useLocations } from "@/hooks/components/useLocations"

export interface LocationComponentProps {
  label?: string;
  id?: string;
  name?: string;
  province: string;
  locationValue: string;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
  disabled?: boolean;
}

export function LocationComponent({
  label,
  id = "location",
  name = "location",
  province,
  locationValue,
  setFieldValue,
  setFieldTouched,
  disabled = false,
}: LocationComponentProps) {
  const [open, setOpen] = React.useState(false);
  const { locations, isLoading, fetchError } = useLocations(province);

  return (
    <div className="space-y-1 w-full">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Popover open={open} onOpenChange={(open) => {
        setOpen(open);
        if (!open) setFieldTouched(name, true, true);
      }}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            name={name}
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal",
              !locationValue && "text-muted-foreground"
            )}
            disabled={disabled || isLoading || !province || (locations.length === 0 && !isLoading && !fetchError)}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {locationValue
              ? locationValue
              : (!province
                ? "Selecciona una provincia primero"
                : locations.length === 0 && !isLoading && !fetchError
                  ? "No hay localidades"
                  : "Seleccione localidad...")}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Buscar localidad..." />
            <CommandList>
              {fetchError && (
                <CommandEmpty className="text-destructive py-2 px-4 text-sm">
                  {fetchError} Inténtalo de nuevo.
                </CommandEmpty>
              )}
              {!fetchError && isLoading && <CommandEmpty>Cargando...</CommandEmpty>}
              {!fetchError && !isLoading && locations.length === 0 && (
                <CommandEmpty>
                  {!province ? "Selecciona una provincia." : `No hay localidades para ${province}.`}
                </CommandEmpty>
              )}
              <CommandGroup>
                {locations.map((locOption) => (
                  <CommandItem
                    key={locOption.value}
                    value={locOption.label}
                    onSelect={() => {
                      setFieldValue(name, locOption.value, true);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        locationValue === locOption.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {locOption.label}
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
