'use client';

import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import api from '@/config/api';
import { useUserState } from '@/store/user/user.store';
import { useParams } from 'next/navigation';
import { H3, Label, Skeleton } from '@/components/ui';
import { AlertComponent } from '@/components/ui/alert-component';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Ban, Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Athlete } from '../../../../new/disqualification/components/NewDisqualificationReportForm';
import { toast } from 'sonner';

export default function MaterialCheck() {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorLoading, setErrorLoading] = useState<string | null>(null);
  const [sending, setSending] = useState<boolean>(false);
  const [contorlName, setControlName] = useState<string | null>(null);
  const [materials, setMaterials] = useState<MaterialDetails[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [athleteMaterial, setAthleteMaterial] = useState<string[]>([]);
  const { user } = useUserState();
  const { checkPointId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await api(user.access_token).get(`events/checkPoints/${checkPointId}`);
        const materialIds = response.data.material;

        const materialsPromises = materialIds.map((materialId: string) =>
          api(user.access_token)
            .get(`events/equipment/${materialId}`)
            .then((fetchedMaterial) => ({
              name: fetchedMaterial.data.name,
              optional: fetchedMaterial.data.optional,
              id: fetchedMaterial.data.id,
            }))
        );

        const loadAthletes = await api(user.access_token).get(`events/checks/${checkPointId}/athletes/${response.data.eventId}`);
        const materials = await Promise.all(materialsPromises);

        setMaterials(materials);
        setAthletes(loadAthletes.data);
        setControlName(response.data.name);
      } catch (error) {
        const errorMessage = (error as any)?.response?.data?.message;
        setErrorLoading(errorMessage || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [checkPointId]);

  interface FormValues {
    materials: { [key: string]: boolean };
    athlete: string;
  }

  interface MaterialDetails {
    name: string;
    optional: boolean;
    id: string;
  }

  const sendData = async (values: FormValues, resetForm: () => void, sendMessage?: string) => {
    try {
      setSending(true);

      const selectedMaterials = Object.entries(values.materials)
        .filter(([, selected]) => selected)
        .map(([name]) => name);

      await api(user.access_token).post(`events/checks/${checkPointId}`, {
        athlete: values.athlete,
        material: selectedMaterials,
      });

      toast.success(sendMessage || 'Datos enviados correctamente');
      resetForm();
    } catch (error) {
      const errorMessage = (error as any)?.response?.data?.message;
      toast.error(errorMessage || 'Error desconocido');
    } finally {
      setSending(false);
    }
  };

  const toggleSelectAll = (values: { [key: string]: boolean }, setFieldValue: any) => {
    const allSelected = Object.values(values).every((value) => value === true);

    const updatedMaterials = materials.reduce((acc: { [key: string]: boolean }, item) => {
      acc[item.id] = !allSelected;
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
          acc[item.id] = false;
          return acc;
        }, {} as { [key: string]: boolean }),
        athlete: '',
      }}
      onSubmit={(values, { resetForm }) => {
        const unselectedRequiredMaterials = materials
          .filter((item) => !item.optional && !values.materials[item.id]);

        if (unselectedRequiredMaterials.length > 0) {
          setOpenDialog(true);
        } else {
          sendData(values, resetForm);
        }
      }}
    >
      {({ values, setFieldValue, touched, errors, resetForm }) => {
        useEffect(() => {
          const isAllSelected = Object.values(values.materials).every((value) => value === true);
          setAllSelected(isAllSelected);
        }, [values.materials]);

        useEffect(() => {
          const fetchEquipment = async () => {
            if (values.athlete) {
              const response = await api(user.access_token).get(`events/checks/${checkPointId}/equipment/${values.athlete}`);
              const ahtleteMaterials = await response.data.material;
              setAthleteMaterial(ahtleteMaterials);

              setFieldValue('materials', materials.reduce((acc, item) => {
                acc[item.id] = ahtleteMaterials.includes(item.id);
                return acc;
              }, {} as { [key: string]: boolean }));
            }
          };
          fetchEquipment();
        }, [values.athlete]);

        const confirmSubmit = () => {
          setOpenDialog(false);
          sendData(values, resetForm);
        };

        return (
          <>
            <H3 className="text-center">Control en {contorlName}</H3>
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
                        ? athletes.find((athlete) => athlete.id === values.athlete)?.displayName
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
                          {athletes.map((athlete) => (
                            <CommandItem
                              key={athlete.id}
                              onSelect={() => {
                                resetForm();
                                setFieldValue("athlete", athlete.id);
                                setOpen(false);
                              }}
                              disabled={athlete.isDisqualified}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  values.athlete === athlete.id ? "opacity-100" : "opacity-0"
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
                {touched.athlete && errors.athlete && <p className="text-red-500 text-sm">{errors.athlete}</p>}
              </div>

              {values.athlete && (
                <div className="space-y-6 border rounded-lg p-6">
                  <h2 className="font-semibold text-center">Control de Material</h2>
                  <div className="space-y-4">
                    {materials.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <Checkbox
                          checked={values.materials[item.id]}
                          onCheckedChange={(checked: boolean) =>
                            setFieldValue(`materials.${item.id}`, checked)
                          }
                          id={item.id}
                          className="h-5 w-5 cursor-pointer"
                        />
                        <label htmlFor={item.id} className="font-medium cursor-pointer">
                          {item.name} {item.optional && <span className="text-gray-500 cursor-pointer">(opcional)</span>}
                        </label>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant={allSelected ? 'ghost' : 'outline'} onClick={() => toggleSelectAll(values.materials, setFieldValue)} className='w-full'>
                    {allSelected ? "Desmarcar todos" : "Seleccionar todos"}
                  </Button>
                </div>
              )}
              <Button disabled={sending || !values.athlete} type="submit" className="w-full">
                {sending ? "Enviando..." : "Enviar"}
              </Button>

              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>¿Estás seguro de enviar la información?</DialogTitle>
                    <p>Algunos materiales obligatorios no han sido seleccionados</p>
                  </DialogHeader>
                  <DialogFooter>
                    <Button disabled={sending} variant="secondary" onClick={() => setOpenDialog(false)}>
                      Cancelar
                    </Button>
                    <Button disabled={sending} variant="default" onClick={confirmSubmit}>
                      Confirmar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Form>
          </>
        );
      }}
    </Formik>
  );
}
