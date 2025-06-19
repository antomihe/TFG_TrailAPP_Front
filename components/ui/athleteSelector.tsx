// components\ui\athleteSelector.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Ban, Check, ChevronsUpDown } from "lucide-react";

export interface Athlete {
  id: string;
  name: string;
  dorsal: number;
  isDisqualified?: boolean;
}

export interface AthleteSelectorProps {
  athletes: Athlete[];
  selectedValue: string | null;
  onSelect: (athleteId: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  popoverContentProps?: React.ComponentPropsWithoutRef<typeof PopoverContent>;
  id?: string;
  setFieldTouched?: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
}

export const AthleteSelector: React.FC<AthleteSelectorProps> = ({
  athletes,
  selectedValue,
  onSelect,
  label,
  placeholder = "Selecciona un atleta...",
  disabled = false,
  popoverContentProps,
  id = "athlete-selector",
  setFieldTouched = () => {},
}) => {
  const [open, setOpen] = useState(false);

  const selectedAthlete = athletes.find(athlete => athlete.id === selectedValue);
  const displayValue = selectedAthlete
    ? `(${selectedAthlete.dorsal}) ${selectedAthlete.name}`
    : athletes.length === 0
      ? "No hay atletas disponibles"
      : placeholder;

  return (
    <div className="space-y-1">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Popover open={open} onOpenChange={(openState) => {
        setOpen(openState);
        if (!openState) setFieldTouched(id, true, true);
      }}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-between",
              !selectedValue && "text-muted-foreground"
            )}
            role="combobox"
            aria-expanded={open}
            disabled={disabled || athletes.length === 0}
          >
            <span className="truncate">{displayValue}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          {...popoverContentProps}
        >
          <Command>
            <CommandInput placeholder={`Buscar ${label ? label.toLowerCase() : "atleta"} (nombre o dorsal)...`} />
            <CommandList>
              <CommandEmpty>Sin coincidencias.</CommandEmpty>
              <CommandGroup>
                {athletes.map(athlete => (
                  <CommandItem
                    key={athlete.id}
                    value={`${athlete.dorsal} ${athlete.name}`} // Usar un valor único y descriptivo para el filtrado de Command
                    onSelect={() => {
                      onSelect(athlete.id);
                      setOpen(false);
                    }}
                    disabled={athlete.isDisqualified}
                    className={cn("cursor-pointer", athlete.isDisqualified && "text-muted-foreground line-through")}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue === athlete.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    ({athlete.dorsal}) - {athlete.name}
                    {athlete.isDisqualified && <Ban className="h-4 w-4 ml-1 text-red-600" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};