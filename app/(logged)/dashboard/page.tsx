// app\(logged)\dashboard\page.tsx
'use client'

import { Head } from "@/components/layout";
import { NationalFederationMenuGrid, FederationMenuGrid, AthleteMenuGrid, OrganizerMenuGrid, OfficialMenuGrid } from "./components/MenuGrid";
import { useAuth } from "@/hooks/auth/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) {
    return <div>No user found</div>; 
  }
  return (
    <>
      <Head title="Menú principal" subtitle={`Hola ${user.username} 👋`} />

      {user.role === "NationalFederation" && <NationalFederationMenuGrid />}
      {user.role === "Federation" && <FederationMenuGrid />}
      {user.role === "Athlete" && <AthleteMenuGrid />}
      {user.role === "Official" && <OfficialMenuGrid />}
      {user.role === "Organizer" && <OrganizerMenuGrid />}
    </>
  );
}
