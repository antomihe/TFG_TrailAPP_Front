'use client';

import React, { useEffect } from 'react';
import { Button, Input, Label, Skeleton } from '@/components/ui/';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import api from '@/config/api';
import { useUserState } from '@/store/user/user.store';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils";
import { AlertTriangle, Ban, Check, ChevronsUpDown, InfoIcon, TriangleRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


const schema = Yup.object().shape({
    reason: Yup.string().required('Este campo es requerido').max(50, 'Máximo 50 caracteres'),
    description: Yup.string().required('Este campo es requerido'),
    athlete: Yup.string().required('Este campo es requerido'),
});

const SkeletonLoader = () => (
    <div className="max-w-xl mx-auto p-4">
        <Skeleton height="h-8" width="w-full" className="my-4" />
        <Skeleton height="h-8" width="w-full" className="my-4" />
        <Skeleton height="h-8" width="w-full" className="my-4" />
        <Skeleton height="h-8" width="w-full" className="my-4" />
    </div>
);

export default function NewDisqualificationReportForm() {
    const [loading, setLoading] = React.useState(false);
    const [sending, setSending] = React.useState(false);
    const [error, setError] = React.useState<string>('');
    const [submited, setSubmited] = React.useState<string>('');
    const [open, setOpen] = React.useState(false);
    const [athletes, setAthletes] = React.useState<{ id: string; displayName: string, dorsal: number, isDisqualified: boolean }[]>([]);
    const [event, setEvent] = React.useState<{ id: string; name: string }>({ id: '', name: '' });
    const [errorLoading, setErrorLoading] = React.useState<string>('');
    const { user: userState } = useUserState();

    useEffect(() => {
        const fetchFederations = async () => {
            setLoading(true);
            try {
                const loadEvent = await api(userState.access_token).get('events/jury/today');
                setEvent({ id: loadEvent.data?.id, name: loadEvent.data?.name });
                const eventId = loadEvent.data?.id;
                const loadAthletes = await api(userState.access_token).get(`events/enroll/event/${eventId}`);
                setAthletes(loadAthletes.data);
            } catch (error) {
                const errorMessage = (error as any)?.response?.data?.message;
                setErrorLoading(errorMessage || 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };
        fetchFederations();
    }, []);

    if (loading) {
        return <SkeletonLoader />;
    }

    if (errorLoading) {
        return (
            <div className="flex items-center justify-center max-w-xl mx-auto p-4">
                <Alert className="flex items-center space-x-2 p-5">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <AlertDescription>
                        {errorLoading}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }
    

    return (
        <div className="max-w-xl mx-auto p-4">
            <Formik
                enableReinitialize
                initialValues={{
                    reason: '',
                    description: '',
                    athlete: '',
                }}
                validationSchema={schema}
                onSubmit={async (values, { resetForm }) => {
                    setError('');
                    setSubmited('');
                    try {
                        setSending(true);
                        const request = {
                            athleteId: athletes.find(athlete => athlete.displayName === values.athlete)?.id,
                            eventId: event.id,
                            reason: values.reason,
                            description: values.description,
                        };
                        const res = await api(userState.access_token).post(`/events/disqualification`, request);
                        setSubmited('¡Éxito! Parte de descalificación enviado');
                        resetForm();
                    } catch (error) {
                        const errorMessage = (error as any)?.response?.data?.message;
                        if (errorMessage) setError(errorMessage);
                        else setError('Error desconocido');
                    } finally {
                        setSending(false);
                    }
                }}
            >
                {(formik) => (
                    <>
                        <div className="flex flex-col items-center max-w-4xl mx-auto mb-5">

                            <Alert>
                                <InfoIcon className="h-4 w-4" />
                                <AlertTitle>Detección automática del evento</AlertTitle>
                                <AlertDescription className="mt-3">
                                    El sistema detecta automáticamente el evento. A continuación, selecciona el atleta y escribe la razón de la descalificación.
                                </AlertDescription>
                            </Alert>
                        </div>

                        <Form>
                            <div className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="event">Evento</Label>
                                    <Input
                                        id="event"
                                        placeholder="Cargando..."
                                        disabled={true}
                                        value={event.name}
                                    />
                                </div>
                                <div className="space-y-1">

                                    <Label htmlFor="athlete">Atleta</Label>

                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn("w-full justify-between", !formik.values.athlete ? "text-muted-foreground" : "")}
                                                role="combobox"
                                                aria-expanded={open}
                                            >
                                                {formik.values.athlete
                                                    ? athletes.find(athlete => athlete.displayName === formik.values.athlete)?.displayName
                                                    : "Selecciona un atleta"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar atleta..." />
                                                <CommandList>
                                                    <CommandEmpty>Sin coincidencias</CommandEmpty>
                                                    <CommandGroup>
                                                        {athletes.map(athlete => (
                                                            <CommandItem
                                                                key={athlete.id}
                                                                onSelect={() => {
                                                                    formik.setFieldValue("athlete", athlete.displayName);
                                                                    setOpen(false);
                                                                }}
                                                                disabled={athlete.isDisqualified}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        formik.values.athlete === athlete.displayName
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                ({athlete.dorsal}) - {athlete.displayName}
                                                                {athlete.isDisqualified && <Ban className="h-4 w-4 ml-1 text-red-600" />}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {formik.touched.athlete && formik.errors.athlete && (
                                        <p className="text-red-500 text-sm">{formik.errors.athlete}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="reason">Razón</Label>
                                    <Input
                                        id="reason"
                                        placeholder="Razón de la descalificación"
                                        value={formik.values.reason}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />

                                    {formik.touched.reason && formik.errors.reason && (
                                        <p className="text-red-500 text-sm">{formik.errors.reason}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="description">Descripción</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Descripción de la descalificación"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        rows={4}
                                    />

                                    {formik.touched.description && formik.errors.description && (
                                        <p className="text-red-500 text-sm">{formik.errors.description}</p>
                                    )}
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                            <Button type="submit" className="w-full mt-6" disabled={sending}>
                                {sending ? 'Cargando...' : 'Enviar parte de descalificación'}
                            </Button>
                            {submited && <p className="text-green-600 text-sm mt-2">{submited}</p>}
                        </Form>
                    </>
                )
                }
            </Formik >
        </div >
    );
}
