'use client';

import React, { useState, useEffect } from "react";
import { Formik, FieldArray, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
    RotateCcwIcon,
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
import { Skeleton } from "@/components/ui/skeleton";
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
import { useNationalJuryFormData, NationalJudgeFormData } from "@/hooks/api/dashboard/nationalFederation/useNationalJuryFormData";
import { NationalJudgeRowDesktop } from "./NationalJudgeRowDesktop";
import { NationalJudgeRowMobile } from "./NationalJudgeRowMobile";
import { NationalJuryFormInfoAlert } from "./NationalJuryFormInfoAlert";
import { NationalJuryFormSkeleton } from "./NationalJuryFormSkeleton";

const validationSchema = Yup.object().shape({
    judges: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().when(['isNational', 'erase'], (values, schema) => {
                const [isNational, erase] = values;
                if (!isNational || erase) {
                    return schema.notRequired();
                }
                return schema.required("El juez es obligatorio si es designación nacional y no está marcado para borrar/devolver.");
            }),
            role: Yup.string().required("Rol es obligatorio"),
            isNational: Yup.boolean(),
            isReferee: Yup.boolean(),
            userId: Yup.string().nullable(),
        })
    ).min(1, "Debe haber al menos un Juez Árbitro."),
});

interface NationalJuryFormSubmitValues {
    judges: NationalJudgeFormData[];
}

export interface NationalJudgeRowProps {
    judge: NationalJudgeFormData;
    index: number;
    values: NationalJuryFormSubmitValues;
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    openPopovers: boolean[];
    setOpenPopovers: React.Dispatch<React.SetStateAction<boolean[]>>;
    selectedOfficialUserIds: (string | null)[];
    officials: { id: string; fullName: string }[];
}

export default function NationalJuryEventForm() {
    const {
        loading,
        officials,
        error,
        initialJudges,
        fetchNationalOfficialsAndJury,
        handleSubmitNationalJury,
        isSubmittingForm,
    } = useNationalJuryFormData();

    const [openPopovers, setOpenPopovers] = useState<boolean[]>([]);
    const [isInfoAlertOpen, setIsInfoAlertOpen] = useState(true);

    useEffect(() => {
        if (initialJudges.length > 0) {
            setOpenPopovers(new Array(initialJudges.length).fill(false));
        }
    }, [initialJudges]);


    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <NationalJuryFormSkeleton />
            </div>
        );
    }


    if (error) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Alert variant="destructive" className="my-4">
                    <AlertTitle>Error Inesperado</AlertTitle>
                    <AlertDescription>
                        {error || "No se pudieron cargar los datos del jurado nacional. Por favor, inténtelo de nuevo."}
                    </AlertDescription>
                    <Button onClick={fetchNationalOfficialsAndJury} variant="outline" size="sm" className="mt-4">
                        <RotateCcwIcon className="mr-2 h-4 w-4" /> Reintentar Carga
                    </Button>
                </Alert>
            </div>
        );
    }


    return (
        <div className="max-w-4xl mx-auto py-6 sm:py-8 px-2 sm:px-6 lg:px-8">
            <NationalJuryFormInfoAlert
                isInfoAlertOpen={isInfoAlertOpen}
                setIsInfoAlertOpen={setIsInfoAlertOpen}
            />

            <Formik
                enableReinitialize
                initialValues={{ judges: initialJudges }}
                validationSchema={validationSchema}
                onSubmit={async (values: NationalJuryFormSubmitValues, formikActions: FormikHelpers<NationalJuryFormSubmitValues>) => {
                    await handleSubmitNationalJury(values);
                    if (!isSubmittingForm) {
                        formikActions.setSubmitting(false);
                    }
                }}
            >
                {({ values, errors, touched, handleSubmit, setFieldValue, dirty, isSubmitting }) => {
                    const selectedOfficialUserIds = values.judges.map(judge => judge.userId).filter(Boolean);
                    return (
                        <Card className="shadow-lg dark:shadow-slate-800 overflow-hidden">
                            <CardHeader className="px-4 py-4 sm:px-6 sm:py-5">
                                <div className="flex items-center">
                                    <UsersIcon className="h-6 w-6 mr-2 sm:hidden text-primary" />
                                    <CardTitle className="text-xl sm:text-2xl text-foreground">Miembros del Jurado</CardTitle>
                                </div>
                                <CardDescription className="text-muted-foreground mt-1">
                                    Asigne roles y nombres. El Juez Árbitro es obligatorio.
                                </CardDescription>
                            </CardHeader>
                            <Form onSubmit={handleSubmit}>
                                <CardContent className="p-0 sm:p-6">
                                    <FieldArray name="judges">
                                        {() => (
                                            <>
                                                <div className="hidden sm:block overflow-x-auto">
                                                    <Table className="min-w-full">
                                                        <TableHeader>
                                                            <TableRow className="border-b border-border">
                                                                <TableHead className="w-[35%] whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Rol</TableHead>
                                                                <TableHead className="w-[40%] whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Nombre (Juez Nacional)</TableHead>
                                                                <TableHead className="w-[25%] whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-muted-foreground">Acciones</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {values.judges.length === 0 ? (
                                                                <TableRow className="border-border">
                                                                    <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                                                                        No hay puestos de jurado configurados para este evento.
                                                                    </TableCell>
                                                                </TableRow>
                                                            ) : (
                                                                values.judges.map((judge, index) => (
                                                                    <NationalJudgeRowDesktop
                                                                        key={`desktop-${judge.userId || index}`}
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
                                                            No hay puestos de jurado configurados.
                                                        </div>
                                                    ) : (
                                                        values.judges.map((judge, index) => (
                                                            <NationalJudgeRowMobile
                                                                key={`mobile-${judge.userId || index}`}
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



