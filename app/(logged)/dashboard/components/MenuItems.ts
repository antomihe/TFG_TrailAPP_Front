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
        link: "dashboard/new/federation",
    },
];

export const FederationLinks: MenuItemList = [
    {
        title: "Organizadores",
        description:
            "Dar de alta nuevo organizador",
        link: "dashboard/new/organizer",
    },

];

export const OrganizerLinks: MenuItemList = [

];

export const OfficialLinks: MenuItemList = [

];


export const AthleteLinks: MenuItemList = [

];