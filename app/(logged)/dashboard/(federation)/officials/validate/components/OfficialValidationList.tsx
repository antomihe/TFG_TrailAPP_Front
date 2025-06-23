// app\(logged)\dashboard\(federation)\officials\validate\components\OfficialValidationList.tsx
'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button as UiButton, Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { H2, H3 } from '@/components/ui/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
    AlertTriangle, ServerCrash, ListChecks, Loader2, ClipboardList,
    CheckSquare, Mail, User, Shield, ShieldCheck, CheckCircle2, XCircle, UserCheck
} from 'lucide-react';

import {
    useOfficialValidation,
    Official,
} from '@/hooks/api/dashboard/federation/useOfficialValidation';
import { OfficialValidationRow } from './OfficialValidationRow';
import { CenteredMessage } from '@/components/ui/centered-message';



const OfficialValidationCardRow: React.FC<{
    official: Official;
    onValidate: (officialId: string) => Promise<boolean>;
    onDelete: (officialId: string) => Promise<boolean>;
    isSubmitting: boolean;
}> = ({ official, onValidate, onDelete, isSubmitting }) => {
    return (
        <div className="block sm:hidden border-b border-border dark:border-neutral-700 p-4 space-y-3 bg-card hover:bg-muted/50 dark:hover:bg-muted/10 transition-colors">
            <div className="flex justify-between items-start">
                <H3 className="text-base font-semibold text-foreground leading-tight">
                    {official.fullName}
                </H3>
                {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary flex-shrink-0" />
                ) : official.validatedByFederation ? (
                    <Badge variant="default" className="text-xs py-1 px-2.5 flex-shrink-0">
                        <ShieldCheck size={14} className="mr-1.5" /> Validado
                    </Badge>
                ) : null}
            </div>

            <div className="space-y-1.5 text-sm text-muted-foreground">
                <div className="flex items-center">
                    <Mail size={14} className="mr-2 opacity-80 flex-shrink-0" />
                    <span className="truncate">{official.email}</span>
                </div>
                <div className="flex items-center">
                    <Shield size={14} className="mr-2 opacity-80 flex-shrink-0" />
                    <span>Licencia: {official.license || 'N/A'}</span>
                </div>
            </div>

            {!official.validatedByFederation && !isSubmitting && (
                <div className="flex gap-2 pt-2">
                    <Button
                        onClick={() => onValidate(official.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-green-500 text-green-600 hover:bg-green-500/10 hover:text-green-700 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400/10 dark:hover:text-green-300"
                        disabled={isSubmitting}
                        aria-label={`Validar juez ${official.fullName}`}
                    >
                        <CheckCircle2 className="mr-1.5 h-4 w-4" /> Validar
                    </Button>
                    <Button
                        onClick={() => onDelete(official.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                        disabled={isSubmitting}
                        aria-label={`Rechazar juez ${official.fullName}`}
                    >
                        <XCircle className="mr-1.5 h-4 w-4" /> Rechazar
                    </Button>
                </div>
            )}
        </div>
    );
};

const IconTableHead: React.FC<{ icon?: React.ReactNode; className?: string; children: React.ReactNode }> = ({ icon, className, children }) => (
    <TableHead className={`py-3 px-3 sm:px-4 text-xs uppercase font-semibold text-muted-foreground tracking-wider group whitespace-nowrap ${className}`}>
        <div className="flex items-center">
            {icon && <span className="mr-1.5 opacity-80 group-hover:text-primary transition-colors">{icon}</span>}
            {children}
        </div>
    </TableHead>
);

const ListSkeletonLoader = ({ rowCount = 4 }: { rowCount?: number }) => (
    <div className="container mx-auto px-2 sm:px-4 py-8">
        <div className="text-center mb-10">
            <Skeleton className="h-8 w-2/5 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/3 mx-auto" />
        </div>
        {/* Mobile Card Skeleton */}
        <div className="sm:hidden space-y-3">
            {Array.from({ length: rowCount }).map((_, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3 bg-card dark:border-neutral-700">
                    <div className="flex justify-between items-start">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2 pt-2">
                        <Skeleton className="h-9 flex-1 rounded-md" />
                        <Skeleton className="h-9 flex-1 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
        {/* Desktop Table Skeleton */}
        <div className="hidden sm:block border rounded-lg dark:border-neutral-800 overflow-hidden">
            <Table className="min-w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead><Skeleton className="h-5 w-3/4" /></TableHead>
                        <TableHead><Skeleton className="h-5 w-full" /></TableHead>
                        <TableHead><Skeleton className="h-5 w-1/2" /></TableHead>
                        <TableHead className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: rowCount }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-2/3" /></TableCell>
                            <TableCell>
                                <div className="flex justify-end space-x-2">
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                    <Skeleton className="h-8 w-8 rounded-md" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
);

export default function OfficialValidationList() {
    const {
        officials,
        isLoading,
        submittingActionOnOfficialId,
        error,
        validateOfficial,
        deleteOfficial,
        refetchOfficials,
    } = useOfficialValidation();

    if (isLoading && (!officials || officials.length === 0)) {
        return <ListSkeletonLoader />;
    }

    if (error && (!officials || officials.length === 0)) {
        return (
            <div className="container mx-auto px-4 py-8">
                <CenteredMessage
                    icon={<ServerCrash size={48} />}
                    title="Error al Cargar Jueces"
                    variant="destructive"
                    message={<>{error} <br /> No se pudo obtener la lista de jueces para validar.</>}
                    action={
                        <UiButton onClick={refetchOfficials} variant="destructive">
                            <AlertTriangle className="mr-2 h-4 w-4" /> Reintentar
                        </UiButton>
                    }
                />
            </div>
        );
    }

    const officialsPendingValidation = officials.filter(off => !off.validatedByFederation);
    const officialsValidated = officials.filter(off => off.validatedByFederation);

    const renderOfficialList = (officialList: Official[], isPendingList: boolean) => (
        <>
            {/* Mobile Card View */}
            <div className="sm:hidden space-y-0 divide-y divide-border dark:divide-neutral-700 border-t border-b dark:border-neutral-700 rounded-lg overflow-hidden shadow-md bg-card">
                {officialList.map((official: Official) => (
                    <OfficialValidationCardRow
                        key={`${official.id}-card`}
                        official={official}
                        onValidate={validateOfficial}
                        onDelete={deleteOfficial}
                        isSubmitting={submittingActionOnOfficialId === official.id}
                    />
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block border rounded-lg overflow-hidden dark:border-neutral-800 shadow-md bg-card">
                <ScrollArea className="max-h-[60vh] sm:max-h-[calc(100vh-350px)]">
                    <Table className="min-w-full">
                        <TableHeader className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 shadow-sm dark:shadow-none dark:bg-neutral-900/95">
                            <TableRow>
                                <IconTableHead icon={<Mail size={14} />} className="w-[30%] min-w-[200px]">Email</IconTableHead>
                                <IconTableHead icon={<User size={14} />} className="w-[30%] min-w-[180px]">Nombre</IconTableHead>
                                <IconTableHead icon={<Shield size={14} />} className="w-[20%] min-w-[120px] hidden sm:table-cell">Licencia</IconTableHead> {/* Hidden on mobile for table view, card handles it */}
                                <IconTableHead className="w-[20%] min-w-[120px] text-right pr-4">
                                    {isPendingList ? "Acciones" : "Estado"}
                                </IconTableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {officialList.map((official: Official) => (
                                <OfficialValidationRow
                                    key={official.id}
                                    official={official}
                                    onValidate={validateOfficial}
                                    onDelete={deleteOfficial}
                                    isSubmitting={submittingActionOnOfficialId === official.id}
                                />
                            ))}
                        </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </>
    );

    return (
        <div className="container mx-auto px-2 sm:px-0 py-8 space-y-10">
            {error && officials && officials.length > 0 && (
                <Alert variant="destructive" className="mb-6">
                    <ServerCrash className="h-4 w-4" />
                    <AlertTitle>Error de Actualización</AlertTitle>
                    <AlertDescription>
                        No se pudieron cargar los datos más recientes ({error}). Mostrando información previa.
                        <UiButton onClick={refetchOfficials} variant="link" className="p-0 h-auto text-destructive-foreground underline ml-2">Reintentar</UiButton>
                    </AlertDescription>
                </Alert>
            )}

            <section>
                <div className="flex items-center mb-4 px-2 sm:px-0">
                    <CheckSquare size={22} className="mr-3 text-amber-500" />
                    <H3 className="text-xl font-semibold text-foreground">
                        Pendientes de Validación ({officialsPendingValidation.length})
                    </H3>
                </div>
                {officialsPendingValidation.length === 0 && !isLoading && !error ? (
                    <div className="px-2 sm:px-0">
                        <CenteredMessage
                            icon={<ListChecks size={40} />}
                            title="Todo Validado"
                            message="No hay jueces pendientes de validación en este momento."
                            variant="default"
                        />
                    </div>
                ) : (
                    renderOfficialList(officialsPendingValidation, true)
                )}
            </section>

            {officialsValidated.length > 0 && (
                <section className="mt-12">
                    <div className="flex items-center mb-4 px-2 sm:px-0">
                        <UserCheck size={22} className="mr-3 text-green-500" />
                        <H3 className="text-xl font-semibold text-foreground">
                            Jueces Ya Validados ({officialsValidated.length})
                        </H3>
                    </div>
                    {renderOfficialList(officialsValidated, false)}
                </section>
            )}

            {officials.length === 0 && !isLoading && !error && (
                <div className="px-2 sm:px-0">
                    <CenteredMessage
                        icon={<ClipboardList size={48} />}
                        title="Sin Jueces"
                        message="No hay jueces registrados para tu federación en este momento."
                    />
                </div>
            )}
        </div>
    );
}