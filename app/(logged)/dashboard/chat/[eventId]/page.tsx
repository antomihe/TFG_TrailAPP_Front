'use client'

import { Head } from "@/components/layout";
import Connection from "./components/connection";

export default function DashboardPage() {
    return (
        <>

            <Head title="Chat" subtitle="Chat de un evento"/>

            <Connection />
        </>
    );
}
