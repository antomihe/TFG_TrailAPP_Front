// hooks\api\dashboard\official\useMaterialCheck.ts
import { useState, useEffect, useCallback } from 'react';
import api, { errorHandler } from '@/config/api';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { FormikHelpers } from 'formik';
import { useAuth } from '@/hooks/auth/useAuth';
import type {
    CheckPointResponseDto,
    EquipmentResponseDto,
    CheckEnrollmentResponseDto,
    CarryingEquipmentResponseDto,
    CreateMaterialCheckDto
} from '@/types/api';

export interface MaterialDetails {
    name: string;
    optional: boolean;
    id: string;
}

export interface AthleteOption {
    id: string;
    dorsal: number;
    name: string;
    isDisqualified: boolean;
}

export interface MaterialCheckFormValues {
    athlete: string | null;
    materials: { [materialId: string]: boolean };
}

export const MATERIAL_CHECK_FIELD_NAMES: { [K in keyof MaterialCheckFormValues]: K } = {
    athlete: 'athlete',
    materials: 'materials',
};

export const useMaterialCheck = () => {
    const { checkPointId } = useParams<{ checkPointId: string }>();
    const { token } = useAuth();

    const [loadingInitialData, setLoadingInitialData] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [controlName, setControlName] = useState<string | null>(null);
    const [availableMaterials, setAvailableMaterials] = useState<MaterialDetails[]>([]);
    const [athletes, setAthletes] = useState<AthleteOption[]>([]);

    const [showConfirmationDialog, setShowConfirmationDialog] = useState<boolean>(false);
    const [pendingSubmitArgs, setPendingSubmitArgs] = useState<{
        values: MaterialCheckFormValues;
        formikHelpers: FormikHelpers<MaterialCheckFormValues>;
    } | null>(null);

    const fetchInitialData = useCallback(async () => {
        if (!token || !checkPointId) {
            setError(!token ? "Usuario no autenticado." : "ID de punto de control no disponible.");
            setLoadingInitialData(false);
            return;
        }
        setLoadingInitialData(true);
        setError(null);
        try {
            const cpResponse = await api(token).get<CheckPointResponseDto>(`events/checkPoints/${checkPointId}`);
            const cpData = cpResponse.data;
            const materialIds: string[] = cpData.material || [];
            const eventId = cpData.eventId;
            setControlName(cpData.name);

            const materialsPromises = materialIds.map((materialId: string) =>
                api(token)
                    .get<EquipmentResponseDto>(`events/equipment/${materialId}`)
                    .then((fetchedMaterial) => ({
                        name: fetchedMaterial.data.name,
                        optional: fetchedMaterial.data.optional,
                        id: fetchedMaterial.data.id,
                    } as MaterialDetails))
                    .catch(err => {
                        toast.error(`Error al cargar material ID ${materialId}: ${errorHandler(err)}`);
                        return null;
                    })
            );
            const loadedMaterials = (await Promise.all(materialsPromises)).filter(m => m !== null) as MaterialDetails[];
            setAvailableMaterials(loadedMaterials);

            if (eventId) {
                const athletesResponse = await api(token).get<CheckEnrollmentResponseDto[]>(`events/checks/event-enrollments`, {
                    params: { eventId }
                });
                const apiAthletes = Array.isArray(athletesResponse.data) ? athletesResponse.data : [];
                setAthletes(apiAthletes.map(a => ({
                    id: a.id,
                    dorsal: a.dorsal,
                    name: a.displayName || a.name,
                    isDisqualified: a.isDisqualified,
                })));
            } else {
                setAthletes([]);
                toast.warning("No se pudo obtener el ID del evento del punto de control para cargar atletas.");
            }

        } catch (err) {
            const errorMessage = errorHandler(err);
            setError(errorMessage);
            toast.error(`Error al cargar datos iniciales: ${errorMessage}`);
        } finally {
            setLoadingInitialData(false);
        }
    }, [token, checkPointId]);

    useEffect(() => {
        if (checkPointId) {
            fetchInitialData();
        }
    }, [fetchInitialData, checkPointId]);

    const fetchAthleteCheckedMaterials = useCallback(async (athleteId: string): Promise<string[] | null> => {
        if (!token || !checkPointId || !athleteId) return [];
        try {
            const response = await api(token).get<CarryingEquipmentResponseDto>(`events/checks/carrying-equipment`, {
                params: { controlPointId: checkPointId, athleteId: athleteId }
            });
            const data = response.data;
            return Array.isArray(data.materials) ? data.materials : [];
        } catch (err) {
            const errorDetails = errorHandler(err);
            // Assuming errorHandler returns a structure with status or just a string
            if (typeof errorDetails === 'object' && errorDetails !== null && 'status' in errorDetails) {
                 if ((errorDetails as {status: number, message?: string}).status !== 404) {
                    toast.warning(`Error al cargar material del atleta: ${(errorDetails as {message?:string}).message}`);
                }
            } else if (typeof errorDetails === 'string') {
                toast.warning(`Error al cargar material del atleta: ${errorDetails}`);
            } else {
                 toast.warning(`Error desconocido al cargar material del atleta.`);
            }
            return null;
        }
    }, [token, checkPointId]);

    const handleSubmitMaterialCheck = useCallback(async (
        values: MaterialCheckFormValues,
        formikHelpers: FormikHelpers<MaterialCheckFormValues>,
        isConfirmedSubmit: boolean = false
    ): Promise<void> => {
        if (!token || !checkPointId || !values.athlete) {
            toast.error("No se puede enviar: falta información esencial (token, punto de control o atleta).");
            formikHelpers.setSubmitting(false);
            return;
        }

        setPendingSubmitArgs({ values, formikHelpers: formikHelpers });

        if (!isConfirmedSubmit) {
            const unselectedRequired = availableMaterials
                .filter(m => !m.optional && !values.materials[m.id]);
            if (unselectedRequired.length > 0) {
                setShowConfirmationDialog(true);
                formikHelpers.setSubmitting(false);
                return;
            }
        }

        formikHelpers.setSubmitting(true);
        setShowConfirmationDialog(false);

        try {
            const selectedMaterialIds = Object.entries(values.materials)
                .filter(([, selected]) => selected)
                .map(([materialId]) => materialId);

            const payload: CreateMaterialCheckDto = {
                controlPointId: checkPointId,
                athlete: values.athlete,
                material: selectedMaterialIds,
            };
            await api(token).post(`events/checks`, payload);

            toast.success("Material del atleta guardado correctamente.");
            formikHelpers.resetForm({
                values: {
                    athlete: null,
                    materials: availableMaterials.reduce((acc, item) => {
                        acc[item.id] = false;
                        return acc;
                    }, {} as { [key: string]: boolean })
                }
            });
        } catch (err) {
            const errorMessage = errorHandler(err);
            toast.error(`Error al guardar: ${errorMessage}`);
        } finally {
            setPendingSubmitArgs(null);
            formikHelpers.setSubmitting(false);
        }
    }, [token, checkPointId, availableMaterials]);

    const confirmAndSubmitPending = () => {
        if (pendingSubmitArgs) {
            handleSubmitMaterialCheck(pendingSubmitArgs.values, pendingSubmitArgs.formikHelpers, true);
        }
    };

    const cancelPendingSubmit = () => {
        setShowConfirmationDialog(false);
        setPendingSubmitArgs(null);
    };

    const initialFormikValues: MaterialCheckFormValues = {
        [MATERIAL_CHECK_FIELD_NAMES.athlete]: null,
        [MATERIAL_CHECK_FIELD_NAMES.materials]: availableMaterials.reduce((acc, item) => {
            acc[item.id] = false;
            return acc;
        }, {} as { [key: string]: boolean }),
    };

    return {
        loadingInitialData,
        error,
        controlName,
        availableMaterials,
        athletes,
        fetchAthleteCheckedMaterials,
        handleSubmitMaterialCheck,
        showConfirmationDialog,
        confirmAndSubmitPending,
        cancelPendingSubmit,
        initialFormikValues,
        FIELD_NAMES: MATERIAL_CHECK_FIELD_NAMES,
    };
};