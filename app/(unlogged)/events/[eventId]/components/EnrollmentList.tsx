// app\(unlogged)\events\[eventId]\components\EnrollmentList.tsx
'use client';

import React from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'; 
import { H3, P } from '@/components/ui/typography'; 
import { Badge } from '@/components/ui/badge';
import { FileSearch, Hash, User, Activity} from 'lucide-react'; 
import { EnrollmentStatus } from '@/hooks/api/unlogged/events/useRaceStatus'; 

type Props = {
    enrollments: EnrollmentStatus[];
}


const IconTableHead: React.FC<{ icon?: React.ReactNode; className?: string; children: React.ReactNode }> = ({ icon, className, children }) => (
    <TableHead className={`py-2.5 px-1 sm:py-3 sm:px-2 md:px-3 whitespace-nowrap group ${className}`}>
        <div className="flex items-center text-xs uppercase font-semibold text-muted-foreground tracking-wider">
            {icon && <span className="mr-1 sm:mr-1.5 opacity-80 group-hover:text-primary transition-colors">{icon}</span>}
            {children}
        </div>
    </TableHead>
);


export default function EnrollmentList({ enrollments }: Props) {
    if (enrollments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-16 text-muted-foreground min-h-[300px] border-2 border-dashed rounded-lg dark:border-neutral-700 bg-card dark:bg-neutral-900/30">
                <FileSearch size={48} className="mb-4 text-primary/70" />
                <H3 className="text-lg font-medium text-foreground">No se encontraron inscripciones</H3>
                <P className="mt-1 text-sm">Prueba a modificar los filtros o espera a que se actualice el estado.</P>
            </div>
        );
    }

    return (
        <div className="border rounded-lg overflow-hidden dark:border-neutral-800 shadow-md bg-card">
            <ScrollArea className="h-[calc(100vh-var(--header-height,280px)-12rem)] md:h-[calc(100vh-var(--header-height,300px)-14rem)] w-full">
                <Table className="min-w-[320px] sm:min-w-full"> {/* Adjusted min-w for mobile */}
                    <TableHeader className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 shadow-sm dark:shadow-none dark:bg-neutral-900/95">
                        <TableRow>
                            <IconTableHead icon={<Hash size={14} />} className="w-[70px] sm:w-[80px] text-center sm:text-left">Dorsal</IconTableHead>
                            <IconTableHead icon={<User size={14} />} className="w-auto">Nombre</IconTableHead>
                            <IconTableHead icon={<Activity size={14} />} className="w-[100px] sm:w-[120px] text-center">Estado</IconTableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {enrollments.map((athlete) => (
                            <TableRow key={athlete.dorsal} className="hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors">
                                <TableCell className="py-2.5 px-1 sm:px-2 text-center">
                                    <Badge variant="default" className="font-mono text-xs sm:text-sm px-2 py-0.5">
                                        {athlete.dorsal}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-2.5 px-1 sm:px-2 font-medium text-foreground truncate text-xs sm:text-sm min-w-[150px]">
                                    {athlete.athleteName}
                                </TableCell>
                                <TableCell className="py-2.5 px-1 sm:px-2 text-center">
                                    {athlete.status}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}