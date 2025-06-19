// hooks\api\dashboard\organizer\useEventEquipment.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import * as Yup from 'yup';
import { FormikHelpers } from 'formik';
import { useAuth } from '@/hooks/auth/useAuth';
import type { EquipmentResponseDto, CreateEquipmentDto, EquipmentItemDto } from '@/types/api';

export interface EquipmentItemForm {
    id?: string;
    name: string;
    optional: boolean;
    removed?: boolean;
}

export interface EventEquipmentFormValues {
    equipment: EquipmentItemForm[];
}

export const EVENT_EQUIPMENT_FIELD_NAMES: { [K in keyof EventEquipmentFormValues]: K } = {
    equipment: 'equipment',
};

export const equipmentValidationSchema = Yup.object().shape({
    [EVENT_EQUIPMENT_FIELD_NAMES.equipment]: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().when('removed', {
                is: (removed: boolean) => !removed,
                then: (schema) => schema.required('El nombre es obligatorio.'),
                otherwise: (schema) => schema.notRequired(),
            }),
            optional: Yup.boolean(),
            removed: Yup.boolean().optional(),
            id: Yup.string().optional(),
        })
    ).min(0, 'La lista de material puede estar vacía.'),
});

export const useEventEquipment = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const { token } = useAuth();

    const [initialFormValues, setInitialFormValues] = useState<EventEquipmentFormValues>({ equipment: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEquipment = useCallback(async () => {
        if (!token || !eventId) {
            setLoading(false);
            setError(!token ? "Usuario no autenticado." : "ID de evento no disponible.");
            setInitialFormValues({ equipment: [] });
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await api(token).get<EquipmentResponseDto[]>(`events/equipment/by-event`, {
                params: { eventId }
            });

            const loadedApiEquipment = Array.isArray(response.data) ? response.data : [];
            const equipmentForForm: EquipmentItemForm[] = loadedApiEquipment.map((item: EquipmentResponseDto) => ({
                id: item.id,
                name: item.name,
                optional: !!item.optional,
                removed: false,
            }));
            setInitialFormValues({ equipment: equipmentForForm });
        } catch (err) {
            const errorMessage = errorHandler(err);
            setError(errorMessage || 'Error desconocido al cargar el material.');
            setInitialFormValues({ equipment: [] });
        } finally {
            setLoading(false);
        }
    }, [token, eventId]);

    useEffect(() => {
        if (eventId) {
            fetchEquipment();
        }
    }, [fetchEquipment, eventId]);

    const handleSaveEquipment = useCallback(async (
        values: EventEquipmentFormValues,
        formikActions: FormikHelpers<EventEquipmentFormValues>
    ): Promise<void> => {
        if (!token || !eventId) {
            toast.error("No se puede guardar: falta información del usuario o evento.");
            formikActions.setSubmitting(false);
            return;
        }

        formikActions.setSubmitting(true);
        try {
            const equipmentToSave: EquipmentItemDto[] = values.equipment
                .filter(item => !item.removed) 
                .map(({ name, optional }) => ({
                    name,
                    optional: !!optional,
                }));

            const payload: CreateEquipmentDto = {
                eventId: eventId,
                equipment: equipmentToSave,
            };

            await api(token).post(`/events/equipment`, payload);
            toast.success('¡Éxito! Material guardado correctamente.');

            await fetchEquipment(); 

        } catch (err) {
            const errorMessage = errorHandler(err);
            toast.error(`Error al guardar el material: ${errorMessage}`);
        } finally {
            formikActions.setSubmitting(false);
        }
    }, [token, eventId, fetchEquipment]);

    return {
        initialFormValues,
        loading,
        error,
        handleSaveEquipment,
        refetchEquipment: fetchEquipment,
        validationSchema: equipmentValidationSchema,
        FIELD_NAMES: EVENT_EQUIPMENT_FIELD_NAMES,
    };
};