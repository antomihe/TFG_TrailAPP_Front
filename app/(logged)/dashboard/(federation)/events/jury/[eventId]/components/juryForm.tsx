// app\(logged)\dashboard\(federation)\events\jury\[eventId]\components\JuryForm.tsx
'use client';

import React, { useState, useEffect } from "react";
import { Formik, Field, FieldArray, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    XIcon,
    EyeIcon,
    EyeOffIcon,
    InfoIcon,
    RotateCcwIcon,
    ChevronsUpDown,
    ChevronDownIcon,
    PlusCircleIcon,
    UsersIcon,
    FileTextIcon,
    UserIcon,
    SettingsIcon,
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
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useJuryFormData, JudgeFormData } from "@/hooks/api/dashboard/federation/useJuryFormData";



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
        displayName: typeof o.displayName === "string" ? o.displayName : String(o.displayName ?? ""),
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
                <Skeleton className="h-10 w-2/3 mb-4 sm:w-1/2" /> {/* Title */}
                {alertDescription && <Skeleton className="h-16 w-full mb-6" />} {/* Alert */}
                <Card className="overflow-hidden">
                    <CardHeader>
                        <Skeleton className="h-8 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="px-0 sm:px-6">
                        {/* Mobile Skeleton for rows */}
                        <div className="sm:hidden space-y-4 p-4">
                            {[1, 2].map(i => (
                                <div key={i} className="border border-border rounded-lg p-4 space-y-3">
                                    <Skeleton className="h-5 w-1/4" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-5 w-1/4 mt-2" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-8 w-1/3 ml-auto mt-2" />
                                </div>
                            ))}
                        </div>
                        {/* Desktop Skeleton for table */}
                        <div className="hidden sm:block">
                            <Skeleton className="h-10 w-full mb-2" /> {/* Header */}
                            <Skeleton className="h-16 w-full mb-2" /> {/* Row 1 */}
                            <Skeleton className="h-16 w-full" />      {/* Row 2 */}
                        </div>
                        <div className="p-4 sm:p-0">
                            <Skeleton className="h-10 w-full mt-4" /> {/* Add judge button */}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-28 ml-auto" /> {/* Submit button */}
                    </CardFooter>
                </Card>
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
        <div className="max-w-4xl mx-auto py-6 sm:py-8 px-2 sm:px-6 lg:px-8"> {/* Reduced padding on smallest screens */}
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 px-2 sm:px-0">
                Configuración del Jurado del Evento
            </h1>

            {/* Error as a non-critical warning if some data is loaded */}
            {error && initialJudges.length > 0 && (
                <Alert variant="destructive" className="mb-6 mx-2 sm:mx-0">
                    <AlertTitle>Advertencia</AlertTitle>
                    <AlertDescription>{error} Algunos datos podrían no estar completamente actualizados. Revise la información.</AlertDescription>
                </Alert>
            )}

            {/* Collapsible Informational Alert */}
            {alertDescription && (
                <Collapsible open={isInfoAlertOpen} onOpenChange={setIsInfoAlertOpen} className="mb-6 mx-2 sm:mx-0">
                    <Alert className="bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700/50 text-amber-800 dark:text-amber-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <InfoIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 sm:mr-3" />
                                <AlertTitle className="font-semibold text-amber-700 dark:text-amber-300">
                                    Info Designaciones
                                </AlertTitle>
                            </div>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="w-9 p-0 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/50">
                                    <span className="sr-only">{isInfoAlertOpen ? "Ocultar" : "Mostrar"} información</span>
                                    <ChevronDownIcon className={cn("h-5 w-5 transition-transform", isInfoAlertOpen && "rotate-180")} />
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent>
                            <AlertDescription className="mt-3 text-sm space-y-2 text-amber-700/90 dark:text-amber-300/90">
                                <p>{alertDescription}</p>
                                <p className="mt-2 font-medium">Gestión:</p>
                                <ul className="list-disc list-inside pl-4 text-xs">
                                    <li><strong>Juez Local:</strong> Seleccione un oficial.</li>
                                    <li><strong>Nacional (RFEA):</strong> No editable aquí. Para cambiar a local, use <EyeOffIcon className="inline h-3 w-3 relative -top-px" />.</li>
                                    <li><strong>Solicitar Nacional:</strong> Para un puesto local, use <EyeIcon className="inline h-3 w-3 relative -top-px" />. Nombre local se borrará.</li>
                                    <li><strong>Eliminar:</strong> Use <XIcon className="inline h-3 w-3 relative -top-px" /> (no para Juez Árbitro).</li>
                                </ul>
                            </AlertDescription>
                        </CollapsibleContent>
                    </Alert>
                </Collapsible>
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
                        <Card className="shadow-lg overflow-hidden"> {/* overflow-hidden for rounded corners with no-padding CardContent */}
                            <CardHeader className="px-4 py-4 sm:px-6 sm:py-5"> {/* Reduced padding on mobile */}
                                <div className="flex items-center">
                                    <UsersIcon className="h-6 w-6 mr-2 sm:hidden text-primary" /> {/* Mobile Icon for Title */}
                                    <CardTitle className="text-xl sm:text-2xl text-foreground">Miembros del Jurado</CardTitle>
                                </div>
                                <CardDescription className="text-muted-foreground mt-1">
                                    Defina roles y asigne oficiales. El Juez Árbitro es obligatorio.
                                </CardDescription>
                            </CardHeader>
                            <Form onSubmit={handleSubmit}>
                                <CardContent className="p-0 sm:p-6"> {/* No padding on mobile, handled by inner divs */}
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

                                                <div className="px-4 pb-4 sm:px-0 sm:pb-0"> {/* Padding for button on mobile */}
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

interface JudgeRowProps {
    judge: JudgeFormData;
    index: number;
    values: JuryFormSubmitValues;
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    openPopovers: boolean[];
    setOpenPopovers: React.Dispatch<React.SetStateAction<boolean[]>>;
    selectedOfficialUserIds: (string | null)[];
    officials: { id: string; displayName: string }[];
}

const JudgeRowDesktop: React.FC<JudgeRowProps> = ({
    judge, index, values, errors, touched, setFieldValue, openPopovers, setOpenPopovers, selectedOfficialUserIds, officials
}) => {
    return (
        <TableRow
            className={cn(
                "border-b border-border transition-colors hover:bg-muted/50 dark:hover:bg-muted/30",
                judge.erase && "opacity-50 bg-red-50 dark:bg-red-900/30 hover:bg-red-100/50 dark:hover:bg-red-800/40",
            )}
        >
            <TableCell className="px-4 py-3 align-top">
                <Field
                    as={Input}
                    name={`judges.${index}.role`}
                    readOnly={judge.isReferee || (!judge.canEdit && judge.isNational)}
                    disabled={judge.erase || (!judge.canEdit && judge.isNational)}
                    value={judge.isReferee ? 'Juez Árbitro' : judge.role}
                    className={cn(
                        "w-full bg-background border-input text-foreground",
                        judge.isReferee && "font-semibold",
                        judge.erase && "line-through text-destructive placeholder:text-destructive/70",
                        (!judge.canEdit && judge.isNational) && "cursor-not-allowed opacity-70"
                    )}
                />
                {errors.judges && (errors.judges as any)[index] && (errors.judges as any)[index].role && touched.judges && touched.judges[index]?.role && (
                    <div className="text-red-600 dark:text-red-500 text-xs mt-1.5">
                        {(errors.judges as any)[index].role}
                    </div>
                )}
            </TableCell>
            <TableCell className="px-4 py-3 align-top">
                <JudgeNamePopover
                    judge={judge} index={index} setFieldValue={setFieldValue}
                    openPopovers={openPopovers} setOpenPopovers={setOpenPopovers}
                    selectedOfficialUserIds={selectedOfficialUserIds} officials={officials}
                />
                {errors.judges && (errors.judges as any)[index] && (errors.judges as any)[index].name && touched.judges && touched.judges[index]?.name && (
                    <div className="text-red-600 dark:text-red-500 text-xs mt-1.5">
                        {(errors.judges as any)[index].name}
                    </div>
                )}
            </TableCell>
            <TableCell className="px-4 py-3 text-right align-top">
                <JudgeActions judge={judge} index={index} values={values} setFieldValue={setFieldValue} />
            </TableCell>
        </TableRow>
    );
};

const JudgeRowMobile: React.FC<JudgeRowProps> = ({
    judge, index, values, errors, touched, setFieldValue, openPopovers, setOpenPopovers, selectedOfficialUserIds, officials
}) => {
    return (
        <div
            className={cn(
                "border border-border rounded-lg p-4 space-y-3 transition-colors",
                judge.erase && "opacity-50 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/40",
            )}
        >
            <div>
                <label htmlFor={`judges.${index}.role`} className="flex items-center text-xs font-medium text-muted-foreground mb-1">
                    <FileTextIcon className="h-3.5 w-3.5 mr-1.5" /> Rol
                </label>
                <Field
                    as={Input}
                    id={`judges.${index}.role`}
                    name={`judges.${index}.role`}
                    readOnly={judge.isReferee || (!judge.canEdit && judge.isNational)}
                    disabled={judge.erase || (!judge.canEdit && judge.isNational)}
                    value={judge.isReferee ? 'Juez Árbitro' : judge.role}
                    className={cn(
                        "w-full bg-background border-input text-foreground",
                        judge.isReferee && "font-semibold",
                        judge.erase && "line-through text-destructive placeholder:text-destructive/70",
                        (!judge.canEdit && judge.isNational) && "cursor-not-allowed opacity-70"
                    )}
                />
                {errors.judges && (errors.judges as any)[index] && (errors.judges as any)[index].role && touched.judges && touched.judges[index]?.role && (
                    <div className="text-red-600 dark:text-red-500 text-xs mt-1">
                        {(errors.judges as any)[index].role}
                    </div>
                )}
            </div>

            <div>
                <label htmlFor={`judges.${index}.name`} className="flex items-center text-xs font-medium text-muted-foreground mb-1">
                    <UserIcon className="h-3.5 w-3.5 mr-1.5" /> Nombre del Juez
                </label>
                <JudgeNamePopover
                    judge={judge} index={index} setFieldValue={setFieldValue}
                    openPopovers={openPopovers} setOpenPopovers={setOpenPopovers}
                    selectedOfficialUserIds={selectedOfficialUserIds} officials={officials}
                    isMobile
                />
                {errors.judges && (errors.judges as any)[index] && (errors.judges as any)[index].name && touched.judges && touched.judges[index]?.name && (
                    <div className="text-red-600 dark:text-red-500 text-xs mt-1">
                        {(errors.judges as any)[index].name}
                    </div>
                )}
            </div>

            <div>
                <label className="flex items-center text-xs font-medium text-muted-foreground mb-1">
                    <SettingsIcon className="h-3.5 w-3.5 mr-1.5" /> Acciones
                </label>
                <div className="flex justify-end space-x-2"> {/* Align actions to the right */}
                    <JudgeActions judge={judge} index={index} values={values} setFieldValue={setFieldValue} isMobile />
                </div>
            </div>
        </div>
    );
};



interface JudgeNamePopoverProps extends Omit<JudgeRowProps, 'values' | 'errors' | 'touched'> {
    isMobile?: boolean;
}

const JudgeNamePopover: React.FC<JudgeNamePopoverProps> = ({
    judge, index, setFieldValue, openPopovers, setOpenPopovers, selectedOfficialUserIds, officials, isMobile
}) => {

    const handleSelectOfficial = (official: { id: string; displayName: string }) => {
        setFieldValue(`judges.${index}.userId`, official.id);
        setFieldValue(`judges.${index}.name`, official.displayName);
        setOpenPopovers(prev => {
            const newOpenPopovers = [...prev];
            newOpenPopovers[index] = false;
            return newOpenPopovers;
        });
    };

    return (
        <Popover open={openPopovers[index]} onOpenChange={(isOpen) => {
            const newOpenPopovers = [...openPopovers];
            newOpenPopovers[index] = isOpen;
            setOpenPopovers(newOpenPopovers);
        }}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={judge.isNational || judge.erase || !judge.canEdit}
                    role="combobox"
                    aria-expanded={openPopovers[index]}
                    className={cn(
                        "w-full justify-between font-normal text-foreground border-input",
                        !judge.name && !judge.isNational && "text-muted-foreground",
                        judge.isNational && "text-muted-foreground italic",
                        judge.erase && "line-through text-destructive placeholder:text-destructive/70",
                        (judge.isNational || !judge.canEdit) && "cursor-not-allowed opacity-70"
                    )}
                >
                    <span className="truncate">
                        {judge.name || (judge.isNational ? judge.originalData?.officialName || "Designación Nacional (RFEA)" : "Seleccionar Juez Local...")}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            {judge.canEdit && !judge.isNational && !judge.erase && (
                <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                    onOpenAutoFocus={(e) => {
                        e.preventDefault();
                    }}
                >
                    <Command>
                        <CommandInput placeholder="Buscar juez por nombre..." />
                        <CommandList>
                            <CommandEmpty>No se encontraron jueces locales.</CommandEmpty>
                            <CommandGroup>
                                {officials
                                    .filter(official => !selectedOfficialUserIds.includes(official.id) || official.id === judge.userId)
                                    .map(official => (
                                        <CommandItem
                                            key={official.id}
                                            value={official.displayName}
                                            onSelect={() => handleSelectOfficial(official)}
                                        >
                                            {official.displayName}
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            )}
        </Popover>
    );
};

interface JudgeActionsProps extends Omit<JudgeRowProps, 'errors' | 'touched' | 'openPopovers' | 'setOpenPopovers' | 'selectedOfficialUserIds' | 'officials'> {
    isMobile?: boolean;
}

const JudgeActions: React.FC<JudgeActionsProps> = ({ judge, index, values, setFieldValue, isMobile }) => {
    return (
        <div className="flex items-center justify-end space-x-2">
            {(judge.canEdit || !judge.isNational) && !judge.erase && (
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title={judge.isNational ? "Solicitar designación local" : "Solicitar designación nacional"}
                    onClick={() => {
                        const newIsNational = !values.judges[index].isNational;
                        setFieldValue(`judges.${index}.isNational`, newIsNational);
                        if (!newIsNational && judge.originalData?.userId && judge.originalData?.officialName) {
                            setFieldValue(`judges.${index}.userId`, judge.originalData.userId);
                            setFieldValue(`judges.${index}.name`, judge.originalData.officialName);
                        } else if (newIsNational) {
                            setFieldValue(`judges.${index}.userId`, null);
                            setFieldValue(`judges.${index}.name`, '');
                        }
                    }}
                    className={cn(
                        "border-input hover:bg-accent",
                        judge.isNational
                            ? "text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300"
                            : "text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300",
                        isMobile && "h-9 w-9"
                    )}
                >
                    {values.judges[index].isNational ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
            )}

            {!judge.isReferee && (judge.canEdit || !judge.isNational) && (
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title={judge.erase ? "Restaurar juez" : "Marcar para eliminar"}
                    onClick={() => {
                        setFieldValue(`judges.${index}.erase`, !judge.erase);
                    }}
                    className={cn(
                        "border-input hover:bg-accent",
                        judge.erase
                            ? "text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                            : "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300",
                        isMobile && "h-9 w-9"
                    )}
                >
                    {judge.erase ? <RotateCcwIcon className="h-4 w-4" /> : <XIcon className="h-4 w-4" />}
                </Button>
            )}
        </div>
    );
};