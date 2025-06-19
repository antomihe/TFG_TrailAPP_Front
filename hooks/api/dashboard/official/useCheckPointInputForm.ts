// hooks\api\dashboard\official\useCheckPointInputForm.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { CheckPointType, MaterialItem } from './useEventCheckPointsManager';
import type {
    CreateStartEndCheckPointDto,
    CreateCheckPointDto,
    CheckPointType as ApiCheckPointType 
} from '@/types/api';


interface UseCheckPointInputFormProps {
  existingCheckPointsNames: string[];
  availableDistances: number[];
  availableMaterial: MaterialItem[];
  onAddCheckPoint: (data: Omit<CreateStartEndCheckPointDto, 'eventId' | 'id'> | Omit<CreateCheckPointDto, 'eventId' | 'id'>) => Promise<any | null>;
}

interface CheckPointInputValues {
  name: string;
  type: CheckPointType | undefined;
  distances: number[];
  material: string[];
  kmPosition: number | undefined;
}

export const CHECKPOINT_FIELD_NAMES: { [K in keyof CheckPointInputValues]: K } = {
  name: 'name',
  type: 'type',
  distances: 'distances',
  material: 'material',
  kmPosition: 'kmPosition',
};

type Errors = {
  [K in keyof CheckPointInputValues]?: string;
};


type CheckPointFormSubmitData =
  | Omit<CreateStartEndCheckPointDto, 'eventId' | 'id'> 
  | Omit<CreateCheckPointDto, 'eventId' | 'id'>;


export const useCheckPointInputForm = ({
  existingCheckPointsNames,
  availableDistances,
  availableMaterial,
  onAddCheckPoint,
}: UseCheckPointInputFormProps) => {
  const [name, setName] = useState<string>('');
  const [selectedType, setSelectedType] = useState<CheckPointType | undefined>(undefined);
  const [selectedDistances, setSelectedDistances] = useState<number[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string[]>([]);
  const [kmPosition, setKmPosition] = useState<number | undefined>(undefined);

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const availableMaterialIds = useMemo(() => availableMaterial.map(m => m.id), [availableMaterial]);
  const optionalMaterialIds = useMemo(() => availableMaterial.filter(m => m.optional).map(m => m.id), [availableMaterial]);
  const mandatoryMaterialIds = useMemo(() => availableMaterial.filter(m => !m.optional).map(m => m.id), [availableMaterial]);

  useEffect(() => {
    setErrors(prevErrors => ({
        ...prevErrors,
        [CHECKPOINT_FIELD_NAMES.name]: undefined,
        [CHECKPOINT_FIELD_NAMES.kmPosition]: undefined,
        [CHECKPOINT_FIELD_NAMES.material]: undefined,
    }));

    if (selectedType === CheckPointType.START || selectedType === CheckPointType.FINISH) {
      setName(selectedType);
      setKmPosition(undefined);
    } else if (name === CheckPointType.START || name === CheckPointType.FINISH) {
        setName('');
    }

    switch (selectedType) {
      case CheckPointType.START:
        setSelectedDistances(availableDistances);
        setSelectedMaterial(availableMaterialIds);
        break;
      case CheckPointType.FINISH:
        setSelectedDistances(availableDistances);
        setSelectedMaterial(mandatoryMaterialIds);
        break;
      case CheckPointType.CONTROL:
        setSelectedDistances([]);
        setSelectedMaterial(mandatoryMaterialIds);
        break;
      case CheckPointType.LIFEBAG:
        setSelectedDistances([]);
        setSelectedMaterial(availableMaterialIds);
        break;
      default:
        setSelectedDistances([]);
        setSelectedMaterial([]);
        setKmPosition(undefined);
        break;
    }
  }, [selectedType, availableDistances, availableMaterialIds, mandatoryMaterialIds, name]); 

  useEffect(() => {
    let isDisabled = !selectedType || name.trim() === '';

    if (!isDisabled && selectedDistances.length === 0 && selectedType !== CheckPointType.START && selectedType !== CheckPointType.FINISH) {
        isDisabled = true;
    }

    if (!isDisabled && (selectedType === CheckPointType.CONTROL || selectedType === CheckPointType.LIFEBAG)) {
      if (selectedMaterial.length === 0 && availableMaterial.length > 0) {
          isDisabled = true;
      }
      if (kmPosition === undefined || kmPosition === null || isNaN(kmPosition)) {
          isDisabled = true;
      }
    }

    if (!isDisabled && selectedType === CheckPointType.FINISH && availableMaterial.length > 0) {
        const allMandatorySelectedForFinish = mandatoryMaterialIds.every(id => selectedMaterial.includes(id));
        if (!allMandatorySelectedForFinish) {
            isDisabled = true;
        }
    }
    setIsButtonDisabled(isDisabled);
  }, [name, selectedDistances, kmPosition, selectedMaterial, selectedType, availableMaterial, mandatoryMaterialIds]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Errors = {};
    const trimmedName = name.trim();

    if (!selectedType) newErrors[CHECKPOINT_FIELD_NAMES.type] = "Debe seleccionar un tipo.";
    if (!trimmedName) newErrors[CHECKPOINT_FIELD_NAMES.name] = 'El nombre es obligatorio.';
    else if (existingCheckPointsNames.includes(trimmedName.toLowerCase()) &&
             !(trimmedName.toLowerCase() === CheckPointType.START.toLowerCase() && existingCheckPointsNames.includes(CheckPointType.START.toLowerCase())) &&
             !(trimmedName.toLowerCase() === CheckPointType.FINISH.toLowerCase() && existingCheckPointsNames.includes(CheckPointType.FINISH.toLowerCase()))) {
      if (selectedType !== CheckPointType.START && selectedType !== CheckPointType.FINISH) {
          newErrors[CHECKPOINT_FIELD_NAMES.name] = 'Ya existe un punto de control con este nombre.';
      }
    }

    if (selectedDistances.length === 0) newErrors[CHECKPOINT_FIELD_NAMES.distances] = 'Seleccione al menos una distancia.';

    if (selectedType === CheckPointType.CONTROL || selectedType === CheckPointType.LIFEBAG) {
      if (availableMaterial.length > 0 && selectedMaterial.length === 0) {
        newErrors[CHECKPOINT_FIELD_NAMES.material] = 'Seleccione el material requerido para este tipo.';
      }
    }

    if (selectedType === CheckPointType.FINISH && availableMaterial.length > 0) {
        const allMandatorySelectedForFinish = mandatoryMaterialIds.every(id => selectedMaterial.includes(id));
        if (!allMandatorySelectedForFinish) {
            newErrors[CHECKPOINT_FIELD_NAMES.material] = 'Debe seleccionar todo el material obligatorio para la Meta.';
        }
    }

    if (selectedType === CheckPointType.CONTROL || selectedType === CheckPointType.LIFEBAG) {
      if (kmPosition === undefined || kmPosition === null || isNaN(kmPosition)) {
        newErrors[CHECKPOINT_FIELD_NAMES.kmPosition] = 'El Punto Kilométrico es obligatorio.';
      } else if (kmPosition <= 0) {
        newErrors[CHECKPOINT_FIELD_NAMES.kmPosition] = 'El P.K. debe ser mayor que cero.';
      } else if (availableDistances.length > 0 && selectedDistances.length > 0 && kmPosition > Math.max(...selectedDistances)) {
        newErrors[CHECKPOINT_FIELD_NAMES.kmPosition] = `El P.K. (${kmPosition}km) excede la distancia máxima seleccionada (${Math.max(...selectedDistances)}km).`;
      }
    }

    if (selectedType === CheckPointType.LIFEBAG) {
        const allOptionalSelected = optionalMaterialIds.every(id => selectedMaterial.includes(id));
        if (optionalMaterialIds.length > 0 && !allOptionalSelected) {
             newErrors[CHECKPOINT_FIELD_NAMES.material] = 'Para Bolsa de Vida, debe seleccionar todo el material opcional disponible.';
        }
        const allMandatorySelected = mandatoryMaterialIds.every(id => selectedMaterial.includes(id));
        if (mandatoryMaterialIds.length > 0 && !allMandatorySelected) {
            const existingError = newErrors[CHECKPOINT_FIELD_NAMES.material] ? newErrors[CHECKPOINT_FIELD_NAMES.material] + " " : "";
            newErrors[CHECKPOINT_FIELD_NAMES.material] = existingError + "También debe seleccionar todo el material obligatorio.";
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, selectedDistances, selectedMaterial, kmPosition, selectedType, existingCheckPointsNames, availableMaterial, availableDistances, mandatoryMaterialIds, optionalMaterialIds]);

  const resetFormFields = () => {
    setName('');
    setSelectedDistances([]);
    setSelectedMaterial([]);
    setKmPosition(undefined);
    setErrors({});
    setSelectedType(undefined);
  };

  const handleSubmit = async () => {
    if (!selectedType || !validateForm()) {
        if (!selectedType && !errors[CHECKPOINT_FIELD_NAMES.type]) {
            setErrors(prev => ({ ...prev, [CHECKPOINT_FIELD_NAMES.type]: "Debe seleccionar un tipo." }));
        }
        return;
    }

    setIsSubmitting(true);

    let payload: CheckPointFormSubmitData;

    if (selectedType === CheckPointType.START || selectedType === CheckPointType.FINISH) {
        payload = {
            name: name.trim(),
            distances: selectedDistances,
            material: selectedMaterial,
            type: selectedType as ApiCheckPointType & ('Salida' | 'Meta'), 
        };
    } else { 
        payload = {
            name: name.trim(),
            distances: selectedDistances,
            material: selectedMaterial,
            type: selectedType as ApiCheckPointType & ('Punto de control' | 'Bolsa de vida'), 
            kmPosition: (kmPosition !== undefined && kmPosition !== null) ? String(kmPosition) : '', 
        };
         
        if (payload.kmPosition === '') {
            
            setErrors(prev => ({ ...prev, [CHECKPOINT_FIELD_NAMES.kmPosition]: "El Punto Kilométrico es obligatorio." }));
            setIsSubmitting(false);
            return;
        }
    }

    try {
        const result = await onAddCheckPoint(payload);
        if (result) {
          resetFormFields();
        }
    } catch (error) {
      
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleTypeChangeWrapper = (value: string | undefined) => {
    setSelectedType(value as CheckPointType | undefined);
  };

  return {
    name, setName,
    selectedType, handleTypeChange: handleTypeChangeWrapper,
    selectedDistances, setSelectedDistances,
    selectedMaterial, setSelectedMaterial,
    kmPosition, setKmPosition,
    errors,
    isSubmitting,
    isButtonDisabled,
    handleSubmit,
    FIELD_NAMES: CHECKPOINT_FIELD_NAMES,
  };
};