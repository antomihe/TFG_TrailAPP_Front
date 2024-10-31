'use client';

import * as React from "react";
import { format, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Props = {
    date: Date | string | null;
    fromDate?: Date | undefined;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
};

const setDateToNoon = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(12, 0, 0, 0);
    return newDate;
};

export function DateInput({ date, setFieldValue, setFieldTouched, fromDate = undefined }: Props) {
    const validDate = typeof date === 'string' ? setDateToNoon(parseISO(date)) : date;

    const isDateValid = validDate && isValid(validDate);

    const handleSelectDate = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setFieldValue('date', setDateToNoon(selectedDate));
        }
    };

    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
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
                    onBlur={() => setFieldTouched("date", true)}
                    className="w-auto p-0">
                    <Calendar
                        mode="single"
                        fromDate={fromDate}
                        selected={isDateValid ? validDate : undefined}
                        required={true}
                        onSelect={handleSelectDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
