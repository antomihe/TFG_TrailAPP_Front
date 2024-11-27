import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/config/api';

import { X } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';
import { ControlType } from './ControlForm';

type ControlItem = {
    name: string;
    distances: number[];
    material: string[];
    type: ControlType;
    kmPosition?: number;
};

import { Skeleton } from '@/components/ui';

type Props = {
    values: any[];
    setValues: (values: any[]) => void;
    distances: number[];
    material: { id: string; optional: boolean, name: string }[];
    postControl: (control: any) => Promise<any>;
    deleteControl: (id: string) => Promise<void>;
    user: { access_token: string };
};

export type MaterialDetails = {
    [id: string]: string;
};

type Errors = {
    [key: string]: string;
};

export default function ControlInput({
    values,
    setValues,
    distances,
    material,
    postControl,
    deleteControl,
    user,
}: Props) {
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
    const [name, setName] = useState<string>('');
    const [controlType, setControlType] = useState<string | undefined>(undefined);
    const [selectedDistances, setSelectedDistances] = useState<number[]>([]);
    const [selectedMaterial, setSelectedMaterial] = useState<string[]>([]);
    const [kmPosition, setKmPosition] = useState<number | undefined>(undefined);
    const [errors, setErrors] = useState<Errors>({});
    const [materialDetails, setMaterialDetails] = useState<MaterialDetails>({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setButtonDisabled(
            controlType === undefined ||
            name.trim() === '' ||
            selectedDistances.length === 0 ||
            selectedMaterial.length === 0 ||
            ((controlType === ControlType.CONTROL || controlType === ControlType.LIFEBAG)
                ? kmPosition === undefined
                : kmPosition !== undefined)
        );
    }, [name, values, selectedDistances, kmPosition, selectedMaterial, controlType]);

    useEffect(() => {
        if (controlType === 'START' || controlType === 'FINISH') {
            setName(controlType);
        } else {
            setName('');
        }
    }, [controlType]);

    useEffect(() => {
        const fetchMaterialDetails = async () => {
            setLoading(true);
            const details: MaterialDetails = {};
            for (const item of material) {
                const response = await api(user.access_token).get(`events/equipment/${item.id}`);
                details[item.id] = response.data.name;
            }
            setMaterialDetails(details);
            setLoading(false);
        };

        fetchMaterialDetails();
    }, [material, user.access_token]);

    useEffect(() => {
        if (controlType === ControlType.START || controlType === ControlType.FINISH) {
            setName(controlType);
            setKmPosition(undefined);
        } else {
            setName('');
        }
    }, [controlType]);

    const addTag = async () => {
        const trimmedName = name.trim();
        const newErrors: Errors = {};
        if (!trimmedName || values.some((item) => item.name.toLowerCase() === trimmedName.toLowerCase())) {
            newErrors.name = 'El nombre del control ya existe o está vacío';
        } else if (selectedDistances.length === 0) {
            newErrors.distances = 'Debes seleccionar al menos una distancia';
        } else if (selectedMaterial.length === 0) {
            newErrors.material = 'Debes seleccionar al menos un material';
        } else if (controlType === ControlType.CONTROL || controlType === ControlType.LIFEBAG) {
            if (kmPosition === undefined) {
                newErrors.kmPosition = 'La posición en km es obligatoria';
            }

            if (kmPosition !== undefined && (kmPosition > Math.max(...selectedDistances) || kmPosition <= 0)) {
                newErrors.kmPosition = 'El punto kilométrico debe estar contenido en la carrera';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            const newControl: ControlItem = {
                name: trimmedName,
                distances: selectedDistances,
                material: selectedMaterial,
                type: controlType as ControlType,
                kmPosition: kmPosition,
            };

            const id = await postControl(newControl);

            setValues([
                ...values,
                { ...newControl, id },
            ]);
            setControlType(undefined);
            setName('');
            setSelectedDistances([]);
            setSelectedMaterial([]);
            setKmPosition(undefined);
            setErrors({});
        }
    }

    const removeTag = async (index: number) => {
        const updatedValues = values.filter((_, i) => i !== index);
        await deleteControl(values[index].id!);
        setValues(updatedValues);
    };

    const distanceOptions = distances.map((distance) => ({
        label: `${distance} km`,
        value: distance.toString(),
    }));

    const materialOptions = material.map((item) => ({
        label: `${item.name} ${item.optional ? '(opcional)' : ''}`,
        value: item.id,
    }));

    return (
        <div className="space-y-4">
            <div className="space-y-4 border-2 rounded-lg p-4">
                <Select
                    value={controlType}
                    onValueChange={(value: string | undefined) => setControlType(value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo de control" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ControlType.START}>{ControlType.START}</SelectItem>
                        <SelectItem value={ControlType.CONTROL}>{ControlType.CONTROL}</SelectItem>
                        <SelectItem value={ControlType.LIFEBAG}>{ControlType.LIFEBAG}</SelectItem>
                        <SelectItem value={ControlType.FINISH}>{ControlType.FINISH}</SelectItem>
                    </SelectContent>
                </Select>


                {controlType && (
                    <>
                        {/* Nombre */}
                        <div className="flex flex-col">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Nombre del control
                            </label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={controlType === ControlType.START || controlType === ControlType.FINISH}
                                placeholder="Añadir nombre del control"
                                className="mt-1"
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>

                        {/* Punto kilométrico */}
                        {(controlType === ControlType.CONTROL || controlType === ControlType.LIFEBAG) && (
                            <div className="flex flex-col">
                                <label htmlFor="kmPosition" className="text-sm font-medium text-gray-700">
                                    Punto kilométrico
                                </label>
                                <Input
                                    id="kmPosition"
                                    type="number"
                                    step="0.1"
                                    value={kmPosition !== undefined ? kmPosition.toString() : ''}
                                    onChange={(e) => setKmPosition(parseFloat(e.target.value))}
                                    placeholder="Añadir punto km del control"
                                    className="mt-1"
                                />
                                {errors.kmPosition && <p className="text-xs text-red-500">{errors.kmPosition}</p>}
                            </div>
                        )}

                        {/* Selección de distancias */}
                        <div className="flex flex-col">
                            <label htmlFor="distances" className="text-sm font-medium text-gray-700">
                                Distancias
                            </label>
                            <MultiSelect
                                options={distanceOptions}
                                value={selectedDistances.map(String)}
                                onValueChange={(values) => setSelectedDistances(values.map(Number))}
                                placeholder="Selecciona distancias"
                                variant="inverted"
                            />
                            {errors.distances && <p className="text-xs text-red-500">{errors.distances}</p>}
                        </div>

                        {/* Selección de material */}
                        <div className="flex flex-col">
                            <label htmlFor="material" className="text-sm font-medium text-gray-700">
                                Material
                            </label>
                            <MultiSelect
                                options={materialOptions}
                                value={selectedMaterial}
                                onValueChange={setSelectedMaterial}
                                placeholder="Selecciona material"
                                variant="inverted"
                            />
                            {errors.material && <p className="text-xs text-red-500">{errors.material}</p>}
                        </div>

                        {/* Botón de añadir */}
                        <Button
                            onClick={addTag}
                            disabled={buttonDisabled}
                            variant="default"
                            className="w-full mt-4"
                        >
                            Añadir control
                        </Button>
                    </>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {values.map((control: any, index: number) => (
                    <Card key={index} className="border relative">
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">{control.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <p>
                                <span className="font-semibold">Tipo de punto de control: </span>
                                {control.type}
                            </p>
                            <p>
                                <span className="font-semibold">Distancias: </span>
                                {control.distances.join(', ')} km
                            </p>
                            {(control.type === ControlType.CONTROL || control.type === ControlType.LIFEBAG) && (
                                <p>
                                    <span className="font-semibold">Punto kilométrico: </span>
                                    {control.kmPosition} km
                                </p>
                            )}

                            {loading ? (
                                <div className='flex items-center'>
                                    <span className="font-semibold">Material: </span>
                                    <Skeleton className='ml-2 h-5 w-full' />
                                </div>
                            ) : (
                                <p>
                                    <span className="font-semibold">Material: </span>
                                    {control.material.map((id: string) => materialDetails[id]).join(', ')}
                                </p>
                            )}
                        </CardContent>
                        <Button
                            onClick={() => removeTag(index)}
                            variant="destructive"
                            className="p-2 absolute top-2 right-2 w-10"
                        >
                            <X size={16} />
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
