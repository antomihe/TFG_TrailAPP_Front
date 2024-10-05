import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface State {
    user: {
        id: string;
        username: string;
        role: RolesEnum;
        email: string;
    }

    login: (user: State['user']) => void;
    logout: () => void;
    isNull: () => boolean;
}

export const useUserState = create<State>()(
    persist(
        (set, get) => ({
            user: {
                id: '',
                username: '',
                role: RolesEnum.NULL,
                email: ''
            },
            login: (user: State['user']) => {
                set({ user: user })
            },
            logout: () => {
                set({ user: { id: '', username: '', role: RolesEnum.NULL, email: '' } })
            },
            isNull: () => {
                return get().user.role !== RolesEnum.NULL;
            }
        }),
        {
            name: 'user-state',
        }
    )
)

export enum RolesEnum {
    NATIONALFEDERATION = "NationalFederation",
    FEDERATION = "Federation",
    ORGANIZER = "Organizer",
    ATHLETE = "Athlete",
    OFFICIAL = "Official",
    NULL = 'null',
}