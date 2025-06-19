// components\ui\dateInput.tsx
'use client';

import * as React from "react";
import { format, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "./label";

export type DateInputProps = {
    id?: string;
    name?: string;
    date: Date | string | null;
    fromDate?: Date;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
    disabled?: boolean;
    label?: string;
};

const setDateToNoon = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(12, 0, 0, 0);
    return newDate;
};

export function DateInput({
    label,
    id = "date",
    name = "date",
    date,
    setFieldValue,
    setFieldTouched,
    fromDate,
    disabled = false,
}: Props) {
    const validDate = typeof date === "string" ? setDateToNoon(parseISO(date)) : date;
    const isDateValid = validDate && isValid(validDate);

    const handleSelectDate = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setFieldValue(name, setDateToNoon(selectedDate), true);
        }
    };

    return (
        <div>
            {label && <Label htmlFor={id}>{label}</Label>}
            <Popover
                onOpenChange={(open) => {
                    if (!open) {
                        const shouldValidate = !isDateValid;
                        setFieldTouched(name, true, shouldValidate);
                    }
                }}
            >

                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id={id}
                        name={name}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !isDateValid && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {isDateValid ? format(validDate!, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0"
                >
                    <Calendar
                        mode="single"
                        fromDate={fromDate}
                        selected={isDateValid ? validDate : undefined}
                        required
                        onSelect={handleSelectDate}
                        initialFocus
                        disabled={disabled}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
