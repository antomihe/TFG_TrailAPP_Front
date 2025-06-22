// hooks\api\dashboard\federation\useJuryFormData.ts
// hooks/api/dashboard/federation/events/useJuryFormData.ts
import { useState, useEffect, useCallback } from "react";
import api, { errorHandler } from "@/config/api";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { toast } from "sonner";
import type { OfficialResponseDto, JuryResponseDto, FederationResponseDto, AddJuryDto, AddJuryListDto } from "@/types/api";

export type JudgeFormData = {
    role: string;
    name: string;
    isNational: boolean;
    isReferee: boolean;
    userId: string | null;
    canEdit: boolean;
    erase: boolean;
    originalData?: JuryResponseDto & { officialName?: string };
};

export type OfficialOption = Pick<OfficialResponseDto, 'id' | 'fullName'>;

interface SubmitJuryValues { 
    judges: JudgeFormData[];
}

export const useJuryFormData = () => {
    const { user, token } = useAuth();
    const params = useParams();
    const eventId = params.eventId as string;

    const [loading, setLoading] = useState(true);
    const [officials, setOfficials] = useState<OfficialOption[]>([]);
    const [error, setError] = useState<string>('');
    const [initialJudges, setInitialJudges] = useState<JudgeFormData[]>([]);
    const [alertDescription, setAlertDescription] = useState<string>('');
    const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

    const fetchOfficialsAndJury = useCallback(async () => {
        setLoading(true);
        setError('');
        setInitialJudges([]);

        if (!token || !user?.id || !eventId) {
            setError('No autenticado o información faltante para cargar los datos del jurado.');
            setLoading(false);
            return;
        }

        try {
            const resFed = await api(token).get<FederationResponseDto>(`users/federation/${user.id}`);
            const federationCode = resFed.data.code;
            if (!federationCode) {
                throw new Error("No se pudo obtener el código de la federación.");
            }

            const resOfficials = await api(token).get<OfficialResponseDto[]>(`users/official/by-federation/${federationCode}`, {
                params: { status: 'validated' }
            });
            setOfficials(Array.isArray(resOfficials.data) ? resOfficials.data.map(o => ({ id: o.id, fullName: o.fullName })) : []);

            const resJury = await api(token).get<JuryResponseDto[]>(`/events/jury/for-event/${eventId}`);
            const currentApiJury = Array.isArray(resJury.data) ? resJury.data : [];

            const orderedApiJury = [...currentApiJury].sort((a, b) => (b.isReferee ? 1 : 0) - (a.isReferee ? 1 : 0));

            let processedInitialJury: JudgeFormData[];

            if (orderedApiJury.length === 0) {
                processedInitialJury = [
                    { role: 'Juez Árbitro', name: '', userId: null, isNational: false, isReferee: true, canEdit: true, erase: false },
                ];
                setAlertDescription('Para pasar una designación a la RFEA, selecciona el icono con un ojo.');
            } else {
                const juryPromises = orderedApiJury.map(async (apiJudge: JuryResponseDto) => {
                    let officialName = '';
                    if (apiJudge.userId) {
                        try {
                            const officialRes = await api(token).get<OfficialResponseDto>(`users/official/${apiJudge.userId}`);
                            officialName = officialRes.data.fullName || 'Nombre Desconocido';
                        } catch (fetchOfficialError) {
                            console.warn(`Error fetching official ${apiJudge.userId}:`, fetchOfficialError);
                            officialName = 'Oficial (Error al cargar)';
                        }
                    }
                    return {
                        role: apiJudge.role,
                        name: officialName,
                        userId: apiJudge.userId,
                        isNational: apiJudge.isNational,
                        isReferee: apiJudge.isReferee,
                        canEdit: !apiJudge.isNational,
                        erase: false,
                        originalData: { ...apiJudge, officialName },
                    };
                });
                processedInitialJury = await Promise.all(juryPromises);
                setAlertDescription(processedInitialJury.some(j => j.isNational) ? 'Designaciones nacionales ya enviadas a la RFEA. No es posible modificar o eliminar designaciones nacionales.' : 'Para pasar una designación a la RFEA (nacional), selecciona el icono del ojo.');
            }
            setInitialJudges(processedInitialJury);

        } catch (fetchError) {
            const errorMessage = errorHandler(fetchError);
            console.error('Error al cargar los datos:', fetchError);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [token, user?.id, eventId]);

    useEffect(() => {
        if (eventId && token && user?.id) {
             fetchOfficialsAndJury();
        } else if (!token || !user?.id) {
            setError('No autenticado o información de usuario faltante.');
            setLoading(false);
        } else if (!eventId) {
            setError('ID de evento no encontrado.');
            setLoading(false);
        }
    }, [fetchOfficialsAndJury, eventId, token, user?.id]);

    const handleSubmitJury = useCallback(async (values: SubmitJuryValues): Promise<boolean> => {
        if (!token || !eventId) {
            toast.error("Error: No autenticado o ID de evento no encontrado.");
            return false;
        }
        setIsSubmittingForm(true);
        let success = false;
        try {
            const apiPayloadJuries: AddJuryDto[] = values.judges
                .filter(judge => !judge.erase)
                .filter(judge => judge.canEdit)
                .map(judge => ({
                    userId: judge.userId || null,
                    role: judge.role,
                    isNational: judge.isNational,
                    isReferee: judge.isReferee,
                }));

            const requestPayload: AddJuryListDto = { juries: apiPayloadJuries };
            await api(token).put(`/events/jury/for-event/${eventId}`, requestPayload);
            toast.success('Jurado guardado correctamente');
            await fetchOfficialsAndJury(); // Refetch data after successful submission
            success = true;
        } catch (submitError) {
            const errorMessage = errorHandler(submitError);
            toast.error(errorMessage || 'Error al guardar los datos del jurado');
            success = false;
        } finally {
            setIsSubmittingForm(false);
        }
        return success;
    }, [token, eventId, fetchOfficialsAndJury]);

    return {
        loading,
        officials,
        error,
        initialJudges,
        alertDescription,
        fetchOfficialsAndJury,
        handleSubmitJury,
        isSubmittingForm,
    };
};