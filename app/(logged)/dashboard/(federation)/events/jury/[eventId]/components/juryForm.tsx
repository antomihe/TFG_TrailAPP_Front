'use client';

import React, { useEffect, useState } from "react";
import { Formik, Field, FieldArray, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XIcon, EyeIcon, EyeOffIcon, InfoIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserState } from "@/store/user/user.store";
import api from "@/config/api";
import { InlineCode, Skeleton } from "@/components/ui";
import { useParams } from "next/navigation";
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
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const validationSchema = Yup.object().shape({
    judges: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().when(['isNational', 'erase'], (values, schema) => {
                if (values[0] || values[1]) {
                    return schema.notRequired();
                } else {
                    return schema.required("El juez es obligatorio");
                }
            }),
            role: Yup.string().required("Rol es obligatorio"),
            isNational: Yup.boolean(),
            isReferee: Yup.boolean(),
        })
    ),
});

type Judge = {
    role: string;
    name: string;
    isNational: boolean;
    isReferee: boolean;
    userId: string;
    canEdit: boolean;
    erase: boolean;
};

export default function JuryForm() {
    const user = useUserState().user;
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [officials, setOfficials] = useState<any[]>([]);
    const [jury, setJury] = useState<Judge[]>([]);
    const [error, setError] = useState<string>('');
    const [sending, setSending] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>('');
    const [sendingError, setSendingError] = useState<string>('');
    const [openPopovers, setOpenPopovers] = useState<boolean[]>([]);
    const [alertDescription, setAlertDescription] = useState<string>('');

    useEffect(() => {
        const fetchOfficialsAndJury = async () => {
            setLoading(true);
            try {
                const resFed = await api(user.access_token).get(`users/federation/id/${user.id}`);
                const federationCode = resFed.data.code;
                const resOfficials = await api(user.access_token).get(`users/official/validated/${federationCode}`);
                setOfficials(resOfficials.data);

                const resJury = await api(user.access_token).get(`/events/${params.eventId}/jury`);
                const juryData = resJury.data;

                const orderedJury = [...juryData].sort((a, b) => b.isReferee - a.isReferee);

                let initialJury: Judge[] = [];

                if (orderedJury.length === 0) {
                    initialJury = [
                        { role: 'Juez Árbitro', name: '', isNational: false, isReferee: true, userId: '', canEdit: true, erase: false },
                    ];
                    setAlertDescription('Para pasar una designación a la RFEA, selecciona el icono con un ojo.');
                } else {
                    const juryPromises = orderedJury.map(async (judge: Judge) => {
                        let name = '';
                        if (judge.userId) name = await api(user.access_token).get(`users/official/id/${judge.userId}`).then(res => res.data.displayName);

                        return {
                            role: judge.role,
                            name: name,
                            userId: judge.userId,
                            isNational: judge.isNational,
                            isReferee: judge.isReferee,
                            canEdit: !judge.isNational,
                            erase: false,
                        };
                    });
                    initialJury = await Promise.all(juryPromises);
                    setAlertDescription('Designaciones nacionales ya enviadas a la RFEA. No es posible modificar o eliminar designaciones nacionales.');
                }

                setJury(initialJury);

            } catch (error) {
                setError('Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchOfficialsAndJury();
    }, []);

    if (loading) return <Skeleton className="w-full h-20" />;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="flex flex-col items-center max-w-4xl mx-auto">
            <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Designaciones nacionales</AlertTitle>
                <AlertDescription className="mt-3">
                    {alertDescription}
                </AlertDescription>
            </Alert>

            <Formik
                enableReinitialize
                initialValues={{ judges: jury }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    try {
                        setSending(true);
                        setSuccess('');
                        setSendingError('');

                        const req = {
                            juries: values.judges
                                .filter(judge => !judge.erase)
                                .filter(judge => judge.canEdit)
                                .map(judge => (
                                    judge.userId ? {
                                        role: judge.role,
                                        userId: judge.userId,
                                        isNational: judge.isNational,
                                        isReferee: judge.isReferee,
                                    } : {
                                        role: judge.role,
                                        isNational: judge.isNational,
                                        isReferee: judge.isReferee,
                                    }
                                ))
                        };

                        const eventId = params.eventId;
                        await api(user.access_token).post(`events/${eventId}/jury`, req);

                        const remainingJudges = values.judges.filter(judge => !judge.erase);
                        setJury(remainingJudges);

                        remainingJudges.forEach(judge => judge.isNational ? judge.canEdit = false : judge.canEdit = true);

                        setSuccess('Guardado correctamente');
                    } catch (error) {
                        const errorMessage = (error as any)?.response?.data?.message;
                        if (errorMessage) setSendingError(errorMessage);
                        else setSendingError('Error desconocido');
                    } finally {
                        setSending(false);
                    }
                }}
            >

                {({ values, errors, touched, handleSubmit, setFieldValue }) => {
                    const selectedNames = values.judges.map(judge => judge.name);
                    return (
                        <div className="w-full px-4 mt-4">
                            <div className="mx-auto overflow-x-auto">
                                <Form onSubmit={handleSubmit}>
                                    <FieldArray name="judges">
                                        {({ remove, push }) => (
                                            <div>
                                                <Table className="min-w-full">
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead className="w-1/4">Rol</TableHead>
                                                            <TableHead className="w-1/2">Nombre</TableHead>
                                                            <TableHead className="w-6"></TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {values.judges.map((judge, index) => (
                                                            <TableRow key={index} className="transition-colors">
                                                                <TableCell className="w-1/4">
                                                                    <Field
                                                                        as={Input}
                                                                        name={`judges.${index}.role`}
                                                                        readOnly={judge.isReferee}
                                                                        disabled={(!judge.canEdit && judge.isNational) || judge.erase}
                                                                        value={judge.isReferee ? 'Juez Árbitro' : judge.role}
                                                                        className={
                                                                            cn(
                                                                                "w-full bg-input",
                                                                                judge.isReferee && "underline",
                                                                                judge.erase && "text-destructive line-through"
                                                                            )
                                                                        }
                                                                    />
                                                                    {errors.judges && errors.judges[index] && touched.judges && touched.judges[index]?.role && typeof errors.judges[index] === 'object' && (
                                                                        <div className="text-red-500 text-sm mt-1">
                                                                            {errors.judges[index].role}
                                                                        </div>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="w-1/2">
                                                                    <Popover open={openPopovers[index]} onOpenChange={(isOpen) => {
                                                                        const newOpenPopovers = [...openPopovers];
                                                                        newOpenPopovers[index] = isOpen;
                                                                        setOpenPopovers(newOpenPopovers);
                                                                    }}>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                disabled={judge.isNational || judge.erase}
                                                                                role="combobox"
                                                                                aria-expanded={openPopovers[index]}
                                                                                className={
                                                                                    cn(
                                                                                        "w-full justify-between bg-input",
                                                                                        judge.erase && "text-destructive line-through"
                                                                                    )
                                                                                }
                                                                            >
                                                                                {judge.name || "Selecciona un juez"}
                                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-full p-0">
                                                                            <Command>
                                                                                <CommandInput placeholder="Buscar juez..." />
                                                                                <CommandList>
                                                                                    <CommandEmpty>No hay jueces disponibles.</CommandEmpty>
                                                                                    <CommandGroup>
                                                                                        {officials
                                                                                            .filter(official => !selectedNames.includes(official.displayName) || official.displayName === judge.name)
                                                                                            .map(official => (
                                                                                                <CommandItem
                                                                                                    key={official.id}
                                                                                                    onSelect={() => {
                                                                                                        setFieldValue(`judges.${index}.name`, official.displayName);
                                                                                                        setFieldValue(`judges.${index}.userId`, official.id);
                                                                                                        setOpenPopovers((prevPopovers) => {
                                                                                                            const updatedPopovers = [...prevPopovers];
                                                                                                            updatedPopovers[index] = false;
                                                                                                            return updatedPopovers;
                                                                                                        });
                                                                                                    }}
                                                                                                >
                                                                                                    {official.displayName}
                                                                                                </CommandItem>
                                                                                            ))}
                                                                                    </CommandGroup>
                                                                                </CommandList>
                                                                            </Command>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                    {errors.judges && errors.judges[index] && touched.judges && touched.judges[index]?.name && typeof errors.judges[index] === 'object' && (
                                                                        <div className="text-red-500 text-sm mt-1 ml-1">
                                                                            {errors.judges[index].name}
                                                                        </div>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="w-6 text-right">
                                                                    {(judge.canEdit || !judge.isNational) && !judge.erase && (
                                                                        <Button
                                                                            type="button"
                                                                            variant={judge.isNational ? "secondary" : "ghost"}
                                                                            className="ml-2"
                                                                            onClick={() => {
                                                                                const newJury = !values.judges[index].isNational;
                                                                                setFieldValue(`judges.${index}.isNational`, newJury);
                                                                                setFieldValue(`judges.${index}.userId`, '');
                                                                                setFieldValue(`judges.${index}.name`, '');
                                                                            }}
                                                                        >
                                                                            {values.judges[index].isNational ? (
                                                                                <EyeOffIcon className="h-4 w-4" />
                                                                            ) : (
                                                                                <EyeIcon className="h-4 w-4" />
                                                                            )}
                                                                        </Button>
                                                                    )}

                                                                    {!judge.isReferee && (judge.canEdit || !judge.isNational) &&
                                                                        (
                                                                            <Button
                                                                                type="button"
                                                                                variant={judge.erase ? "destructive" : "outline"}
                                                                                onClick={() => {
                                                                                    const newJury = !values.judges[index].erase;
                                                                                    setFieldValue(`judges.${index}.erase`, newJury);
                                                                                }}
                                                                            >
                                                                                <XIcon className="h-4 w-4" />
                                                                            </Button>
                                                                        )
                                                                    }
                                                                </TableCell>

                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                                <div className="">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="w-full"
                                                        onClick={() => push({ role: 'Juez Auxiliar', name: '', isNational: false, isReferee: false, userId: '', canEdit: true, erase: false })}
                                                    >
                                                        Añadir juez auxiliar
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </FieldArray>
                                    <div className="mt-6 flex justify-center">
                                        <Button type="submit" disabled={sending || loading} >
                                            {sending ? 'Guardando...' : 'Guardar'}
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    );
                }}
            </Formik >
            {success && (
                <div className="text-green-500 mt-4">
                    {success}
                </div>
            )}
            {sendingError && (
                <div className="text-red-500 mt-4">
                    {sendingError}
                </div>
            )
            }
        </div >
    );
}
