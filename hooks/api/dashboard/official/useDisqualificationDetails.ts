// hooks\api\dashboard\official\useDisqualificationDetails.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import type { DisqualificationResponseDto, UpdateDisqualificationDto, DisqualificationStatus } from '@/types/api';

export interface DisqualificationDetails {
    id: string;
    athlete: {
        id?: string;
        name: string;
        dorsal?: number;
    };
    official: {
        id?: string;
        name: string;
    };
    reason: string;
    description: string;
    createdAt: string;
    reviewedByReferee: boolean;
    status?: DisqualificationStatus;
}

const initialDisqualificationState: DisqualificationDetails = {
    id: '',
    athlete: { name: '' },
    official: { name: '' },
    reason: '',
    description: '',
    createdAt: '',
    reviewedByReferee: false,
    status: 'PENDING',
};

export const useDisqualificationDetails = () => {
    const params = useParams<{ disqualificationId: string }>();
    const disqualificationId = params?.disqualificationId;
    const { token } = useAuth();

    const [disqualification, setDisqualification] = useState<DisqualificationDetails>(initialDisqualificationState);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmittingAction, setIsSubmittingAction] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDisqualificationDetails = useCallback(async () => {
        if (!token || !disqualificationId) {
            setIsLoading(false);
            setError(!token ? "Usuario no autenticado." : "ID de descalificación no disponible.");
            setDisqualification(initialDisqualificationState);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await api(token).get<DisqualificationResponseDto>(`events/disqualification/${disqualificationId}`);

            const data = response.data;
            const adaptedData: DisqualificationDetails = {
                id: data.id,
                athlete: {
                    id: data.athlete?.id,
                    name: data.athlete?.name || 'Atleta Desconocido',
                    dorsal: data.athlete?.dorsal,
                },
                official: {
                    id: data.official?.id,
                    name: data.official?.name || 'Oficial Desconocido', 
                },
                reason: data.reason,
                description: data.description,
                createdAt: data.createdAt,
                reviewedByReferee: data.reviewedByReferee,
                status: data.status as DisqualificationStatus,
            };
            setDisqualification(adaptedData);
        } catch (err) {
            const errorMessage = errorHandler(err);
            setError(errorMessage || 'Error desconocido al cargar la descalificación.');
            setDisqualification(initialDisqualificationState);
        } finally {
            setIsLoading(false);
        }
    }, [token, disqualificationId]);

    useEffect(() => {
        if (disqualificationId) {
            fetchDisqualificationDetails();
        } else {
            setIsLoading(false);
            setError("ID de descalificación no proporcionado en la URL.");
            setDisqualification(initialDisqualificationState);
        }
    }, [fetchDisqualificationDetails, disqualificationId]);

    const performAction = useCallback(async (actionType: 'approve' | 'reject'): Promise<boolean> => {
        if (!token || !disqualificationId) {
            toast.error("Acción no permitida: falta información crítica.");
            return false;
        }
        setIsSubmittingAction(true);
        let success = false;

        const newStatus: DisqualificationStatus = actionType === 'approve' ? 'APPROVED' : 'REJECTED';
        const payload: UpdateDisqualificationDto = { status: newStatus };

        try {
            await api(token).patch(`events/disqualification/${disqualificationId}`, payload);
            setDisqualification(prev => ({
                ...prev,
                reviewedByReferee: true,
                status: newStatus
            }));
            toast.success(actionType === 'approve'
                ? 'El atleta ha sido descalificado correctamente.'
                : 'El parte ha sido desestimado correctamente.');
            success = true;
        } catch (err) {
            const errorMessage = errorHandler(err);
            toast.error(`Error al ${actionType === 'approve' ? 'descalificar al atleta' : 'desestimar el parte'}: ${errorMessage}`);
            success = false;
        } finally {
            setIsSubmittingAction(false);
        }
        return success;
    }, [token, disqualificationId]);

    const approveDisqualification = () => performAction('approve');
    const rejectDisqualification = () => performAction('reject');

    return {
        disqualification,
        isLoading,
        isSubmittingAction,
        error,
        approveDisqualification,
        rejectDisqualification,
        refetchDisqualification: fetchDisqualificationDetails,
    };
};