'use client'

import React from 'react';
import { Input, Large } from '@/components/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Enrollment } from './connection';

type Props = {
    enrollments: Enrollment[];
}

export default function EnrollmentList({ enrollments }: Props) {
    if (enrollments.length === 0) {
        return <Large className="text-center pt-5">No hay inscripciones para este evento</Large>;
    }

    return (
        <div className="mx-auto overflow-x-auto">
            <ScrollArea className="overflow-y-auto">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-24 max-w-[6rem] text-ellipsis overflow-hidden">Dorsal</TableHead>
                            <TableHead className="w-56 max-w-[12rem] text-ellipsis overflow-hidden">Nombre</TableHead>
                            <TableHead className="w-48 max-w-[10rem] text-ellipsis overflow-hidden">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {enrollments.map((athlete) => (
                            <TableRow key={athlete.dorsal}>
                                <TableCell className="w-24 max-w-[6rem] break-words">{athlete.dorsal}</TableCell>
                                <TableCell className="w-56 max-w-[12rem] break-words">{athlete.athleteName}</TableCell>
                                <TableCell className="w-48 max-w-[10rem] break-words">{athlete.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
}
