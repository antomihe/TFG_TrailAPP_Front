// app\(logged)\dashboard\chat\components\ChatList.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { H2 } from '@/components/ui/typography';
import { PaginationComponent } from '@/components/ui/pagination-component';
import { useChatList } from '@/hooks/api/dashboard/chat/useChatList';
import { EventChatCard } from './EventChatCard';
import { ServerCrash, MessageCircleOff, ListChecks, Loader2, ShieldAlert } from 'lucide-react';
import { HoverEffectCard, CardContent, CardFooter, CardHeader } from '@/components/ui';
import { CenteredMessage } from '@/components/ui/centered-message';

const EventCardSkeleton = () => (
    <HoverEffectCard className="flex flex-col justify-between h-full overflow-hidden rounded-lg border dark:border-neutral-800 bg-card shadow-md">
        <div>
            <CardHeader className="pb-3 border-b dark:border-neutral-700/70">
                <Skeleton className="h-6 w-3/4" /> {/* Title */}
                <Skeleton className="h-4 w-1/2 mt-1.5" /> {/* Date Description */}
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
                <div className="flex items-start">
                    <Skeleton className="h-5 w-5 mr-2 rounded-full mt-0.5" /> {/* Icon placeholder */}
                    <Skeleton className="h-4 w-full" /> {/* Location */}
                </div>
            </CardContent>
        </div>
        <CardFooter className="pt-3 pb-4 mt-auto">
            <Skeleton className="h-9 w-full" /> {/* Button Skeleton */}
        </CardFooter>
    </HoverEffectCard>
);


const ListSkeletonLoader = ({ itemCount = 3 }: { itemCount?: number }) => (
    <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
            <Skeleton className="h-8 w-1/3 mx-auto mb-3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: itemCount }).map((_, index) => (
                <EventCardSkeleton key={index} />
            ))}
        </div>
        <div className="mt-8 flex justify-center">
            <Skeleton className="h-10 w-64" />
        </div>
    </div>
);


export function ChatList() {
    const {
        events,
        allEventsCount,
        loading,
        error,
        isValidRoleForList,
        redirectToEventId,
        currentPage,
        totalPages,
        handlePageChange,
        refetchEvents
    } = useChatList();

    const router = useRouter();

    useEffect(() => {
        if (redirectToEventId) {
            router.push(`/dashboard/chat/${redirectToEventId}`);
        }
    }, [redirectToEventId, router]);



    if (!isValidRoleForList && !loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <CenteredMessage
                    icon={<ShieldAlert size={48} />}
                    title="Acceso No Autorizado"
                    variant="warning"
                    message="No tienes los permisos para editar tu perfil."
                />
            </div>
        );
    }

    if (loading && (!events || events.length === 0)) {
        return <ListSkeletonLoader itemCount={3} />;
    }

    if (error && (!events || events.length === 0)) {
        return (
            <div className="container mx-auto px-4 py-8">
                <CenteredMessage
                    icon={<ServerCrash size={48} />}
                    title="Error al Cargar Chats"
                    variant="destructive"
                    message={<>{error} <br /> No se pudieron obtener los eventos para el chat.</>}
                    action={refetchEvents && (
                        <Button onClick={refetchEvents} variant="destructive">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reintentar
                        </Button>
                    )}
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <H2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-primary dark:text-primary-foreground">
                Chats de Eventos
                {loading && <Loader2 className="ml-3 h-6 w-6 inline animate-spin text-muted-foreground" />}
            </H2>

            {error && events && events.length > 0 && (
                <Alert variant="destructive" className="mb-6">
                    <ServerCrash className="h-4 w-4" />
                    <AlertTitle>Error de Actualización</AlertTitle>
                    <AlertDescription>
                        No se pudieron cargar los datos más recientes ({error}). Mostrando información previa.
                        {refetchEvents && <Button onClick={refetchEvents} variant="link" className="p-0 h-auto text-destructive-foreground underline ml-2">Reintentar</Button>}
                    </AlertDescription>
                </Alert>
            )}

            {(!events || events.length === 0) && !loading && !error ? (
                <CenteredMessage
                    icon={<MessageCircleOff size={48} />}
                    title="No Hay Eventos para Chatear"
                    message="Actualmente no hay eventos disponibles con chat activo para tu rol."
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <EventChatCard
                            key={event.id}
                            event={event}
                        />
                    ))}
                </div>
            )}

            {allEventsCount > 0 && totalPages > 1 && (
                <PaginationComponent
                    className="mt-10 flex justify-center"
                    currentPage={currentPage + 1}
                    totalPages={totalPages}
                    handlePageChange={(page) => handlePageChange(page - 1)}
                />
            )}
        </div>
    );
}