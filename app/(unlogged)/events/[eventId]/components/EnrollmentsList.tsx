'use client'

import React from 'react';
import { Input, Large } from '@/components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Enrollment } from './connection';

type Props = {
    enrollments: Enrollment[];
}

export default function EnrollmentList({enrollments}: Props) {
    
    if (enrollments.length === 0) {
        return <Large className="text-center pt-5 h-[500px]">No hay inscripciones para este evento</Large>;
    }

    return (
            <div className="mx-auto overflow-x-auto">
                <ScrollArea className="h-[500px] overflow-y-auto">
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Dorsal</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {enrollments.map((athlete) => (
                                <TableRow key={athlete.dorsal}>
                                    <TableCell>{athlete.dorsal}</TableCell>
                                    <TableCell>{athlete.athleteName}</TableCell>
                                    <TableCell>{athlete.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
    );
}
