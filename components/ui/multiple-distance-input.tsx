// components\ui\multiple-distance-input.tsx
'use client';

import React, { useState, useEffect } from 'react'; 
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Label } from '@/components/ui/label'; 

interface MultipleDistanceInputProps {    
    name: string; 
    value: number[]; 
    onChange: (value: number[]) => void;
    onBlur?: () => void;
    label?: string;
}

export function MultipleDistanceInput({
  name,
  value,
  onChange,
  onBlur,
  label = "Distancias",
}: MultipleDistanceInputProps) {
    const [inputValue, setInputValue] = useState<string>('');
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
    const currentDistances = value || [];

    useEffect(() => {
        const numValue = parseFloat(inputValue.replace(',', '.'));
        setButtonDisabled(
            inputValue.trim() === '' ||
            isNaN(numValue) || 
            numValue <= 0 || 
            currentDistances.includes(numValue)
        );
    }, [inputValue, currentDistances]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addDistance();
        }
    };

    const addDistance = () => {
        const numValue = parseFloat(inputValue.replace(',', '.'));
        if (!isNaN(numValue) && numValue > 0 && !currentDistances.includes(numValue)) {
            onChange([...currentDistances, numValue]);
            if (onBlur) onBlur();
            setInputValue('');
        }
    };

    const removeDistance = (indexToRemove: number) => {
        const newDistances = currentDistances.filter((_, index) => index !== indexToRemove);
        onChange(newDistances);
        if (onBlur) onBlur();
    };

    return (
        <div className="space-y-1">
            <Label htmlFor={name}>{label}</Label> 
            <div className="flex items-center gap-2">
                <Input
                    id={name} 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value.replace(/[^0-9.,]/g, ''))}
                    onBlur={onBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="Añadir distancia en km (ej. 10.5)"
                    className="flex-grow"
                    type="text" 
                    inputMode="decimal" 
                />
                <Button
                    type="button" 
                    onClick={addDistance}
                    variant="default"
                    disabled={buttonDisabled}
                >
                    Añadir
                </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 min-h-[30px]">
                {currentDistances.map((distanceValue, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center text-center bg-secondary text-secondary-foreground rounded-full text-sm px-3 py-1"
                    >
                        <span>{distanceValue.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km</span>
                        <Button
                            type="button"
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeDistance(index)}
                            className="ml-1 h-6 w-6 p-0 hover:bg-destructive/20"
                            aria-label={`Quitar distancia ${distanceValue}km`}
                        >
                            <X className='h-4 w-4 text-muted-foreground hover:text-destructive' />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
