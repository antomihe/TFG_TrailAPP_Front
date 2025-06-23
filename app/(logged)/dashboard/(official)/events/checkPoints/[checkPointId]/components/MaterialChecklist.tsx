// app\(logged)\dashboard\(official)\events\checkPoints\[checkPointId]\components\MaterialChecklist.tsx


'use client';

import React, { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { MaterialDetails } from '@/hooks/api/dashboard/official/useMaterialCheck'; 
import { FieldProps } from 'formik'; 

interface MaterialChecklistProps {
  field: FieldProps<{[key: string]: boolean}>['field']; 
  form: FieldProps<{[key: string]: boolean}>['form'];   
  materials: MaterialDetails[]; 
}

export const MaterialChecklist: React.FC<MaterialChecklistProps> = ({
  field, 
  form,  
  materials,
}) => {
  const [isAllSelected, setIsAllSelected] = useState(false);
  const checkedMaterials = field.value || {};

  useEffect(() => {
    if (materials.length > 0) {
      const allCurrentlySelected = materials.every(
        (material) => checkedMaterials[material.id] === true
      );
      setIsAllSelected(allCurrentlySelected);
    } else {
      setIsAllSelected(false);
    }
  }, [checkedMaterials, materials]);

  if (materials.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-4">No hay material configurado para este punto de control.</p>;
  }

  const handleToggleSelectAll = () => {
    const nextAllSelectedState = !isAllSelected;
    const newMaterialsValue = materials.reduce((acc, material) => {
        acc[material.id] = nextAllSelectedState;
        return acc;
    }, {} as { [key: string]: boolean });
    form.setFieldValue(field.name, newMaterialsValue);
     form.setFieldTouched(field.name, true); 
  };

  return (
    <div className="space-y-6 border rounded-lg p-6 dark:border-gray-700">
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {materials.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <Checkbox
              checked={checkedMaterials[item.id] || false}
              onCheckedChange={(checked) => {
                form.setFieldValue(`${field.name}.${item.id}`, !!checked);
                form.setFieldTouched(`${field.name}.${item.id}`, true); 
              }}
              id={`material-${item.id}-${field.name}`} 
              className="h-5 w-5 cursor-pointer"
            />
            <label htmlFor={`material-${item.id}-${field.name}`} className="font-medium text-sm cursor-pointer flex-1">
              {item.name} {item.optional && <span className="text-xs text-muted-foreground">(opcional)</span>}
            </label>
          </div>
        ))}
      </div>
      {materials.length > 0 && (
        <Button
            type="button"
            variant={isAllSelected ? 'ghost' : 'outline'}
            onClick={handleToggleSelectAll}
            className="w-full mt-4"
        >
            {isAllSelected ? "Desmarcar Todos" : "Seleccionar Todos"}
        </Button>
      )}
    </div>
  );
};