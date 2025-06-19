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
    UsersIcon,      // Icon for "Miembros del Jurado" on mobile
    FileTextIcon,   // Icon for "Rol" on mobile
    UserIcon,       // Icon for "Nombre" on mobile
    SettingsIcon,   // Icon for "Acciones" on mobile
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
import { useNationalJuryFormData, NationalJudgeFormData } from "@/hooks/api/dashboard/nationalFederation/useNationalJuryFormData";

const validationSchema = Yup.object().shape({
    judges: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().when(['isNational', 'erase'], (values, schema) => {
                const [isNational, erase] = values;
                if (!isNational || erase) { // Si NO es nacional O está marcado para borrar, el nombre no es obligatorio (RFEA gestiona)
                    return schema.notRequired();
                }
                // Si ES nacional Y NO está marcado para borrar, el nombre es obligatorio
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
    const [isInfoAlertOpen, setIsInfoAlertOpen] = useState(true); // Default to true for this form as info is crucial

    useEffect(() => {
        if (initialJudges.length > 0) {
            setOpenPopovers(new Array(initialJudges.length).fill(false));
        }
    }, [initialJudges]);

    // --- Loading State ---
    if (loading) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Skeleton className="h-10 w-2/3 mb-4 sm:w-1/2" /> {/* Title */}
                <Skeleton className="h-24 w-full mb-6" /> {/* Alert (can be taller) */}
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
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-28 ml-auto" /> {/* Submit button */}
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // --- Error State ---
    if (error) { // Simplified error display for this form
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

    // --- Main Content ---
    return (
        <div className="max-w-4xl mx-auto py-6 sm:py-8 px-2 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 px-2 sm:px-0">
                Gestión de Jurado Nacional
            </h1>

            <Collapsible open={isInfoAlertOpen} onOpenChange={setIsInfoAlertOpen} className="mb-6 mx-2 sm:mx-0">
                <Alert className="bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700/50 text-blue-800 dark:text-blue-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <InfoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 sm:mr-3" />
                            <AlertTitle className="font-semibold text-blue-700 dark:text-blue-300">
                                Info Jurado Nacional
                            </AlertTitle>
                        </div>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-9 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50">
                                <span className="sr-only">{isInfoAlertOpen ? "Ocultar" : "Mostrar"} información</span>
                                <ChevronDownIcon className={cn("h-5 w-5 transition-transform", isInfoAlertOpen && "rotate-180")} />
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                        <AlertDescription className="mt-3 text-sm space-y-2 text-blue-700/90 dark:text-blue-300/90">
                            <p>
                                Asigne jueces nacionales (RFEA) a este evento o devuelva designaciones.
                            </p>
                            <p className="mt-2 font-medium">Gestión:</p>
                            <ul className="list-disc list-inside pl-4 text-xs">
                                <li><strong>Asignar Juez Nacional:</strong> Si un puesto es 'Nacional', seleccione un oficial RFEA.</li>
                                <li><strong>Devolver a Autonómica:</strong> Para un puesto 'Nacional', use <EyeOffIcon className="inline h-3 w-3 relative -top-px" /> para convertirlo a designación autonómica. El nombre se borrará.</li>
                                <li><strong>Marcar como Nacional:</strong> Para un puesto autonómico, use <EyeIcon className="inline h-3 w-3 relative -top-px" />. La RFEA gestionará la asignación.</li>
                                <li><strong>Eliminar/Devolver (sin asignar):</strong> Use <XIcon className="inline h-3 w-3 relative -top-px" />. Si es nacional y sin nombre, se entiende como devolución. El Juez Árbitro no puede eliminarse.</li>
                            </ul>
                        </AlertDescription>
                    </CollapsibleContent>
                </Alert>
            </Collapsible>

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
                                                                        key={`desktop-${judge.userId || index}`} // Use judge.id if available and stable
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


// --- Helper Components for Row Rendering ---

interface NationalJudgeRowProps {
    judge: NationalJudgeFormData;
    index: number;
    values: NationalJuryFormSubmitValues;
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    openPopovers: boolean[];
    setOpenPopovers: React.Dispatch<React.SetStateAction<boolean[]>>;
    selectedOfficialUserIds: (string | null)[];
    officials: { id: string; displayName: string }[];
}

const NationalJudgeRowDesktop: React.FC<NationalJudgeRowProps> = ({
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
                    readOnly={judge.isReferee || (!judge.canEdit && !judge.isNational)} // RFEA can edit role if national? Assuming not for now.
                    disabled={judge.erase || (!judge.canEdit && !judge.isNational)}
                    value={judge.isReferee ? 'Juez Árbitro' : judge.role}
                    className={cn(
                        "w-full bg-background border-input text-foreground",
                        judge.isReferee && "font-semibold",
                        judge.erase && "line-through text-destructive placeholder:text-destructive/70",
                        (!judge.canEdit && !judge.isNational) && "cursor-not-allowed opacity-70" // If national and not RFEA editable
                    )}
                />
                {errors.judges && (errors.judges as any)[index] && (errors.judges as any)[index].role && touched.judges && touched.judges[index]?.role && (
                    <div className="text-red-600 dark:text-red-500 text-xs mt-1.5">
                        {(errors.judges as any)[index].role}
                    </div>
                )}
            </TableCell>
            <TableCell className="px-4 py-3 align-top">
                <NationalJudgeNamePopover
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
                <NationalJudgeActions judge={judge} index={index} values={values} setFieldValue={setFieldValue} />
            </TableCell>
        </TableRow>
    );
};

const NationalJudgeRowMobile: React.FC<NationalJudgeRowProps> = ({
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
                    readOnly={judge.isReferee || (!judge.canEdit && !judge.isNational)}
                    disabled={judge.erase || (!judge.canEdit && !judge.isNational)}
                    value={judge.isReferee ? 'Juez Árbitro' : judge.role}
                    className={cn(
                        "w-full bg-background border-input text-foreground",
                        judge.isReferee && "font-semibold",
                        judge.erase && "line-through text-destructive placeholder:text-destructive/70",
                        (!judge.canEdit && !judge.isNational) && "cursor-not-allowed opacity-70"
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
                    <UserIcon className="h-3.5 w-3.5 mr-1.5" /> Nombre (Juez Nacional)
                </label>
                <NationalJudgeNamePopover
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
                <div className="flex justify-end space-x-2">
                    <NationalJudgeActions judge={judge} index={index} values={values} setFieldValue={setFieldValue} isMobile />
                </div>
            </div>
        </div>
    );
};

// --- Reusable Sub-Components for Name Popover and Actions ---
interface NationalJudgeNamePopoverProps extends Omit<NationalJudgeRowProps, 'values' | 'errors' | 'touched'> {
    isMobile?: boolean;
}

const NationalJudgeNamePopover: React.FC<NationalJudgeNamePopoverProps> = ({
    judge, index, setFieldValue, openPopovers, setOpenPopovers, selectedOfficialUserIds, officials, isMobile
}) => {
    const handleSelectOfficial = (official: { id: string; displayName: string }) => {
        setFieldValue(`judges.${index}.name`, official.displayName);
        setFieldValue(`judges.${index}.userId`, official.id);
        const newOpenPopovers = [...openPopovers];
        newOpenPopovers[index] = false;
        setOpenPopovers(newOpenPopovers);
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
                    disabled={judge.erase || !judge.isNational}
                    role="combobox"
                    aria-expanded={openPopovers[index]}
                    className={cn(
                        "w-full justify-between font-normal text-foreground border-input",
                        !judge.name && judge.isNational && "text-muted-foreground",
                        !judge.isNational && "text-muted-foreground italic",
                        judge.erase && "line-through text-destructive placeholder:text-destructive/70",
                        !judge.isNational && "cursor-not-allowed opacity-70"
                    )}
                >
                    <span className="truncate">
                        {judge.name || (judge.isNational ? "Seleccionar Juez Nacional..." : "Juez Autonómico (gestionado por FAA)")}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            {judge.isNational && !judge.erase && judge.canEdit && (
                <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                    onOpenAutoFocus={(e) => {
                        e.preventDefault();
                    }}
                >
                    <Command>
                        <CommandInput placeholder="Buscar oficial RFEA..." />
                        <CommandList>
                            <CommandEmpty>No se encontraron oficiales.</CommandEmpty>
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

interface NationalJudgeActionsProps extends Omit<NationalJudgeRowProps, 'errors' | 'touched' | 'openPopovers' | 'setOpenPopovers' | 'selectedOfficialUserIds' | 'officials'> {
    isMobile?: boolean;
}

const NationalJudgeActions: React.FC<NationalJudgeActionsProps> = ({ judge, index, values, setFieldValue, isMobile }) => {
    const canToggleNational = judge.canEdit || judge.isNational;

    return (
        <div className="flex items-center justify-end space-x-2">
            {!judge.erase && canToggleNational && (
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title={judge.isNational ? "Convertir a designación autonómica" : "Marcar como designación nacional"}
                    onClick={() => {
                        const newIsNational = !values.judges[index].isNational;
                        setFieldValue(`judges.${index}.isNational`, newIsNational);

                        if (newIsNational && judge.originalData?.userId && judge.originalData.officialName === values.judges[index].name) {
                        } else if (newIsNational) { // Becoming National (potentially from Autonomic if RFEA has that power)
                            if (!judge.originalData?.isNational) { // If it was truly autonomic before this click
                                setFieldValue(`judges.${index}.userId`, null);
                                setFieldValue(`judges.${index}.name`, '');
                            }
                        } else if (!newIsNational) { // Becoming Autonomic (RFEA devolviendo)
                            setFieldValue(`judges.${index}.userId`, null);
                            setFieldValue(`judges.${index}.name`, ''); // Clear RFEA assignment
                        }
                    }}
                    className={cn(
                        "border-input hover:bg-accent",
                        judge.isNational
                            ? "text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300" // Is National: icon means "make autonomic"
                            : "text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300", // Is Autonomic: icon means "make national"
                        isMobile && "h-9 w-9"
                    )}
                >
                    {values.judges[index].isNational ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
            )}

            {!judge.isReferee && (judge.canEdit || judge.isNational) && (
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title={judge.erase ? "Restaurar designación" : "Marcar para eliminar/devolver"}
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