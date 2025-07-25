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
        title: "Jurado",
        description: "Asignación de jueces",
        link: "dashboard/events/jury",
    },
];

export const OrganizerLinks: MenuItemList = [
    {
        title: "Eventos",
        description: "Registrar nuevo evento",
        link: "dashboard/new/event",
    },
    {
        title: "Inscripciones",
        description: "Listado de inscripciones",
        link: "dashboard/events/enrollments",
    },
    {
        title: "Material",
        description: "Asignación de material",
        link: "dashboard/events/equipment",
    }

];

export const OfficialLinks: MenuItemList = [
    {
        title: "Descalificaciones",
        description: "Enviar parte de descalificacion",
        link: "dashboard/new/disqualification",
    },
    {
        title: "Descalificaciones JA",
        description: "Recibir parte de descalificacion",
        link: "dashboard/disqualifications",
    },
    {
        title: "Control de material",
        description: "Asignación de puntos de control de material",
        link: "dashboard/new/checkPoint",
    },
    {
        title: "Control de material",
        description: "Realizar control de material",
        link: "dashboard/events/checkPoints",
    },
];


export const AthleteLinks: MenuItemList = [
    {
        title: "Eventos",
        description: "Inscripción a eventos",
        link: "dashboard/events/enroll"
    }

];