// hooks\api\dashboard\nationalFederation\useNationalJuryFormData.ts
// hooks/api/dashboard/nationalFederation/jury/useNationalJuryFormData.ts
import { useState, useEffect, useCallback } from "react";
import api, { errorHandler } from "@/config/api";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { toast } from "sonner";
import type { OfficialResponseDto, JuryResponseDto, AddJuryDto, AddJuryListDto } from "@/types/api";

export type NationalJudgeFormData = {
    role: string;
    name: string;
    isNational: boolean;
    isReferee: boolean;
    userId: string | null;
    canEdit: boolean; // Para la FN, esto es generalmente true para las designaciones que gestiona
    erase: boolean;
    originalData?: JuryResponseDto & { officialName?: string };
};

export type NationalOfficialOption = Pick<OfficialResponseDto, 'id' | 'fullName'>;

interface SubmitNationalJuryValues {
    judges: NationalJudgeFormData[];
}

export const useNationalJuryFormData = () => {
    const { user, token } = useAuth();
    const params = useParams();
    const eventId = params.eventId as string;

    const [loading, setLoading] = useState(true);
    const [officials, setOfficials] = useState<NationalOfficialOption[]>([]);
    const [error, setError] = useState<string>('');
    const [initialJudges, setInitialJudges] = useState<NationalJudgeFormData[]>([]);
    const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

    const fetchNationalOfficialsAndJury = useCallback(async () => {
        setLoading(true);
        setError('');
        setInitialJudges([]);

        if (!token || !eventId) {
            setError('No autenticado o ID de evento no encontrado.');
            setLoading(false);
            return;
        }

        try {
            if (!user?.id || !token) {
                setError('No autenticado o información de usuario faltante.');
                setLoading(false);
                return;
            }else if (!eventId) {
                setError('ID de evento no encontrado.');
                setLoading(false);
                return;
            }

            const resOfficials = await api(token).get<OfficialResponseDto[]>(`users/official/for-national-federation`);
            setOfficials(Array.isArray(resOfficials.data) ? resOfficials.data.map(o => ({ id: o.id, fullName: o.fullName })) : []);

            const resJury = await api(token).get<JuryResponseDto[]>(`/events/jury/for-event/${eventId}`);
            const currentApiJury = Array.isArray(resJury.data) ? resJury.data : [];
            const orderedApiJury = [...currentApiJury].sort((a, b) => (b.isReferee ? 1 : 0) - (a.isReferee ? 1 : 0));

            if (orderedApiJury.length === 0 && loading) {
                setError('No se ha realizado aún ninguna designación por la federación autonómica para este evento, o no hay designaciones nacionales.');
            }

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
                    canEdit: apiJudge.isNational,
                    erase: false,
                    originalData: { ...apiJudge, officialName },
                };
            });
            const processedInitialJury: NationalJudgeFormData[] = await Promise.all(juryPromises);
            setInitialJudges(processedInitialJury);

        } catch (fetchError) {
            const errorMessage = errorHandler(fetchError);
            console.error('Error al cargar los datos:', fetchError);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [token, eventId, user?.id]);

    useEffect(() => {
        if (eventId && token && user?.id) {
            fetchNationalOfficialsAndJury();
        } else if (!token || !user?.id) {
            setError('No autenticado o información de usuario faltante.');
            setLoading(false);
        } else if (!eventId) {
            setError('ID de evento no encontrado.');
            setLoading(false);
        }
    }, [fetchNationalOfficialsAndJury, eventId, token, user?.id]);

    const handleSubmitNationalJury = useCallback(async (values: SubmitNationalJuryValues): Promise<boolean> => {
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
            toast.success('Jurado guardado correctamente por la Federación Nacional.');
            await fetchNationalOfficialsAndJury();
            success = true;
        } catch (submitError) {
            const errorMessage = errorHandler(submitError);
            toast.error(errorMessage || 'Error al guardar los datos del jurado');
            success = false;
        } finally {
            setIsSubmittingForm(false);
        }
        return success;
    }, [token, eventId, fetchNationalOfficialsAndJury]);

    return {
        loading,
        officials,
        error,
        initialJudges,
        fetchNationalOfficialsAndJury,
        handleSubmitNationalJury,
        isSubmittingForm,
    };
};