// app\(logged)\dashboard\(organizer)\events\equipment\[eventId]\components\EquipmentInput.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label'; 
import { EquipmentItemForm } from '@/hooks/api/dashboard/organizer/useEventEquipment'; 

interface EquipmentInputProps {
  
  onAddEquipment: (equipmentItem: Omit<EquipmentItemForm, 'id' | 'removed'>) => void;
  existingEquipmentNames: string[]; 
  disabled?: boolean;
}

export default function EquipmentInput({ onAddEquipment, existingEquipmentNames, disabled }: EquipmentInputProps) {
    const [inputValue, setInputValue] = useState<string>('');
    const [isOptional, setIsOptional] = useState<boolean>(false);
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

    useEffect(() => {
        const trimmedValue = inputValue.trim().toLowerCase();
        setButtonDisabled(
            trimmedValue === '' ||
            existingEquipmentNames.includes(trimmedValue)
        );
    }, [inputValue, existingEquipmentNames]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !buttonDisabled) {
            event.preventDefault();
            addEquipmentItem();
        }
    };

    const addEquipmentItem = () => {
        const trimmedValue = inputValue.trim();
        if (!buttonDisabled && trimmedValue) { 
            onAddEquipment({ name: trimmedValue, optional: isOptional });
            setInputValue('');
            setIsOptional(false); 
        }
    };

    return (
        <div className="space-y-3 p-4 border rounded-lg dark:border-gray-700">
            <Label htmlFor="new-equipment-name" className="text-md font-semibold">Añadir Nuevo Material</Label>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <Input
                    id="new-equipment-name"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nombre del material (ej. Manta de Emergencia)"
                    autoComplete="off"
                    className="flex-grow"
                    disabled={disabled}
                />
                <div className="flex items-center space-x-2 pt-2 sm:pt-0">
                    <Switch
                        id="new-equipment-optional"
                        checked={isOptional}
                        onCheckedChange={setIsOptional}
                        disabled={disabled}
                    />
                    <Label htmlFor="new-equipment-optional" className="text-sm whitespace-nowrap">
                        Es opcional
                    </Label>
                </div>
                <Button
                    type="button" 
                    onClick={addEquipmentItem}
                    disabled={buttonDisabled || disabled}
                    className="w-full sm:w-auto"
                >
                    Añadir
                </Button>
            </div>
            {buttonDisabled && inputValue.trim() !== '' && (
                 <p className="text-xs text-destructive">Este material ya existe en la lista.</p>
            )}
        </div>
    );
}