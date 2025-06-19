// app\(logged)\dashboard\chat\[eventId]\components\Chat.tsx
'use client';

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { H2, Small, P } from "@/components/ui/typography";
import RolesEnum from "@/enums/Roles.enum";
import { chatDateFormatter } from "@/lib/utils";
import { SendHorizonal, MessageCircle, UserCircle, Shield, Building, Award } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChatMessage } from "@/hooks/api/dashboard/chat/useChatConnection";

interface ChatProps {
    userId: string;
    userName?: string;
    userRole?: RolesEnum;
    messages: ChatMessage[];
    onSendMessage: (messageText: string) => void;
    disabled?: boolean;
    eventName?: string;
}

function getRoleDisplay(role: RolesEnum): { name: string; icon: React.ReactNode; color: string } {
    switch (role) {
        case RolesEnum.ATHLETE: return { name: "Atleta", icon: <UserCircle size={12} />, color: "text-blue-500 dark:text-blue-400" };
        case RolesEnum.OFFICIAL: return { name: "Juez", icon: <Shield size={12} />, color: "text-green-500 dark:text-green-400" };
        case RolesEnum.ORGANIZER: return { name: "Organizador", icon: <Building size={12} />, color: "text-purple-500 dark:text-purple-400" };
        case RolesEnum.FEDERATION: return { name: "Federación", icon: <Award size={12} />, color: "text-red-500 dark:text-red-400" };
        default: return { name: "Usuario", icon: <UserCircle size={12} />, color: "text-muted-foreground" };
    }
}

const ChatMessageBubble: React.FC<{ message: ChatMessage; isOwnMessage: boolean }> = ({ message, isOwnMessage }) => {
    const roleDisplay = getRoleDisplay(message.senderRole as RolesEnum);
    const bubbleAlignment = isOwnMessage ? "ml-auto" : "mr-auto";
    const bubbleStyles = isOwnMessage
        ? "bg-primary text-primary-foreground rounded-l-xl rounded-tr-xl"
        : "bg-muted text-foreground rounded-r-xl rounded-tl-xl dark:bg-neutral-800";
    const textAlign = isOwnMessage ? "text-right" : "text-left";

    const senderInitials = message.senderName?.substring(0, 2).toUpperCase() || "U";

    return (
        <div className={`flex items-end gap-2 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
            {!isOwnMessage && (
                <Avatar className="h-7 w-7 text-xs self-start mt-1">
                    <AvatarFallback className="bg-muted-foreground/20 dark:bg-muted-foreground/30 text-muted-foreground">
                        {senderInitials}
                    </AvatarFallback>
                </Avatar>
            )}
            <div className={`flex flex-col max-w-[70%] sm:max-w-[60%] ${bubbleAlignment}`}>
                <div className={`px-3.5 py-2.5 shadow-sm ${bubbleStyles}`}>
                    {!isOwnMessage && (
                        <div className="flex items-center gap-1.5 mb-1">
                            <Small className={`font-semibold text-xs ${roleDisplay.color}`}>{message.senderName}</Small>
                            <span className={`opacity-80 ${roleDisplay.color}`}>{roleDisplay.icon}</span>
                            <Small className={`font-medium text-xs opacity-70 ${isOwnMessage ? 'text-primary-foreground/80' : 'text-muted-foreground/80'}`}>
                                {roleDisplay.name}
                            </Small>
                        </div>
                    )}
                    <P className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.message}</P>
                </div>
                <Small className={`mt-1 text-xs text-muted-foreground/80 ${textAlign}`}>
                    {chatDateFormatter(message.createdAt)}
                </Small>
            </div>
        </div>
    );
};

export default function Chat({ userId, messages, onSendMessage, disabled = false, eventName = "Chat en Directo" }: ChatProps) {
    const [inputValue, setInputValue] = useState("");
    const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey && !disabled) {
            e.preventDefault();
            triggerSendMessage();
        }
    };

    const triggerSendMessage = () => {
        if (inputValue.trim() !== "" && !disabled) {
            onSendMessage(inputValue.trim());
            setInputValue("");
        }
    };

    return (
        <Card className="w-full mx-auto flex flex-col h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] md:h-[calc(100vh-230px)] shadow-xl dark:border-neutral-800 rounded-lg">
            <CardHeader className="border-b dark:border-neutral-700 py-3.5">
                <H2 className="text-lg sm:text-xl font-semibold text-center text-primary dark:text-primary-foreground truncate">
                    {eventName}
                </H2>
            </CardHeader>

            <CardContent className="p-0 flex-grow overflow-hidden relative">
                <ScrollArea className="h-full">
                    <div
                        ref={scrollAreaViewportRef}
                        className="p-4 space-y-4 h-full overflow-y-auto"
                        style={{ height: "100%", overflowY: "auto" }}
                    >
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full pt-10 text-center">
                                <MessageCircle size={48} className="mb-4 text-muted-foreground/50" />
                                <P className="text-muted-foreground">
                                    Aún no hay mensajes.
                                </P>
                                {!disabled && <P className="text-sm text-muted-foreground/80">¡Sé el primero en escribir!</P>}
                            </div>
                        )}
                        {messages.map((message) => (
                            <ChatMessageBubble
                                key={message.id || message.createdAt.toString()}
                                message={message}
                                isOwnMessage={message.senderId === userId}
                            />
                        ))}
                        <div ref={endOfMessagesRef} />
                    </div>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
                {disabled && (
                    <div className="absolute inset-0 bg-background/70 dark:bg-neutral-900/70 backdrop-blur-sm flex items-center justify-center z-10">
                        <P className="text-muted-foreground font-medium p-4 bg-muted/50 dark:bg-neutral-800/50 rounded-md">
                            El chat está deshabilitado o ha finalizado.
                        </P>
                    </div>
                )}
            </CardContent>

            {!disabled && (
                <CardFooter className="flex items-center gap-2 p-3 border-t dark:border-neutral-700 bg-muted/30 dark:bg-neutral-800/30">
                    <Input
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Escribe tu mensaje..."
                        className="flex-grow h-10 bg-background dark:bg-neutral-900 focus-visible:ring-primary/80"
                        onKeyDown={handleKeyPress}
                        disabled={disabled}
                        aria-label="Mensaje a enviar"
                    />
                    <Button
                        onClick={triggerSendMessage}
                        disabled={disabled || inputValue.trim() === ""}
                        className="h-10 px-3.5"
                        aria-label="Enviar mensaje"
                    >
                        <SendHorizonal size={18} />
                        <span className="sr-only">Enviar</span>
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
