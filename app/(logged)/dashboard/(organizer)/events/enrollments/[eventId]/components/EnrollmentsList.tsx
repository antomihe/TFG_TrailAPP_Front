'use client'

import React, { useEffect, useState } from 'react';
import { useUserState } from '@/store/user/user.store';
import { Input, Large, Skeleton } from '@/components/ui';
import api from '@/config/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckIcon, TrashIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useParams } from 'next/navigation';

interface Enrollment {
    dorsal: number;
    name: string;
    birthdate: string;
    dni: string;
    distance: number;
}

const SkeletonLoader = () => (
    <div className="p-4">
        <Skeleton height="h-20" width="w-full" className="my-4" />
    </div>
);

export default function EnrollmentList() {
    const user = useUserState().user;
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const { eventId } = useParams();

    useEffect(() => {
        const fetchEnrollment = async () => {
            setLoading(true);
            try {
                const res = await api(user.access_token).get(`events/enroll/event/${eventId}/list`);
                setEnrollments(res.data);
                setFilteredEnrollments(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollment();
    }, [user.id, eventId]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        if (value === '') {
            setFilteredEnrollments(enrollments);
        } else {
            setFilteredEnrollments(
                enrollments.filter(
                    (enrollment) =>
                        enrollment.name.toLowerCase().includes(value) ||
                        enrollment.dorsal.toString().includes(value)
                )
            );
        }
    };



    if (loading) {
        return <SkeletonLoader />;
    }

    if (enrollments.length === 0) {
        return <Large className="text-center pt-5">No hay inscripciones para este evento</Large>;
    }

    return (
        <div className="max-w-4xl px-4 mx-auto">
            <div className="flex justify-between items-center mb-4">
                <div className="w-2/5">
                    <Input
                        type="text"
                        placeholder="Filtrar por nombre o dorsal"
                        className="p-2 bg-input border rounded w-full"
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="flex gap-2">
                    <Button className="w-40"
                        onClick={async () => {
                            try {
                                const response = await api(user.access_token).get(`events/enroll/event/${eventId}/bibs`, {
                                    responseType: 'blob',
                                });

                                const blob = new Blob([response.data], { type: 'application/pdf' });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `dorsales_evento_${eventId}.pdf`;
                                document.body.appendChild(link);
                                link.click();

                                link.parentNode?.removeChild(link);
                                URL.revokeObjectURL(url);
                            } catch (error) {
                                console.error('Error al descargar el PDF', error);
                            }
                        }}
                    >
                        Descargar Dorsales
                    </Button>
                    <Button className="w-40"
                        onClick={async () => {
                            try {
                                const response = await api(user.access_token).get(`events/enroll/event/${eventId}/print`, {
                                    responseType: 'blob',
                                });

                                const blob = new Blob([response.data], { type: 'application/pdf' });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `inscripciones_evento_${eventId}.pdf`;
                                document.body.appendChild(link);
                                link.click();

                                link.parentNode?.removeChild(link);
                                URL.revokeObjectURL(url);
                            } catch (error) {
                                console.error('Error al descargar el PDF', error);
                            }
                        }}
                    >
                        Descargar PDF
                    </Button>
                </div>
            </div>



            <div className="mx-auto overflow-x-auto">
                <ScrollArea className="h-[500px] overflow-y-auto">
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Dorsal</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>DNI</TableHead>
                                <TableHead>Fecha nacimiento</TableHead>
                                <TableHead>Distancia</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEnrollments.map((athlete) => (
                                <TableRow key={athlete.dorsal}>
                                    <TableCell>{athlete.dorsal}</TableCell>
                                    <TableCell>{athlete.name}</TableCell>
                                    <TableCell>{athlete.dni}</TableCell>
                                    <TableCell>{athlete.birthdate}</TableCell>
                                    <TableCell>{athlete.distance} KM</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </div>
    );
}
