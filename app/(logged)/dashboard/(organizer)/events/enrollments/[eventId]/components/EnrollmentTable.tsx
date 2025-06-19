// app\(logged)\dashboard\(organizer)\events\enrollments\[eventId]\components\EnrollmentTable.tsx
'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { H3, P } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { FileSearch, Hash, User, Fingerprint, CalendarDays, Route } from 'lucide-react';

interface Enrollment {
  id?: string;
  dorsal: number;
  name: string;
  dni: string;
  birthdate: string;
  distance: number;
}

interface EnrollmentTableProps {
  enrollments: Enrollment[];
}


const IconTableHead: React.FC<{ icon?: React.ReactNode; className?: string; children: React.ReactNode; screenReaderText?: string }> = ({ icon, className, children, screenReaderText }) => (
  <TableHead className={`px-3 py-2.5 text-xs uppercase font-semibold text-muted-foreground tracking-wider group ${className}`}>
    <div className="flex items-center">
      {icon && <span className="mr-1.5 opacity-80 group-hover:text-primary transition-colors">{icon}</span>}
      {children}
      {screenReaderText && <span className="sr-only">{screenReaderText}</span>}
    </div>
  </TableHead>
);


const EnrollmentCardRow: React.FC<{ athlete: Enrollment }> = ({ athlete }) => (
  <div className="block sm:hidden border-b border-border dark:border-neutral-700 p-4 space-y-2 bg-card hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors">
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Hash size={16} className="mr-2 text-primary" />
        <span className="font-semibold text-lg text-primary">{athlete.dorsal}</span>
      </div>
      <Badge variant="outline" className="text-xs">{athlete.distance} km</Badge>
    </div>
    <div className="text-sm">
      <p className="font-medium text-foreground">{athlete.name}</p>
      <p className="text-muted-foreground">
        <span className="font-medium">DNI:</span> {athlete.dni}
      </p>
      <p className="text-muted-foreground">
        <span className="font-medium">Nacimiento:</span> {athlete.birthdate}
      </p>
    </div>
  </div>
);


export const EnrollmentTable: React.FC<EnrollmentTableProps> = ({ enrollments }) => {
  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 text-muted-foreground min-h-[300px] border-2 border-dashed rounded-lg dark:border-neutral-700 bg-card dark:bg-neutral-900/30">
        <FileSearch size={48} className="mb-4 text-primary/70" />
        <H3 className="text-lg font-medium text-foreground">No se encontraron inscripciones</H3>
        <P className="mt-1 text-sm">Prueba a modificar los filtros o verifica que haya inscritos.</P>
      </div>
    );
  }

  const headers = [
    { key: 'dorsal', label: 'Dorsal', icon: <Hash size={14}/>, className: "w-[80px] sm:w-[100px] min-w-[70px] sm:min-w-[80px]" },
    { key: 'name', label: 'Nombre', icon: <User size={14}/>, className: "w-[150px] sm:w-[200px] max-w-[150px] sm:max-w-[200px]" },
    { key: 'dni', label: 'DNI', icon: <Fingerprint size={14}/>, className: "w-[120px] min-w-[110px]" }, 
    { key: 'birthdate', label: 'Nacimiento', icon: <CalendarDays size={14}/>, className: "w-[140px] min-w-[130px]" },
    { key: 'distance', label: 'Distancia', icon: <Route size={14}/>, className: "text-center w-[100px] sm:w-[120px] min-w-[90px] sm:min-w-[100px]" },
  ];

  return (
    <div className="border rounded-lg overflow-hidden dark:border-neutral-800 shadow-md bg-card">
      <div className="sm:hidden"> 
        {enrollments.map((athlete) => (
          <EnrollmentCardRow key={athlete.dni || athlete.dorsal.toString()} athlete={athlete} />
        ))}
      </div>

      <div className="hidden sm:block"> 
        <ScrollArea
          className="h-[calc(100vh-var(--header-height,280px)-10rem)] md:h-[calc(100vh-var(--header-height,300px)-10rem)]"
        >
          <Table className="min-w-[700px]">
            <TableHeader className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 shadow-sm dark:shadow-none dark:bg-neutral-900/95">
              <TableRow>
                {headers.map(header => (
                  <IconTableHead key={header.key} icon={header.icon} className={header.className}>
                    {header.label}
                  </IconTableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((athlete) => (
                <TableRow
                  key={athlete.dni || athlete.dorsal.toString()}
                  className="hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="px-2 py-3 whitespace-nowrap"> 
                    <Badge variant="default" className="ml-2 text-left font-mono text-xs sm:text-sm h-7 sm:h-auto">
                      {athlete.dorsal}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-[150px] sm:w-[200px] max-w-[150px] sm:max-w-[200px] truncate px-2 py-3 font-medium text-foreground whitespace-nowrap">
                    {athlete.name}
                  </TableCell>
                  <TableCell className="px-2 py-3 text-muted-foreground whitespace-nowrap">
                    {athlete.dni}
                  </TableCell>
                  <TableCell className="px-2 py-3 text-muted-foreground whitespace-nowrap">
                    {athlete.birthdate}
                  </TableCell>
                  <TableCell className="text-center px-2 py-3 text-muted-foreground whitespace-nowrap">
                    <Badge variant="outline" className="text-xs sm:text-sm">{athlete.distance} km</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};