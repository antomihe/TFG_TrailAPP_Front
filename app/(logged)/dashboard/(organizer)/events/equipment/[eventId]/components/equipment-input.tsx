'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

type Tag = { name: string; optional: boolean };

type Props = {
    values: Tag[];
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
    setSubmitted: (value: string) => void;
};

export default function EquipmentInput({ values, setFieldValue, setFieldTouched, setSubmitted }: Props) {
    const [inputValue, setInputValue] = useState<string>('');
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
    const [isOptional, setIsOptional] = useState<boolean>(false);

    React.useEffect(() => {
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
        setSubmitted('');
    };

    const removeTag = (index: number) => {
        const updatedValues = values.filter((_, i) => i !== index);
        setFieldValue('equipment', updatedValues);
        setSubmitted('');
    };

    return (
        <div className="space-y-4 p-4">
            <div className="mb-2">
                <h2 className="text-lg font-bold">Material</h2>
            </div>
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
                    <Checkbox
                        checked={isOptional}
                        onCheckedChange={(checked) => setIsOptional(checked === true)}
                        className="mr-2"
                    />
                    Opcional
                </label>
                <Button
                    onClick={addTag}
                    variant="default"
                    disabled={buttonDisabled}
                >
                    Añadir
                </Button>
            </div>
            {values.length > 0 ? (
                <ul className="space-y-2 mt-4">
                    {values.map((item, index) => (
                        <li
                            key={index}
                            className="flex justify-between items-center border rounded-md px-3 py-2"
                        >
                            <span>
                                {item.name} {item.optional && <span className="text-sm text-gray-500">(Opcional)</span>}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTag(index)}
                                className="hover:bg-red-100 text-red-500"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500 mt-4">No hay material agregado.</p>
            )}
        </div>
    );
}
