
'use client';

import React, { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/ui/multi-select'; 
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'; 
import { AddCheckPointFunctionPayload, CheckPointType, MaterialItem, NewCheckPointApiPayload } from '@/hooks/api/dashboard/official/useEventCheckPointsManager';
import { useCheckPointInputForm, CHECKPOINT_FIELD_NAMES } from '@/hooks/api/dashboard/official/useCheckPointInputForm';
import { PlusCircle, Loader2, Tag, Edit, MapPin, ListChecks, PackageIcon } from 'lucide-react'; 
import { CheckPointItem } from '@/hooks/api/dashboard/official/useCheckPointsData';

const FIELD_NAMES = CHECKPOINT_FIELD_NAMES;

interface CheckPointInputFormProps {
  existingCheckPointsNames: string[];
  availableDistances: number[];
  availableMaterial: MaterialItem[];
  onAddCheckPoint: (data: AddCheckPointFunctionPayload) => Promise<CheckPointItem | null>;
  isCreating: boolean; 
}

export const CheckPointInput: React.FC<CheckPointInputFormProps> = ({
  existingCheckPointsNames,
  availableDistances,
  availableMaterial,
  onAddCheckPoint,
  isCreating, 
}) => {
  const {
    name, setName,
    selectedType, handleTypeChange,
    selectedDistances, setSelectedDistances,
    selectedMaterial, setSelectedMaterial,
    kmPosition, setKmPosition,
    errors,
    isButtonDisabled: isFormButtonDisabled, 
    handleSubmit,
  } = useCheckPointInputForm({
    existingCheckPointsNames,
    availableDistances,
    availableMaterial,
    onAddCheckPoint,
  });

  const distanceOptions = useMemo(() =>
    availableDistances.map((distance) => ({
      label: `${distance} km`,
      value: distance.toString(),
    })), [availableDistances]);

  const materialOptions = useMemo(() =>
    availableMaterial.map((item) => ({
      label: `${item.name}${item.optional ? ' (Opcional)' : ''}`,
      value: item.id,
    })), [availableMaterial]);

  const actualIsSubmitting = isCreating; 

  return (
    <Card className="shadow-lg dark:border-neutral-800">
      <CardHeader>
        <CardTitle className="text-xl">Añadir Nuevo Punto de Control</CardTitle>
        <CardDescription>Configura los detalles del nuevo punto de control para el evento.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor={FIELD_NAMES.type} className="flex items-center">
            <Tag size={16} className="mr-2 text-primary" /> Tipo de Punto de Control
          </Label>
          <Select
            value={selectedType || ""}
            onValueChange={(value) => handleTypeChange(value === "" ? undefined : value)}
            disabled={actualIsSubmitting}
          >
            <SelectTrigger id={FIELD_NAMES.type} className={errors[FIELD_NAMES.type] ? "border-destructive focus:ring-destructive" : ""}>
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CheckPointType).map(typeValue => (
                <SelectItem key={typeValue} value={typeValue}>{typeValue}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors[FIELD_NAMES.type] && <p className="text-xs text-destructive mt-1">{errors[FIELD_NAMES.type]}</p>}
        </div>

        {selectedType && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor={FIELD_NAMES.name} className="flex items-center">
                <Edit size={16} className="mr-2 text-primary" /> Nombre del Control
              </Label>
              <Input
                id={FIELD_NAMES.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={selectedType === CheckPointType.START || selectedType === CheckPointType.FINISH ? selectedType : "Ej. Cruce Principal, Avituallamiento Bosque"}
                disabled={actualIsSubmitting || selectedType === CheckPointType.START || selectedType === CheckPointType.FINISH}
                className={errors[FIELD_NAMES.name] ? "border-destructive focus:ring-destructive" : ""}
              />
              {errors[FIELD_NAMES.name] && <p className="text-xs text-destructive mt-1">{errors[FIELD_NAMES.name]}</p>}
            </div>

            {(selectedType === CheckPointType.CONTROL || selectedType === CheckPointType.LIFEBAG) && (
              <div className="space-y-1.5">
                <Label htmlFor={FIELD_NAMES.kmPosition} className="flex items-center">
                  <MapPin size={16} className="mr-2 text-primary" /> Punto Kilométrico (Km)
                </Label>
                <Input
                  id={FIELD_NAMES.kmPosition}
                  type="number"
                  step="0.1"
                  min="0"
                  value={kmPosition !== undefined ? kmPosition.toString() : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setKmPosition(val === '' ? undefined : parseFloat(val));
                  }}
                  placeholder="Ej. 10.5"
                  disabled={actualIsSubmitting}
                  className={errors[FIELD_NAMES.kmPosition] ? "border-destructive focus:ring-destructive" : ""}
                />
                {errors[FIELD_NAMES.kmPosition] && <p className="text-xs text-destructive mt-1">{errors[FIELD_NAMES.kmPosition]}</p>}
              </div>
            )}

            <div className="space-y-1.5">
              <Label id={`${FIELD_NAMES.distances}-label`} className="flex items-center">
                <ListChecks size={16} className="mr-2 text-primary" /> Distancias que cubre
              </Label>
              <MultiSelect
                options={distanceOptions}
                value={selectedDistances.map(String)}
                onValueChange={(values) => setSelectedDistances(values.map(Number))}
                placeholder="Selecciona distancias" 
                variant="inverted" 
                disabled={actualIsSubmitting || availableDistances.length === 0 || selectedType === CheckPointType.START}
                aria-labelledby={`${FIELD_NAMES.distances}-label`}
              />
              {errors[FIELD_NAMES.distances] && <p className="text-xs text-destructive mt-1">{errors[FIELD_NAMES.distances]}</p>}
            </div>

            {(selectedType === CheckPointType.CONTROL || selectedType === CheckPointType.LIFEBAG || selectedType === CheckPointType.FINISH) && (
              <div className="space-y-1.5">
                <Label id={`${FIELD_NAMES.material}-label`} className="flex items-center">
                  <PackageIcon size={16} className="mr-2 text-primary" /> Material Requerido/Entregado
                </Label>
                {availableMaterial.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-3 border border-dashed rounded-md dark:border-neutral-700">
                    No hay material configurado para el evento. Puedes añadirlo en la configuración del evento.
                  </p>
                ) : (
                  <MultiSelect
                    options={materialOptions}
                    value={selectedMaterial}
                    onValueChange={setSelectedMaterial}
                    placeholder="Selecciona material" 
                    variant="inverted" 
                    disabled={actualIsSubmitting}
                    aria-labelledby={`${FIELD_NAMES.material}-label`}
                  />
                )}
                {errors[FIELD_NAMES.material] && <p className="text-xs text-destructive mt-1">{errors[FIELD_NAMES.material]}</p>}
              </div>
            )}
          </>
        )}
      </CardContent>
      {selectedType && (
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={isFormButtonDisabled || actualIsSubmitting}
            variant="default"
            className="w-full"
            size="lg"
          >
            {actualIsSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <PlusCircle className="mr-2 h-5 w-5" />
            )}
            {actualIsSubmitting ? "Añadiendo..." : "Añadir Punto de Control"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};