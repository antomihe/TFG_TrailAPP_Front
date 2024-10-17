export type MenuItem = {
    title: string;
    description: string;
    link: string;
}

export type MenuItemList = MenuItem[];

export const NationalFederationLinks: MenuItemList = [
    {
        title: "Federaciones autonómicas",
        description: "Dar de alta nueva federación autonómica",
        link: "dashboard/new/federation",
    },
];

export const FederationLinks: MenuItemList = [
    {
        title: "Organizadores",
        description: "Dar de alta nuevo organizador",
        link: "dashboard/new/organizer",
    },
    {
        title: "Jueces",
        description: "Validación de jueces",
        link: "dashboard/officials/validate",
    },
];

export const OrganizerLinks: MenuItemList = [
    {
        title: "Eventos",
        description: "Registrar nuevo evento",
        link: "dashboard/new/event",
    }

];

export const OfficialLinks: MenuItemList = [

];


export const AthleteLinks: MenuItemList = [

];