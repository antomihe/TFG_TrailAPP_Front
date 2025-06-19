// app\(logged)\dashboard\(organizer)\events\equipment\[eventId]\components\EquipmentList.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X, RotateCw, AlertTriangle } from 'lucide-react';
import { EquipmentItemForm } from '@/hooks/api/dashboard/organizer/useEventEquipment'; 
import { FieldArrayRenderProps } from 'formik'; 
import { H4 } from '@/components/ui';

interface EquipmentListProps {
  equipmentItems: EquipmentItemForm[]; 
  arrayHelpers: FieldArrayRenderProps; 
  disabled?: boolean;
}

export default function EquipmentList({ equipmentItems, arrayHelpers, disabled }: EquipmentListProps) {
    const handleToggleRemove = (index: number) => {
        const currentItem = equipmentItems[index];
        
        arrayHelpers.form.setFieldValue(
            `${arrayHelpers.name}.${index}.removed`, 
            !currentItem.removed
        );
    };

    
    const activeItems = equipmentItems.filter(item => !item.id || (item.id && !item.removed));

    if (equipmentItems.length === 0) {
        return <p className="text-sm text-muted-foreground mt-4 text-center py-4">No hay material agregado todavía.</p>;
    }

    return (
        <div className="space-y-3 mt-6">
            <H4 className="text-md font-semibold">Material Configurado</H4>
            {activeItems.length === 0 && equipmentItems.some(item => item.removed) && (
                <p className="text-sm text-muted-foreground text-center py-2">Todo el material ha sido marcado para eliminar.</p>
            )}
            <ul className="space-y-2">
                {equipmentItems.map((item, index) => (
                    <li
                        key={item.id || `new-${index}`} 
                        className={`flex justify-between items-center border rounded-md px-3 py-2 dark:border-gray-700
                                    ${item.removed ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700' : 'bg-background'}`}
                    >
                        <span className={item.removed ? 'line-through text-red-600 dark:text-red-400' : ''}>
                            {item.name} {item.optional && <span className="text-xs text-muted-foreground">(Opcional)</span>}
                        </span>
                        <Button
                            type="button" 
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleRemove(index)}
                            disabled={disabled}
                            aria-label={item.removed ? "Restaurar material" : "Marcar para eliminar material"}
                            className={`hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full 
                                        ${item.removed ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}`}
                        >
                            {item.removed ? <RotateCw className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}