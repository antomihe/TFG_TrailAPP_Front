'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch'; 

type Props = {
    values: { name: string; optional: boolean; removed?: boolean }[];
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
};

export default function EquipmentInput({ values, setFieldValue, setFieldTouched }: Props) {
    const [inputValue, setInputValue] = useState<string>('');
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
    const [isOptional, setIsOptional] = useState<boolean>(false);

    useEffect(() => {
        setButtonDisabled(
            inputValue.trim() === '' ||
            values.some((item) => item.name.toLowerCase() === inputValue.trim().toLowerCase())
        );
    }, [inputValue, values]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTag();
        }
    };

    const addTag = () => {
        const trimmedValue = inputValue.trim();
        if (trimmedValue && !values.some((item) => item.name.toLowerCase() === trimmedValue.toLowerCase())) {
            setFieldValue('equipment', [...values, { name: trimmedValue, optional: isOptional }]);
            setFieldTouched('equipment', true, false);
            setInputValue('');
            setIsOptional(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Input
                id="equipment"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={() => setFieldTouched('equipment', true)}
                onKeyDown={handleKeyDown}
                placeholder="Añadir material"
                className="flex-grow"
            />
            <label className="flex items-center text-sm">
                <span className="mr-2">Opcional</span>
                <Switch
                    checked={isOptional}
                    onCheckedChange={(checked) => setIsOptional(checked)}
                    className="h-6 w-12"
                />
            </label>
            <Button
                onClick={addTag}
                variant="default"
                disabled={buttonDisabled}
            >
                Añadir
            </Button>
        </div>
    );
}
