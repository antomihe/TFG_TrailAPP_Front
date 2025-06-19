// lib/types.ts
export enum RolesEnum {
    NATIONALFEDERATION = "NationalFederation",
    FEDERATION = "Federation",
    ORGANIZER = "Organizer",
    ATHLETE = "Athlete",
    OFFICIAL = "Official",
    NULL = 'null',
}

export interface User {
    id: string;
    username: string;
    role: RolesEnum;
    email: string;
}

export interface AuthData {
    access_token: string;
    user: User;
}