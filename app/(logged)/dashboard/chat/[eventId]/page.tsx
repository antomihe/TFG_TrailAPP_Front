// app\(logged)\dashboard\chat\[eventId]\page.tsx
'use client';

import { Head } from "@/components/layout";
import ChatPageContent from "./components/ChatPageContent"; 

export default function ChatEventPage() {
    return ( 
        <div className="w-full h-full flex flex-col">
            <Head title="Chat del Evento" subtitle="Comunicación en tiempo real" />
            <ChatPageContent />
        </div>
    );
}