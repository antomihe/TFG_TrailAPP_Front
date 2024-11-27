'use client';

import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import api from '@/config/api';
import { useUserState } from '@/store/user/user.store';
import { useParams } from 'next/navigation';
import { Label, Skeleton } from '@/components/ui';
import { AlertComponent } from '@/components/ui/alert-component';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Ban, Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Athlete } from '../../../../new/disqualification/components/NewDisqualificationReportForm';

interface MaterialDetails {
  name: string;
  isOptional: boolean;
}

export default function MaterialControl() {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorLoading, setErrorLoading] = useState<string | null>(null);
  const [sending, setSending] = useState<boolean>(false);
  const [errorSending, setErrorSending] = useState<string | null>(null);
  const [successSending, setSuccessSending] = useState<string | null>(null);
  const [materials, setMaterials] = useState<MaterialDetails[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false); // Estado para el diálogo
  const [open, setOpen] = useState(false);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const { user } = useUserState();
  const { controlId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await api(user.access_token).get(`events/control/${controlId}`);
        const materialIds = response.data.material;

        const materialsPromises = materialIds.map((materialId: string) =>
          api(user.access_token)
            .get(`events/equipment/${materialId}`)
            .then((fetchedMaterial) => ({
              name: fetchedMaterial.data.name,
              isOptional: fetchedMaterial.data.isOptional,
            }))
        );

        const loadAthletes = await api(user.access_token).get(`events/enroll/event/${response.data.eventId}`);
        const materials = await Promise.all(materialsPromises);

        setMaterials(materials);
        setAthletes(loadAthletes.data);
      } catch (error) {
        const errorMessage = (error as any)?.response?.data?.message;
        setErrorLoading(errorMessage || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [controlId]);

  useEffect(() => {
    if (successSending) {
      const timer = setTimeout(() => {
        setSuccessSending(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successSending]);

  interface FormValues {
    materials: { [key: string]: boolean };
    athlete: string;
  }

  const sendData = async (values: FormValues, resetForm: () => void, sendMessage?: string) => {
    try {
      setSending(true);
      setErrorSending(null);

      
      const selectedMaterials = Object.entries(values.materials)
        .filter(([, selected]) => selected)
        .map(([name]) => name);

      await api(user.access_token).post(`events/checks/${controlId}`, {
        athlete: values.athlete,
        material: selectedMaterials,
      });
      

      setSuccessSending(sendMessage || 'Datos enviados correctamente');
      resetForm();
    } catch (error) {
      const errorMessage = (error as any)?.response?.data?.message;
      setErrorSending(errorMessage || 'Error desconocido');
    } finally {
      setSending(false);
    }
  };


  const toggleSelectAll = (values: { [key: string]: boolean }, setFieldValue: any) => {
    const allSelected = Object.values(values).every((value) => value === true);

    const updatedMaterials = materials.reduce((acc: { [key: string]: boolean }, item) => {
      acc[item.name] = !allSelected;
      return acc;
    }, {});

    setFieldValue('materials', updatedMaterials);
  };

  const SkeletonLoader = () => (
    <div className="max-w-xl mx-auto p-4">
      <Skeleton height="h-8" width="w-full" className="my-4" />
      <Skeleton height="h-8" width="w-full" className="my-4" />
      <Skeleton height="h-8" width="w-full" className="my-4" />
    </div>
  );

  if (errorLoading) {
    return <div className="text-red-500 text-center">{errorLoading}</div>;
  }

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!materials.length) {
    return <AlertComponent message="No hay materiales disponibles" />;
  }

  if (!athletes.length) {
    return <AlertComponent message="No hay atletas inscritos" />;
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        materials: materials.reduce((acc, item) => {
          acc[item.name] = false;
          return acc;
        }, {} as { [key: string]: boolean }),
        athlete: '',
      }}
      onSubmit={(values, { resetForm }) => {
        const allSelected = Object.values(values.materials).every((value) => value === true);

        if (!allSelected) {
          setOpenDialog(true);
        } else {
          sendData(values, resetForm);
        }
      }}
    >
      {({ values, setFieldValue, touched, errors, resetForm }) => {
        const allSelected = Object.values(values.materials).every((value) => value === true);

        const confirmSubmit = () => {
          setOpenDialog(false);
          sendData(values, resetForm, 'Datos enviados correctamente (parte de descalificación enviado correctamente)');
        };

        return (
          <Form className="max-w-xl mx-auto space-y-3">
            <div className="space-y-1">
              <Label htmlFor="athlete">Atleta</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-between", !values.athlete ? "text-muted-foreground" : "")}
                    role="combobox"
                    aria-expanded={open}
                  >
                    {values.athlete
                      ? athletes.find(athlete => athlete.displayName === values.athlete)?.displayName
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
                              setFieldValue("athlete", athlete.displayName);
                              setOpen(false);
                            }}
                            disabled={athlete.isDisqualified}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                values.athlete === athlete.displayName
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
              {touched.athlete && errors.athlete && (
                <p className="text-red-500 text-sm">{errors.athlete}</p>
              )}
            </div>
            {successSending && <div className="text-green-500 text-justify">{successSending}</div>}

            {values.athlete && (
              <div className="space-y-6 border rounded-lg p-6">
                <h2 className="font-semibold text-center">Control de Material</h2>
                <div className="space-y-4">
                  {materials.map((item) => (
                    <div key={item.name} className="flex items-center space-x-4">
                      <Checkbox
                        checked={values.materials[item.name]}
                        onCheckedChange={(checked: boolean) =>
                          setFieldValue(`materials.${item.name}`, checked)
                        }
                        id={item.name}
                        className="h-5 w-5 cursor-pointer"
                      />
                      <label htmlFor={item.name} className="font-medium cursor-pointer">
                        {item.name} {item.isOptional && <span className="text-gray-500 cursor-pointer">(opcional)</span>}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Button
                    type="button"
                    onClick={() => toggleSelectAll(values.materials, setFieldValue)}
                    className="w-full px-6 py-3"
                    variant={allSelected ? 'ghost' : 'outline'}
                  >
                    {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
                  </Button>
                  <Button type="submit" className="w-full px-6 py-3" variant="default">
                    {sending ? 'Enviando...' : 'Enviar'}
                  </Button>
                  {errorSending && <div className="text-red-500 text-center">{errorSending}</div>}
                </div>
              </div>
            )}

            {/* Diálogo de confirmación */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar envío</DialogTitle>
                  <p className="text-sm text-gray-500">
                    No has seleccionado todos los materiales. ¿Deseas continuar de todas formas?
                  </p>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenDialog(false)}>
                    Cancelar
                  </Button>
                  <Button variant="default" onClick={confirmSubmit}>
                    Confirmar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Form>
        );
      }}
    </Formik>
  );
}
