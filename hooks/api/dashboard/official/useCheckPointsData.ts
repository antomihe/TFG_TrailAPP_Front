// hooks\api\dashboard\official\useCheckPointsData.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth/useAuth';
import type {
    TodayJuryEventResponseDto,
    CheckPointResponseDto,
    EquipmentResponseDto,
    CheckPointType as ApiCheckPointType 
} from '@/types/api';

export interface EventInfo {
    id: string;
    name: string;
}

export enum CheckPointType {
    START = "Salida",
    FINISH = "Meta",
    CONTROL = "Punto de control",
    LIFEBAG = "Bolsa de vida",
}

export type CheckPointItem = CheckPointResponseDto;


export interface MaterialDetailsMap {
    [materialId: string]: string;
}

export const useCheckPointsData = () => {
    const { token } = useAuth();

    const [event, setEvent] = useState<EventInfo | null>(null);
    const [checkPoints, setCheckPoints] = useState<CheckPointItem[]>([]);
    const [materialDetails, setMaterialDetails] = useState<MaterialDetailsMap>({});

    const [loadingEventAndCheckPoints, setLoadingEventAndCheckPoints] = useState<boolean>(true);
    const [loadingMaterialDetails, setLoadingMaterialDetails] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEventAndCheckPoints = useCallback(async () => {
        if (!token) {
            setError("Usuario no autenticado.");
            setLoadingEventAndCheckPoints(false);
            setEvent(null);
            setCheckPoints([]);
            return;
        }
        setLoadingEventAndCheckPoints(true);
        setError(null);
        setEvent(null);
        setCheckPoints([]);

        try {
            const eventResponse = await api(token).get<TodayJuryEventResponseDto>(`events/jury/my-assignments`, {
                params: { date: 'today' }
            });

            if (!eventResponse.data || !eventResponse.data.id) {
                setError("No hay evento asignado para hoy o el Juez no está activo en un evento hoy.");
                setLoadingEventAndCheckPoints(false);
                return;
            }
            const currentEvent: EventInfo = {
                id: eventResponse.data.id,
                name: eventResponse.data.name
            };
            setEvent(currentEvent);

            const controlsResponse = await api(token).get<CheckPointResponseDto[]>(`events/checkPoints/by-event`, {
                params: { eventId: currentEvent.id }
            });
            setCheckPoints(Array.isArray(controlsResponse.data) ? controlsResponse.data : []);

        } catch (err) {
            const errorMessage = errorHandler(err);
            setError(errorMessage);
        } finally {
            setLoadingEventAndCheckPoints(false);
        }
    }, [token]);

    useEffect(() => {
        fetchEventAndCheckPoints();
    }, [fetchEventAndCheckPoints]);

    useEffect(() => {
        const fetchAllMaterialDetails = async () => {
            if (!token || checkPoints.length === 0) {
                setMaterialDetails({});
                setLoadingMaterialDetails(false);
                return;
            }

            setLoadingMaterialDetails(true);
            const uniqueMaterialIds = new Set<string>();
            checkPoints.forEach(cp => {
                if (Array.isArray(cp.material)) {
                    cp.material.forEach(id => uniqueMaterialIds.add(id));
                }
            });

            if (uniqueMaterialIds.size === 0) {
                setMaterialDetails({});
                setLoadingMaterialDetails(false);
                return;
            }

            const detailsPromises = Array.from(uniqueMaterialIds).map(async (materialId) => {
                try {
                    const response = await api(token).get<EquipmentResponseDto>(`events/equipment/${materialId}`);
                    const materialData = response.data;
                    return { id: materialId, name: materialData.name || `Material ID: ${materialId}` };
                } catch (err) {
                    console.warn(`No se pudo cargar el detalle del material ID (${materialId}):`, errorHandler(err));
                    return { id: materialId, name: `Error al cargar ID: ${materialId}` };
                }
            });

            try {
                const resolvedDetails = await Promise.all(detailsPromises);
                const newMaterialDetailsMap: MaterialDetailsMap = {};
                resolvedDetails.forEach(detail => {
                    if (detail) {
                        newMaterialDetailsMap[detail.id] = detail.name;
                    }
                });
                setMaterialDetails(newMaterialDetailsMap);
            } catch (err) {
                toast.error("Ocurrió un error general al cargar detalles de material.");
                console.error("Error en Promise.all para fetchAllMaterialDetails:", err);
            } finally {
                setLoadingMaterialDetails(false);
            }
        };

        if (checkPoints.length > 0 && token) {
            fetchAllMaterialDetails();
        } else if (checkPoints.length === 0) {
            setMaterialDetails({});
        }

    }, [checkPoints, token]);

    return {
        event,
        checkPoints,
        materialDetails,
        loadingEventAndCheckPoints,
        loadingMaterialDetails,
        error,
        refetchData: fetchEventAndCheckPoints,
    };
};