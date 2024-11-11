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
    {
        title: "Eventos",
        description: "Asignación de jueces",
        link: "dashboard/jury",
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
    {
        title: "Eventos",
        description: "Validación de eventos",
        link: "dashboard/events/validate",
    },
    {
        title: "Eventos",
        description: "Administración de eventos",
        link: "dashboard/events/manage",
    },
    {
        title: "Eventos",
        description: "Asignación de jueces",
        link: "dashboard/events/jury",
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
    {
        title: "Descalificaciones",
        description: "Enviar parte de descalificacion",
        link: "dashboard/new/disqualification",
    },
];


export const AthleteLinks: MenuItemList = [
    {
        title: "Eventos",
        description: "Inscripción a eventos",
        link: "dashboard/events/enroll"
    }

];