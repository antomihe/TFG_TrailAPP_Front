'use client'

import React, { useEffect } from 'react';
import { Label, Input } from '@/components/ui'
import { Button } from '@/components/ui';
import api from '@/config/api';

import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Check, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils";

const schema = Yup.object().shape({
    email: Yup.string().email('El email no es válido').required('El email es obligatorio'),
    fullName: Yup.string().required('El nombre completo es obligatorio'),
    license: Yup.string()
        .required('El número de identificación es obligatorio')
        .max(4, 'El número de identificación no puede tener más de 4 caracteres')
        .matches(/^[A-Za-z]{1}[0-9]{0,3}$|^[A-Za-z]{2}[0-9]{0,2}$/, 'El número de identificación no es válido'),
    federationCode: Yup.string().required('El código de federación es obligatorio').matches(/^[A-Za-z]{3}$/, 'El código de federación no es válido'),
});

export default function OfficialForm() {
    const [loading, setLoading] = React.useState(false);
    const [federations, setFederations] = React.useState<{ code: string, displayName: string }[]>([]);
    const [federationsError, setFederationsError] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string>('');
    const [submited, setSubmited] = React.useState<string>('');
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        const fetchFederations = async () => {
            setLoading(true);
            try {
                const loadFederations = await api().get('users/federation');
                setFederations(loadFederations.data);
            } catch (error) {
                setFederationsError('Error al cargar las federaciones');
            } finally {
                setLoading(false);
            }
        };
        fetchFederations();
    }, []);

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    fullName: '',
                    license: '',
                    federationCode: ''
                }}
                validationSchema={schema}
                onSubmit={async (values) => {
                    setError('');
                    setSubmited('');
                    setLoading(true);
                    try {
                        const res = await api().post('/users/official', values);
                        setSubmited('¡Éxito! Compruebe su correo electrónico para confirmar su cuenta');
                    } catch (error) {
                        const errorMessage = (error as any)?.response?.data?.message;
                        setError(errorMessage || 'Error desconocido');
                    } finally {
                        setLoading(false);
                    }
                }}
            >
                {(formik) => (
                    <Form>
                        <div className='space-y-2'>
                            <div className="space-y-1">
                                <Label htmlFor="fullName">Nombre completo</Label>
                                <Input
                                    id="fullName"
                                    placeholder="Ana Jiménez"
                                    {...formik.getFieldProps("fullName")}
                                />
                                {formik.touched.fullName && formik.errors.fullName && (
                                    <p className="text-red-500 text-sm">{formik.errors.fullName}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    placeholder="ana@gmail.com"
                                    {...formik.getFieldProps("email")}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-red-500 text-sm">{formik.errors.email}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="license">Nº de licencia</Label>
                                <Input
                                    id="license"
                                    placeholder="AV8"
                                    {...formik.getFieldProps("license")}
                                />
                                {formik.touched.license && formik.errors.license && (
                                    <p className="text-red-500 text-sm">{formik.errors.license}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="federationCode">Federación autonómica</Label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn("w-full justify-between", !formik.values.federationCode ? "text-muted-foreground" : "")}
                                            role="combobox"
                                            aria-expanded={open}
                                        >
                                            {formik.values.federationCode
                                                ? federations.find(fed => fed.code === formik.values.federationCode)?.displayName
                                                : "Selecciona una federación"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Buscar federación..." />
                                            <CommandList>
                                                <CommandEmpty>Sin coincidencias</CommandEmpty>
                                                <CommandGroup>
                                                    {federations.map(federation => (
                                                        <CommandItem
                                                            key={federation.code}
                                                            onSelect={() => {
                                                                formik.setFieldValue("federationCode", federation.code);
                                                                setOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    formik.values.federationCode === federation.code
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {federation.displayName}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                {formik.touched.federationCode && formik.errors.federationCode && (
                                    <p className="text-red-500 text-sm">{formik.errors.federationCode}</p>
                                )}
                                {federationsError && (
                                    <p className="text-red-500 text-sm">{federationsError}</p>
                                )}
                            </div>
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm mt-4">{error}</p>
                        )}
                        <Button type="submit" className="w-full mt-6" disabled={loading}>
                            {loading ? 'Cargando...' : 'Registrarse'}
                        </Button>
                        {submited && (
                            <p className="text-green-600 text-sm mt-2">{submited}</p>
                        )}
                    </Form>
                )}
            </Formik>
        </>
    )
}
