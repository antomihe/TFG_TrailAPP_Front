'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, Button as UiButton } from '@/components/ui';
import { AlertTriangle } from 'lucide-react';
import { useChatConnection } from '@/hooks/api/dashboard/chat/useChatConnection';
import { ChatHeader } from './ChatHeader';
import Chat from './Chat';

const ChatSkeletonLoader = () => (
    <div className="flex flex-col h-full bg-card rounded-lg shadow-md overflow-hidden border dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 border-b dark:border-neutral-700">
            <Skeleton className="h-7 w-3/5 sm:w-48 mb-2 sm:mb-0" />
            <Skeleton className="h-7 w-28 sm:w-32" />
        </div>
        <div className="flex-grow p-4 space-y-3">
            <Skeleton className="h-16 w-3/5" />
            <Skeleton className="h-12 w-1/2 ml-auto" />
            <Skeleton className="h-20 w-2/3" />
            <Skeleton className="h-10 w-3/4 ml-auto" />
        </div>
        <div className="flex gap-2 p-3 sm:p-4 border-t dark:border-neutral-700 bg-muted/30 dark:bg-neutral-800/30">
            <Skeleton className="h-10 flex-grow" />
            <Skeleton className="h-10 w-16 sm:w-20" />
        </div>
    </div>
);

export default function ChatPageContent() {
    const {
        messages,
        eventName,
        isConnected,
        socketError,
        loadingInitialData,
        initialDataError,
        sendMessage,
        userId,
        refetchInitialData,
    } = useChatConnection();

    if (loadingInitialData) {
        return <ChatSkeletonLoader />;
    }

    if (initialDataError) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4 bg-card rounded-lg shadow-md border dark:border-neutral-800">
                <Alert variant="destructive" className="max-w-md w-full">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                        {initialDataError} <br/>
                        <UiButton onClick={refetchInitialData} variant="link" className="p-0 h-auto text-destructive underline mt-2 text-sm">
                            Reintentar
                        </UiButton>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-card rounded-lg shadow-md overflow-hidden border dark:border-neutral-800">
            <ChatHeader
                eventName={eventName}
                isConnected={isConnected}
            />
            {socketError && !isConnected && (
                 <div className="px-3 sm:px-4 py-1">
                    <Alert variant="destructive" className="text-xs p-2 sm:p-3">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <AlertDescription>{socketError}</AlertDescription>
                    </Alert>
                 </div>
            )}
            <div className="flex-grow overflow-hidden relative">
                <Chat
                    userId={userId}
                    messages={messages}
                    onSendMessage={sendMessage}
                    disabled={!isConnected || !!socketError}
                />
            </div>
        </div>
    );
}