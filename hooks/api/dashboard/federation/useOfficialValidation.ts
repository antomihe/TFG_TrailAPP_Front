// hooks\api\dashboard\federation\useOfficialValidation.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth/useAuth';
import type { OfficialResponseDto, FederationResponseDto } from '@/types/api';

export interface Official extends OfficialResponseDto {
    validatedAt: string | null;
}

export const useOfficialValidation = () => {
    const { user, token } = useAuth();
    const [officials, setOfficials] = useState<Official[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [submittingActionOnOfficialId, setSubmittingActionOnOfficialId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchUnvalidatedOfficials = useCallback(async () => {
        if (!token || !user?.id) {
            setError("Usuario no autenticado o ID de usuario no disponible.");
            setIsLoading(false);
            setOfficials([]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const resFed = await api(token).get<FederationResponseDto>(`users/federation/${user.id}`);
            const federationCode = resFed.data.code;

            if (!federationCode) {
                setError("Código de federación no encontrado para el usuario actual.");
                setIsLoading(false);
                setOfficials([]);
                return;
            }

            const res = await api(token).get<OfficialResponseDto[]>(`users/official/by-federation/${federationCode}`, {
                params: { status: 'unvalidated' },
            });

            const officialsData: Official[] = Array.isArray(res.data)
                ? res.data.map((official: OfficialResponseDto) => ({
                    ...official,
                    displayName: official.displayName || 'N/A',
                    validatedByFederation: !!official.validatedByFederation,
                    validatedAt: null, 
                  }))
                : [];
            setOfficials(officialsData);
        } catch (err) {
            const errorMessage = errorHandler(err);
            setError(errorMessage);
            setOfficials([]);
        } finally {
            setIsLoading(false);
        }
    }, [token, user?.id]);

    useEffect(() => {
        fetchUnvalidatedOfficials();
    }, [fetchUnvalidatedOfficials]);

    const validateOfficial = useCallback(async (officialId: string): Promise<boolean> => {
        if (!token) {
            toast.error("Acción no permitida: usuario no autenticado.");
            return false;
        }
        setSubmittingActionOnOfficialId(officialId);
        let success = false;
        const officialToValidate = officials.find(o=>o.id === officialId);
        try {
            await api(token).patch(`users/official/${officialId}/validate`);
            setOfficials((prevOfficials) =>
                prevOfficials.map((official) =>
                    official.id === officialId
                        ? { ...official, validatedByFederation: true, validatedAt: new Date().toISOString() }
                        : official
                ).filter(official => official.id !== officialId) 
            );
            toast.success(`Juez "${officialToValidate?.displayName || officialId}" validado correctamente.`);
            success = true;
        } catch (err) {
            const errorMessage = errorHandler(err);
            toast.error(`Error al validar juez: ${errorMessage}`);
            success = false;
        } finally {
            setSubmittingActionOnOfficialId(null);
        }
        return success;
    }, [token, officials]);

    const deleteOfficial = useCallback(async (officialId: string): Promise<boolean> => {
        if (!token) {
            toast.error("Acción no permitida: usuario no autenticado.");
            return false;
        }
        setSubmittingActionOnOfficialId(officialId);
        let success = false;
        const officialToDelete = officials.find(o => o.id === officialId);
        try {
            await api(token).delete(`users/official/${officialId}`);
            setOfficials((prevOfficials) =>
                prevOfficials.filter((official) => official.id !== officialId)
            );
            toast.success(`Juez "${officialToDelete?.displayName || officialId}" eliminado correctamente.`);
            success = true;
        } catch (err) {
            const errorMessage = errorHandler(err);
            toast.error(`Error al eliminar juez: ${errorMessage}`);
            success = false;
        } finally {
            setSubmittingActionOnOfficialId(null);
        }
        return success;
    }, [token, officials]);

    return {
        officials,
        isLoading,
        submittingActionOnOfficialId,
        error,
        validateOfficial,
        deleteOfficial,
        refetchOfficials: fetchUnvalidatedOfficials,
    };
};