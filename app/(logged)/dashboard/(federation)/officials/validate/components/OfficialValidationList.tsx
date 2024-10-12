'use client'

import React, { useEffect, useState } from 'react';
import { useUserState } from '@/store/user/user.store';
import { Skeleton } from '@/components/ui';
import api from '@/config/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckIcon, TrashIcon } from 'lucide-react';

interface Official {
    id: string;
    email: string;
    displayName: string;
    federationCode: string;
    license: string;
    validatedByFederation: boolean;
    validatedAt: string | null;
}

const SkeletonLoader = () => (
    <div className="p-4">
        <Skeleton height="h-20" width="w-full" className="my-4" />
    </div>
);

export default function OfficialValidationList() {
    const user = useUserState().user;
    const [officials, setOfficials] = useState<Official[]>([]);
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOfficials = async () => {
            setLoading(true);
            try {
                const resFed = await api(user.access_token).get(`users/federation/id/${user.id}`);
                const federationCode = resFed.data.code;
                const res = await api(user.access_token).get(`users/official/unvalidated/${federationCode}`);
                setOfficials(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOfficials();
    }, [user.id]);

    const handleValidate = async (officialId: string) => {
        setSending(true);
        try {
            await api(user.access_token).patch(`users/official/${officialId}/validate`);
            setOfficials((prevOfficials) =>
                prevOfficials.map((official) =>
                    official.id === officialId
                        ? { ...official, validatedByFederation: true }
                        : official
                )
            );
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (officialId: string) => {
        setSending(true);
        try {
            await api(user.access_token).delete(`users/official/${officialId}`);
            setOfficials((prevOfficials) =>
                prevOfficials.filter((official) => official.id !== officialId)
            );
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return <SkeletonLoader />;
    }

    return (
        <div className="w-full px-4">
            <div className="max-w-4xl mx-auto overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Licencia</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {officials.map((official) => (
                            <TableRow key={official.id}>
                                <TableCell>{official.email}</TableCell>
                                <TableCell>{official.displayName}</TableCell>
                                <TableCell>{official.license}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        {!official.validatedByFederation ? (
                                            <>
                                                <Button 
                                                    onClick={() => handleValidate(official.id)} 
                                                    variant="outline" 
                                                    className="flex items-center" 
                                                    disabled={sending}
                                                >
                                                    <CheckIcon className="mr-2 h-4 w-4" /> Validar
                                                </Button>
                                                <Button 
                                                    onClick={() => handleDelete(official.id)} 
                                                    variant="destructive" 
                                                    className="flex items-center" 
                                                    disabled={sending}
                                                >
                                                    <TrashIcon className="mr-2 h-4 w-4" /> Borrar
                                                </Button>
                                            </>
                                        ) : (
                                            'Validado'
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
