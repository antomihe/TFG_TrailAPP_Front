// app\(logged)\dashboard\chat\page.tsx
'use client'

import { Head } from "@/components/layout";
import { ChatList } from "./components/ChatList";

export default function DashboardPage() {
    return (
        <>
            <Head title="Chat" subtitle="Listados de chats"/>

            <ChatList />
        </>
    );
}
