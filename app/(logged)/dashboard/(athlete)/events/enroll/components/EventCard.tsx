// app\(logged)\dashboard\(athlete)\events\enroll\components\EventCard.tsx
'use client';

import { useState } from 'react';
import { Formik, Form } from 'formik';
import { TrashIcon, ChevronDown, NotebookPen, AlertCircle } from 'lucide-react';
import { Small, Button } from '@/components/ui';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { dateFormatter } from '@/lib/utils';
import { toast } from 'sonner';
import { useEnrollEvents } from '@/hooks/api/dashboard/athlete/useEnrollEvents';
import { EventWithEnrollmentDto as Event } from '@/types/api';

interface EventCardProps {
  event: Event;
  updateEvent: (updatedEvent: Event) => void;
}

export default function EventCard({ event, updateEvent }: EventCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { enrollInEvent, removeEnrollment } = useEnrollEvents();

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-card flex flex-col h-full">
      <h4 className="text-lg text-primary font-semibold mb-2">{event.name}</h4>
      <div className="text-sm text-muted-foreground space-y-1 mb-4">
        <p>Fecha: <span className="font-medium text-foreground">{dateFormatter(event.date)}</span></p>
        <p>Localidad: <span className="font-medium text-foreground">{event.location}</span></p>
        <p>Provincia: <span className="font-medium text-foreground">{event.province}</span></p>
        {event.enrolled && event.enrolledDistance && (
          <p className="text-green-600 dark:text-green-500 font-semibold">
            Inscrito en: {event.enrolledDistance} km
          </p>
        )}
      </div>

      <Formik
        initialValues={{ distance: event.enrolledDistance?.toString() || '' }}
        enableReinitialize
        onSubmit={async (values, { setFieldError, resetForm }) => {
          setIsSubmitting(true);
          try {
            if (event.enrolled) {
              await removeEnrollment(event.id);
              toast.success('Inscripción eliminada correctamente');
              updateEvent({ ...event, enrolled: false, enrolledDistance: undefined });
              resetForm({ values: { distance: '' } });
            } else {
              if (!values.distance) {
                setFieldError('distance', 'Debes seleccionar una distancia.');
                setIsSubmitting(false);
                return;
              }
              await enrollInEvent(event.id, +values.distance);
              toast.success('Inscripción realizada correctamente');
              updateEvent({ 
                ...event, 
                enrolled: true, 
                enrolledDistance: +values.distance 
              });
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido al procesar la inscripción.';
            toast.error(errorMessage);
            setFieldError('distance', errorMessage);
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        {({ setFieldValue, values, errors, touched }) => (
          <Form className="mt-auto space-y-3 pt-3 border-t border-border/40">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-full justify-between text-muted-foreground data-[disabled]:opacity-70 data-[disabled]:cursor-not-allowed"
                  disabled={event.enrolled || isSubmitting}
                >
                  {values.distance
                    ? `${event.distances.find(d => d.toString() === values.distance)} km`
                    : 'Selecciona una distancia'}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Buscar distancia..." />
                  <CommandList>
                    <CommandEmpty>No se encontraron distancias.</CommandEmpty>
                    <CommandGroup>
                      {event.distances.map((d) => (
                        <CommandItem
                          key={d}
                          value={d.toString()} 
                          onSelect={() => { 
                            setFieldValue('distance', d.toString()); 
                            setPopoverOpen(false);
                          }}
                        >
                          {d} km
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {errors.distance && touched.distance && (
              <Small className="text-red-500 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                {errors.distance}
              </Small>
            )}

            <Button
              type="submit"
              variant={event.enrolled ? 'destructive' : 'default'}
              className="w-full"
              disabled={isSubmitting || (!event.enrolled && !values.distance)}
            >
              {isSubmitting ? (
                'Procesando...'
              ) : event.enrolled ? (
                <>
                  <TrashIcon className="mr-2 h-4 w-4" /> Anular Inscripción
                </>
              ) : (
                <>
                  <NotebookPen className="mr-2 h-4 w-4" /> Inscribirse
                </>
              )}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}