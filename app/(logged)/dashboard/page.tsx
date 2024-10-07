'use client'

import { H1, H2 } from "@/components/ui";
import { useUserState } from "@/store/user/user.store";
import { NationalFederationMenuGrid, FederationMenuGrid, AthleteMenuGrid, OrganizerMenuGrid, OfficialMenuGrid } from "./components/MenuGrid";

export default function DashboardPage() {
  const user = useUserState.getState().user;
  console.log(user);

  return (
    <>
      <div className="flex flex-col items-center justify-center p-2 mb-4">
        <H1>Menú principal</H1>
        <H2 className="mt-5">Hola <span className="text-primary">{user.username}</span> 👋</H2>
      </div>

      {user.role === "NationalFederation" && <NationalFederationMenuGrid />}
      {user.role === "Federation" && <FederationMenuGrid />}
      {user.role === "Athlete" && <AthleteMenuGrid />}
      {user.role === "Official" && <OfficialMenuGrid />}
      {user.role === "Organizer" && <OrganizerMenuGrid />}
    </>
  );
}
