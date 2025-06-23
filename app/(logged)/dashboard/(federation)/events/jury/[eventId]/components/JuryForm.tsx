// app\(logged)\dashboard\(federation)\events\jury\[eventId]\components\JuryForm.tsx
'use client';

import React, { useState, useEffect } from "react";
import { Formik, FieldArray, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
    RotateCcwIcon,
    PlusCircleIcon,
    UsersIcon,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useJuryFormData, JudgeFormData } from "@/hooks/api/dashboard/federation/useJuryFormData";
import { JuryFormInfoAlert } from "./JuryFormInfoAlert";
import { JudgeRowDesktop } from "./JudgeRowDesktop";
import { JudgeRowMobile } from "./JudgeRowMobile";
import { JuryFormSkeleton } from "./JuryFormSkeleton";

const validationSchema = Yup.object().shape({
    judges: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().when(['isNational', 'erase'], (values, schema) => {
                const [isNational, erase] = values;
                if (isNational || erase) {
                    return schema.notRequired();
                }
                return schema.required("El juez es obligatorio si no es designación nacional y no está marcado para borrar.");
            }),
            role: Yup.string().required("Rol es obligatorio"),
            isNational: Yup.boolean(),
            isReferee: Yup.boolean(),
            userId: Yup.string().nullable(),
        })
    ).min(1, "Debe haber al menos un Juez Árbitro."),
});

interface JuryFormSubmitValues {
    judges: JudgeFormData[];
}

export interface JudgeRowProps {
    judge: JudgeFormData;
    index: number;
    values: JuryFormSubmitValues;
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    openPopovers: boolean[];
    setOpenPopovers: React.Dispatch<React.SetStateAction<boolean[]>>;
    selectedOfficialUserIds: (string | null)[];
    officials: { id: string; fullName: string }[];
}

export default function JuryForm() {
    const {
        loading,
        officials: rawOfficials,
        error,
        initialJudges,
        alertDescription,
        fetchOfficialsAndJury,
        handleSubmitJury,
        isSubmittingForm,
    } = useJuryFormData();

    const officials = (rawOfficials ?? []).map(o => ({
        id: o.id,
        fullName: typeof o.fullName === "string" ? o.fullName : String(o.fullName ?? ""),
    }));

    const [openPopovers, setOpenPopovers] = useState<boolean[]>([]);
    const [isInfoAlertOpen, setIsInfoAlertOpen] = useState(true);

    useEffect(() => {
        if (initialJudges.length > 0) {
            setOpenPopovers(new Array(initialJudges.length).fill(false));
            if (alertDescription) {
                setIsInfoAlertOpen(true);
            } else {


            }
        }
    }, [initialJudges, alertDescription]);


    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <JuryFormSkeleton alertDescription={alertDescription} />
            </div>
        );
    }


    if (error && initialJudges.length === 0 && !loading) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Alert variant="destructive" className="my-4">
                    <AlertTitle>Error Crítico</AlertTitle>
                    <AlertDescription>
                        {error || "No se pudieron cargar los datos del jurado. Por favor, inténtelo de nuevo."}
                    </AlertDescription>
                    <Button onClick={fetchOfficialsAndJury} variant="outline" size="sm" className="mt-4">
                        <RotateCcwIcon className="mr-2 h-4 w-4" /> Reintentar Carga
                    </Button>
                </Alert>
            </div>
        );
    }


    return (
        <div className="max-w-4xl mx-auto py-6 sm:py-8 px-2 sm:px-6 lg:px-8"> 
            {error && initialJudges.length > 0 && (
                <Alert variant="destructive" className="mb-6 mx-2 sm:mx-0">
                    <AlertTitle>Advertencia</AlertTitle>
                    <AlertDescription>{error} Algunos datos podrían no estar completamente actualizados. Revise la información.</AlertDescription>
                </Alert>
            )}

            {alertDescription && (
                <JuryFormInfoAlert
                    isInfoAlertOpen={isInfoAlertOpen}
                    setIsInfoAlertOpen={setIsInfoAlertOpen}
                    alertDescription={alertDescription}
                />
            )}

            <Formik
                enableReinitialize
                initialValues={{ judges: initialJudges }}
                validationSchema={validationSchema}
                onSubmit={async (values: JuryFormSubmitValues, formikActions: FormikHelpers<JuryFormSubmitValues>) => {
                    await handleSubmitJury(values);
                    if (!isSubmittingForm) {
                        formikActions.setSubmitting(false);
                    }
                }}
            >
                {({ values, errors, touched, handleSubmit, setFieldValue, dirty, isSubmitting }) => {
                    const selectedOfficialUserIds = values.judges.map(judge => judge.userId).filter(Boolean);
                    return (
                        <Card className="shadow-lg overflow-hidden">
                            <CardHeader className="px-4 py-4 sm:px-6 sm:py-5">
                                <div className="flex items-center">
                                    <UsersIcon className="h-6 w-6 mr-2 sm:hidden text-primary" />
                                    <CardTitle className="text-xl sm:text-2xl text-foreground">Miembros del Jurado</CardTitle>
                                </div>
                                <CardDescription className="text-muted-foreground mt-1">
                                    Defina roles y asigne oficiales. El Juez Árbitro es obligatorio.
                                </CardDescription>
                            </CardHeader>
                            <Form onSubmit={handleSubmit}>
                                <CardContent className="p-0 sm:p-6">
                                    <FieldArray name="judges">
                                        {({ push, remove }) => (
                                            <>
                                                {/* Desktop Table View */}
                                                <div className="hidden sm:block overflow-x-auto mb-6">
                                                    <Table className="min-w-full">
                                                        <TableHeader>
                                                            <TableRow className="border-b border-border">
                                                                <TableHead className="w-[35%] whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Rol</TableHead>
                                                                <TableHead className="w-[40%] whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Nombre del Juez</TableHead>
                                                                <TableHead className="w-[25%] whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-muted-foreground">Acciones</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {values.judges.length === 0 ? (
                                                                <TableRow className="border-border">
                                                                    <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                                                                        No hay jueces configurados.
                                                                    </TableCell>
                                                                </TableRow>
                                                            ) : (
                                                                values.judges.map((judge, index) => (
                                                                    <JudgeRowDesktop
                                                                        key={`desktop-${index}`}
                                                                        judge={judge}
                                                                        index={index}
                                                                        values={values}
                                                                        errors={errors}
                                                                        touched={touched}
                                                                        setFieldValue={setFieldValue}
                                                                        openPopovers={openPopovers}
                                                                        setOpenPopovers={setOpenPopovers}
                                                                        selectedOfficialUserIds={selectedOfficialUserIds}
                                                                        officials={officials}
                                                                    />
                                                                ))
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>

                                                {/* Mobile Stacked View */}
                                                <div className="sm:hidden space-y-4 p-4">
                                                    {values.judges.length === 0 ? (
                                                        <div className="text-center text-muted-foreground py-10">
                                                            No hay jueces configurados.
                                                        </div>
                                                    ) : (
                                                        values.judges.map((judge, index) => (
                                                            <JudgeRowMobile
                                                                key={`mobile-${index}`}
                                                                judge={judge}
                                                                index={index}
                                                                values={values}
                                                                errors={errors}
                                                                touched={touched}
                                                                setFieldValue={setFieldValue}
                                                                openPopovers={openPopovers}
                                                                setOpenPopovers={setOpenPopovers}
                                                                selectedOfficialUserIds={selectedOfficialUserIds}
                                                                officials={officials}
                                                            />
                                                        ))
                                                    )}
                                                </div>

                                                <div className="px-4 pb-4 sm:px-0 sm:pb-0">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="w-full border-dashed hover:border-solid hover:bg-accent text-muted-foreground hover:text-foreground"
                                                        onClick={() => {
                                                            push({ role: 'Juez Auxiliar', name: '', userId: null, isNational: false, isReferee: false, canEdit: true, erase: false, originalData: null });
                                                            setOpenPopovers(prev => [...prev, false]);
                                                        }}
                                                    >
                                                        <PlusCircleIcon className="mr-2 h-4 w-4" />
                                                        Añadir Juez Auxiliar
                                                    </Button>
                                                </div>
                                                {errors.judges && typeof errors.judges === 'string' && (
                                                    <div className="text-red-600 dark:text-red-500 text-sm mt-3 px-4 sm:px-1">{errors.judges}</div>
                                                )}
                                            </>
                                        )}
                                    </FieldArray>
                                </CardContent>
                                <CardFooter className="border-t border-border px-4 py-4 sm:px-6 sm:py-4">
                                    <Button type="submit" disabled={isSubmitting || isSubmittingForm || loading || !dirty} className="ml-auto w-full sm:w-auto">
                                        {isSubmitting || isSubmittingForm ? 'Guardando...' : 'Guardar Cambios'}
                                    </Button>
                                </CardFooter>
                            </Form>
                        </Card>
                    );
                }}
            </Formik >
        </div >
    );
}
