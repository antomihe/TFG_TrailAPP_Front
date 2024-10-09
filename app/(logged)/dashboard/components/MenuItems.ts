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
    {
        title: "Federaciones autonómicas",
        description:
            "Administrar federaciones autonómicas",
        link: "dashboard/federations",
    },
];

export const FederationLinks: MenuItemList = [
    
];

export const OrganizerLinks: MenuItemList = [
    
];

export const OfficialLinks: MenuItemList = [
    
];


export const AthleteLinks: MenuItemList = [

];