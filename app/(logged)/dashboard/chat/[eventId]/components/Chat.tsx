'use client';

import { useState, useEffect, useRef, memo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { P, Small } from "@/components/ui/typography";
import RolesEnum from "@/enums/Roles.enum";
import { chatDateFormatter } from "@/lib/utils";
import { SendHorizonal, MessageSquareText, UserCircle, Shield, Building, Award } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChatMessage } from "@/hooks/api/dashboard/chat/useChatConnection";

interface ChatProps {
    userId: string;
    messages: ChatMessage[];
    onSendMessage: (messageText: string) => void;
    disabled?: boolean;
}

function getRoleDisplay(role: RolesEnum): { name: string; icon: React.ReactNode; color: string } {
    const iconSize = 12;
    switch (role) {
        case RolesEnum.ATHLETE: return { name: "Atleta", icon: <UserCircle size={iconSize} />, color: "text-blue-500 dark:text-blue-400" };
        case RolesEnum.OFFICIAL: return { name: "Juez", icon: <Shield size={iconSize} />, color: "text-green-500 dark:text-green-400" };
        case RolesEnum.ORGANIZER: return { name: "Organizador", icon: <Building size={iconSize} />, color: "text-purple-500 dark:text-purple-400" };
        case RolesEnum.FEDERATION: return { name: "Federación", icon: <Award size={iconSize} />, color: "text-red-500 dark:text-red-400" };
        default: return { name: "Usuario", icon: <UserCircle size={iconSize} />, color: "text-muted-foreground" };
    }
}

const ChatMessageBubble: React.FC<{ message: ChatMessage; isOwnMessage: boolean }> = memo(({ message, isOwnMessage }) => {
    const roleDisplay = getRoleDisplay(message.senderRole as RolesEnum);
    const bubbleAlignment = isOwnMessage ? "ml-auto" : "mr-auto";
    const bubbleStyles = isOwnMessage
        ? "bg-primary text-primary-foreground rounded-l-xl rounded-tr-xl"
        : "bg-muted text-foreground rounded-r-xl rounded-tl-xl dark:bg-neutral-800";
    const textAlign = isOwnMessage ? "text-right" : "text-left";

    const senderInitials = message.senderName?.substring(0, 2).toUpperCase() || "U";

    return (
        <div className={`flex items-start gap-2 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
            {!isOwnMessage && (
                <Avatar className="h-6 w-6 text-[10px] self-start mt-0.5 shrink-0">
                    <AvatarFallback className="bg-muted-foreground/20 dark:bg-muted-foreground/30 text-muted-foreground">
                        {senderInitials}
                    </AvatarFallback>
                </Avatar>
            )}
            <div className={`flex flex-col max-w-[80%] xs:max-w-[70%] sm:max-w-[65%] ${bubbleAlignment}`}>
                <div className={`px-3 py-2 shadow-sm ${bubbleStyles}`}>
                    {!isOwnMessage && (
                        <div className="flex items-center gap-1 mb-0.5">
                            <Small className={`font-semibold text-xs ${roleDisplay.color}`}>{message.senderName}</Small>
                            <span className={`opacity-80 ${roleDisplay.color}`}>{roleDisplay.icon}</span>
                            <Small className={`font-medium text-[11px] opacity-70 ${isOwnMessage ? 'text-primary-foreground/80' : 'text-muted-foreground/80'}`}>
                                {roleDisplay.name}
                            </Small>
                        </div>
                    )}
                    <P className="text-sm leading-snug whitespace-pre-wrap break-words">{message.message}</P>
                </div>
                <Small className={`mt-0.5 text-[11px] text-muted-foreground/70 ${textAlign}`}>
                    {chatDateFormatter(message.createdAt)}
                </Small>
            </div>
        </div>
    );
});
ChatMessageBubble.displayName = 'ChatMessageBubble';


export default function Chat({ userId, messages, onSendMessage, disabled = false }: ChatProps) {
    const [inputValue, setInputValue] = useState("");
    const viewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (viewportRef.current) {
            viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: "smooth" });
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
        <div className="flex flex-col h-full">
            <ScrollArea className="flex-grow" ref={viewportRef}>
                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full min-h-[200px] pt-10 text-center text-muted-foreground">
                            <MessageSquareText size={40} className="mb-3 opacity-60" />
                            <P className="text-sm">
                                Aún no hay mensajes.
                            </P>
                            {!disabled && <P className="text-xs opacity-80">¡Sé el primero en escribir!</P>}
                        </div>
                    )}
                    {messages.map((msg) => (
                        <ChatMessageBubble
                            key={msg.id || msg.createdAt.toString()}
                            message={msg}
                            isOwnMessage={msg.senderId === userId}
                        />
                    ))}
                </div>
            </ScrollArea>

            {disabled && !messages.length && (
                <div className="absolute inset-0 bg-background/60 dark:bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center z-10 p-4">
                    <P className="text-muted-foreground font-medium p-3 bg-muted/50 dark:bg-neutral-800/50 rounded-md text-center text-sm">
                        El chat está deshabilitado o ha finalizado.
                    </P>
                </div>
            )}

            {!disabled && (
                <div className="flex items-center gap-2 p-3 border-t dark:border-neutral-700 bg-background sm:bg-muted/30 dark:bg-neutral-900 sm:dark:bg-neutral-800/30 [--chat-footer-h:60px] shrink-0">
                    <Input
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Escribe tu mensaje..."
                        className="flex-grow h-10 bg-background dark:bg-neutral-900 sm:dark:bg-neutral-850 focus-visible:ring-primary/80 text-sm"
                        onKeyDown={handleKeyPress}
                        disabled={disabled}
                        aria-label="Mensaje a enviar"
                    />
                    <Button
                        onClick={triggerSendMessage}
                        disabled={disabled || inputValue.trim() === ""}
                        className="h-10 px-3 shrink-0"
                        aria-label="Enviar mensaje"
                    >
                        <SendHorizonal size={18} />
                        <span className="sr-only sm:not-sr-only sm:ml-2">Enviar</span>
                    </Button>
                </div>
            )}
        </div>
    );
}