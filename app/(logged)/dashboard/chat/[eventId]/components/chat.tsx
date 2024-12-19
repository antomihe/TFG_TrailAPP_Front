import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "./connection";
import { H2, Separator, Small } from "@/components/ui";
import RolesEnum from "@/enums/Roles.enum";
import { chatDateFormatter } from "@/lib/utils";


type props = {
    userId: string;
    messages: Message[];
    handleSend: ({ message }: { message: string }) => void;
};

function displayRole(role: RolesEnum) {
    switch (role) {
        case RolesEnum.ATHLETE:
            return "ATLETA";
        case RolesEnum.OFFICIAL:
            return "JUEZ";
        case RolesEnum.ORGANIZER:
            return "ORGANIZADOR";
        default:
            return "Usuario desconocido";
    }
}

export default function Chat({ userId, messages, handleSend }: props) {
    const [inputValue, setInputValue] = useState("");

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const sendMessage = () => {
        if (inputValue.trim() !== "") {
            handleSend({ message: inputValue });
            setInputValue("");
        }
    }


    if (messages.length === 0) {
        // Si no hay mensajes, mostrar mensaje de bienvenida
    }

    return (
        <Card className="w-full mx-auto">
            <CardHeader>
                <H2 className="text-lg font-semibold text-center">Chat en vivo</H2>
            </CardHeader>
            <CardContent className="p-4">
                <ScrollArea className="h-72">
                    <div className="space-y-3">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`px-4 py-2 rounded-lg ${message.senderId === userId
                                        ? "bg-primary-foreground text-primary"
                                        : "bg-primary text-primary-foreground"
                                        }`}
                                >

                                    {message.senderId !== userId && (
                                        <>
                                            <div className="flex justify-between space-x-3">
                                                <Small className="font-semibold">{message.senderName}</Small>
                                                <Small className="font-bold mb-1 text-right">{displayRole(message.senderRole)}</Small>
                                            </div>
                                            <Separator className="mb-2 mt-0.5 bg-primary-foreground" />
                                        </>
                                    )}

                                    <div>{message.message}</div>
                                    <div className="text-xs font-light text-right">
                                        {chatDateFormatter(message.createdAt)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className="flex-grow"
                    onKeyDown={handleKeyPress}
                />
                <Button onClick={sendMessage}>Enviar</Button>
            </CardFooter>
        </Card>
    );
}
