export type MenuItem = {
    title: string;
    description: string;
    link: string;
}

export type MenuItemList = MenuItem[];

export const NationalFederationLinks: MenuItemList = [
    {
        title: "Federaciones autonómicas",
        description:
            "Dar de alta nueva federación autonómica",
        link: "/federations/new",
    },
    {
        title: "Federaciones autonómicas",
        description:
            "Administrar federaciones autonómicas",
        link: "/federations",
    },
];

export const FederationLinks: MenuItemList = [
    {
        title: "Organizadores",
        description:
            "Dar de alta nuevo organizador",
        link: "/organizers/new",
    },
    {
        title: "Organizadores",
        description:
            "Administrar organizadores",
        link: "/organizers",
    },
    {
        title: "Jueces",
        description:
            "Administrar jueces",
        link: "/officials",
    },
    {
        title: "Jurados",
        description: "Administrar jurados de eventos",
        link: "/events/judges",
    }
];

export const OrganizerLinks: MenuItemList = [
    {
        title: "Eventos",
        description:
            "Dar de alto un evento",
        link: "/events/join",
    },
];

export const OfficialLinks: MenuItemList = [
    {
        title: "Jurado",
        description:
            "Jurado de eventos",
        link: "/events/join",
    },
    {
        title: "Juzgamiento",
        description:
            "Juzgar eventos",
        link: "/events/judge",
    },
];


export const AthleteLinks: MenuItemList = [
    {
        title: "Carreras",
        description:
            "Unirse a una carrera",
        link: "/events/join",
    },
];