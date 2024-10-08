'use client'

import { Head } from "@/components/layout";
import { useUserState } from "@/store/user/user.store";
import { NationalFederationMenuGrid, FederationMenuGrid, AthleteMenuGrid, OrganizerMenuGrid, OfficialMenuGrid } from "./components/MenuGrid";

export default function DashboardPage() {
  const user = useUserState.getState().user;
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
