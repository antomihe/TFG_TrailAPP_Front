// app\(logged)\dashboard\chat\[eventId]\components\ChatPageContent.tsx


'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton'; 
import { Alert, AlertDescription, Button as UiButton } from '@/components/ui'; 
import { AlertTriangle } from 'lucide-react';
import { useChatConnection, ChatMessage } from '@/hooks/api/dashboard/chat/useChatConnection'; 
import { ChatHeader } from './ChatHeader';
import Chat from './Chat'; 

const ChatSkeletonLoader = () => (
    <div className="flex flex-col h-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 px-1 sm:px-4 py-2 border-b dark:border-gray-700">
            <Skeleton className="h-7 w-48 mb-2 sm:mb-0" />
            <Skeleton className="h-7 w-32" />
        </div>
        <div className="flex-grow p-4 space-y-3">
            <Skeleton className="h-16 w-3/5" />
            <Skeleton className="h-12 w-1/2 self-end" />
            <Skeleton className="h-20 w-2/3" />
        </div>
        <div className="flex gap-2 p-4 border-t dark:border-gray-700">
            <Skeleton className="h-10 flex-grow" />
            <Skeleton className="h-10 w-20" />
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
            <div className="flex flex-col items-center justify-center h-full p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        {initialDataError} <br/>
                        <UiButton onClick={refetchInitialData} variant="link" className="p-0 h-auto text-destructive underline mt-2">
                            Reintentar
                        </UiButton>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-var(--header-height,100px)-2rem)]"> 
            <ChatHeader
                eventName={eventName}
                isConnected={isConnected}
            />
            {socketError && !isConnected && (
                 <div className="px-4 mb-2">
                    <Alert variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3" />
                        <AlertDescription>{socketError}</AlertDescription>
                    </Alert>
                 </div>
            )}
            <div className="flex-grow overflow-hidden"> 
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