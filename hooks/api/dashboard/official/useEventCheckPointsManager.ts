// hooks\api\dashboard\official\useEventCheckPointsManager.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import type {
    CheckPointResponseDto,
    EventResponseDto,
    EquipmentResponseDto,
    CreateStartEndCheckPointDto,
    CreateCheckPointDto,
    CheckPointType as ApiCheckPointType
} from '@/types/api';

export enum CheckPointType {
    START = "Salida",
    CONTROL = "Punto de control",
    LIFEBAG = "Bolsa de vida",
    FINISH = "Meta"
}

export type CheckPointItem = CheckPointResponseDto;

export type MaterialItem = Pick<EquipmentResponseDto, 'id' | 'name' | 'optional'>;

export type NewCheckPointApiPayload = CreateStartEndCheckPointDto | CreateCheckPointDto;

export type AddCheckPointFunctionPayload =
    | Omit<CreateStartEndCheckPointDto, 'eventId'>
    | Omit<CreateCheckPointDto, 'eventId'>;


export const useEventCheckPointsManager = () => {
    const { token } = useAuth();
    const { eventId } = useParams<{ eventId: string }>();

    const [distances, setDistances] = useState<number[]>([]);
    const [availableMaterial, setAvailableMaterial] = useState<MaterialItem[]>([]);
    const [checkPoints, setCheckPoints] = useState<CheckPointItem[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [creatingCheckPoint, setCreatingCheckPoint] = useState<boolean>(false);
    const [deletingCheckPointId, setDeletingCheckPointId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchInitialData = useCallback(async () => {
        if (!token || !eventId) {
            setError(!token ? "Usuario no autenticado." : "ID del evento no disponible.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const [cpResponse, eventResponse, materialResponse] = await Promise.all([
                api(token).get<CheckPointResponseDto[]>(`events/checkPoints/by-event`, { params: { eventId } }),
                api(token).get<EventResponseDto>(`events/${eventId}`),
                api(token).get<EquipmentResponseDto[]>(`events/equipment/by-event`, { params: { eventId } })
            ]);

            setCheckPoints(Array.isArray(cpResponse.data) ? cpResponse.data : []);

            const eventDistancesStr: string[] = Array.isArray(eventResponse.data.distances) ? eventResponse.data.distances : [];
            setDistances(eventDistancesStr.map(d => Number(d)).filter(n => !isNaN(n)));

            const materialData: MaterialItem[] = Array.isArray(materialResponse.data)
                ? materialResponse.data.map(item => ({
                    id: item.id,
                    name: item.name,
                    optional: item.optional,
                  }))
                : [];
            setAvailableMaterial(materialData);

        } catch (err) {
            const errorMessage = errorHandler(err);
            setError(errorMessage);
            toast.error(`Error al cargar datos iniciales: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    }, [token, eventId]);

    useEffect(() => {
        if (eventId) {
            fetchInitialData();
        }
    }, [fetchInitialData, eventId]);

    const addCheckPoint = useCallback(async (data: AddCheckPointFunctionPayload): Promise<CheckPointItem | null> => {
        if (!token || !eventId) {
            toast.error("No se puede crear el punto de control: información de autenticación o evento faltante.");
            return null;
        }
        setCreatingCheckPoint(true);
        try {
            let payload: NewCheckPointApiPayload;
            if (
                data.type === CheckPointType.CONTROL ||
                data.type === CheckPointType.LIFEBAG
            ) {
                payload = {
                    ...data,
                    eventId: eventId,
                    type: data.type as ApiCheckPointType,
                    kmPosition: (data as any).kmPosition ?? "",
                } as CreateCheckPointDto;
            } else {
                payload = {
                    ...data,
                    eventId: eventId,
                    type: data.type as ApiCheckPointType,
                } as CreateStartEndCheckPointDto;
            }

            const response = await api(token).post<CheckPointResponseDto>(`events/checkPoints`, payload);
            const newCheckPoint = response.data;
            setCheckPoints((prev) => [...prev, newCheckPoint]);
            toast.success('El punto de control ha sido creado correctamente.');
            return newCheckPoint;
        } catch (err) {
            const errorMessage = errorHandler(err);
            toast.error(`Error al crear punto de control: ${errorMessage}`);
            return null;
        } finally {
            setCreatingCheckPoint(false);
        }
    }, [token, eventId]);

    const removeCheckPoint = useCallback(async (checkPointIdToRemove: string): Promise<boolean> => {
        if (!token || !checkPointIdToRemove) {
            toast.error("No se puede eliminar el punto de control: falta información.");
            return false;
        }
        setDeletingCheckPointId(checkPointIdToRemove);
        let success = false;
        try {
            await api(token).delete(`events/checkPoints/${checkPointIdToRemove}`);
            setCheckPoints((prev) => prev.filter((item) => item.id !== checkPointIdToRemove));
            toast.success('El punto de control ha sido eliminado correctamente.');
            success = true;
        } catch (err) {
            const errorMessage = errorHandler(err);
            toast.error(`Error al eliminar punto de control: ${errorMessage}`);
            success = false;
        } finally {
            setDeletingCheckPointId(null);
        }
        return success;
    }, [token]);

    return {
        eventId,
        distances,
        availableMaterial,
        checkPoints,
        loading,
        creatingCheckPoint,
        deletingCheckPointId,
        error,
        addCheckPoint,
        removeCheckPoint,
        refetchData: fetchInitialData,
    };
};