'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type Props = {
    values: number[];
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
};

export default function MultipleDistanceInput({ values, setFieldValue, setFieldTouched }: Props) {
    const [inputValue, setInputValue] = useState<string>('');
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

    React.useEffect(() => {
        setButtonDisabled(inputValue === '' || values.includes(parseFloat(inputValue.replace(',', '.'))));
    }, [inputValue]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTag();
        }
    };

    const addTag = () => {
        const numValue = parseFloat(inputValue.replace(',', '.'));
        if (!isNaN(numValue) && !values.includes(numValue)) {
            setFieldValue('distances', [...values, numValue]);
            setFieldTouched('distances', true, false);
            setInputValue('');
        }
    };

    const removeTag = (index: number) => {
        setFieldValue('distances', values.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <label htmlFor="distances">Distancias</label>
            <div className="flex items-center gap-2">
                <Input
                    id="distances"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value.replace(/[^0-9.,]/g, ''))}
                    onBlur={() => setFieldTouched('distances', true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Añadir distancia en km"
                    className="flex-grow"
                />
                <Button
                    onClick={addTag}
                    variant="default"
                    disabled={buttonDisabled}
                >
                    Añadir
                </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
                {values.map((tag, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center text-center bg-input text-accent-foreground text-nowrap rounded-3xl text-sm w-min pl-4 py-0"
                    >
                        <span>{tag.toFixed(1).replace('.', ',')} km</span>
                        <Button
                            variant="link"
                            size="icon"
                            onClick={() => removeTag(index)}
                            className="hover:font-extrabold transition duration-150 ease-in-out bg-transparent"
                        >
                            <X className='h-4 w-4' />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
