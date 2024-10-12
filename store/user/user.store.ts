import { create } from 'zustand'
import { persist } from 'zustand/middleware'


enum RolesEnum {
    NATIONALFEDERATION = "NationalFederation",
    FEDERATION = "Federation",
    ORGANIZER = "Organizer",
    ATHLETE = "Athlete",
    OFFICIAL = "Official",
    NULL = 'null',
}

const initialState = {
    access_token: '',
    id: '',
    username: '',
    role: RolesEnum.NULL,
    email: ''
}

interface State {
    user: typeof initialState;

    login: (user: State['user']) => void;
    logout: () => void;
    isNull: () => boolean;
}

export const useUserState = create<State>()(
    persist(
        (set, get) => ({
            user: initialState,
            login: (user: State['user']) => {
                set({ user: user })
            },
            logout: () => {
                set({ user: initialState })
            },
            isNull: () => {
                return get().user.role === RolesEnum.NULL || !get().user.access_token;
            }
        }),
        {
            name: 'user-state',
        }
    )
)


