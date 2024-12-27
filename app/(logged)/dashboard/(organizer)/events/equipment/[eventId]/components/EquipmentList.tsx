'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X, RotateCw } from 'lucide-react';

type Tag = { name: string; optional: boolean; removed?: boolean };

type Props = {
    values: Tag[];
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
};

export default function EquipmentList({ values, setFieldValue }: Props) {
    const toggleRemoveTag = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
        event.preventDefault(); // Prevent form submission
        const updatedValues = values.map((item, i) =>
            i === index ? { ...item, removed: !item.removed } : item
        );
        setFieldValue('equipment', updatedValues);
    };

    return (
        <div className="space-y-2 mt-4">
            {values.length > 0 ? (
                <ul>
                    {values.map((item, index) => (
                        <li
                            key={index}
                            className={`flex justify-between items-center border rounded-md mt-2 px-3 py-1 ${item.removed ? 'line-through text-red-500' : ''}`}
                        >
                            <span>
                                {item.name} {item.optional && <span className="text-sm text-gray-500">(Opcional)</span>}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => toggleRemoveTag(e, index)}
                                className={`hover:bg-gray-100 ${item.removed ? 'text-green-500' : 'text-red-500'}`}
                            >
                                {item.removed ? <RotateCw className="h-4 w-4" /> : <X className="h-4 w-4" />}
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
