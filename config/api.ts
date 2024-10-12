import { useUserState } from '@/store/user/user.store';
import axios from 'axios';

axios.defaults.withCredentials = true;

axios.defaults.withCredentials = true;

const api = (token: string | undefined = undefined) => {
    return axios.create({
        baseURL: 'http://localhost:3001/api/v1',
        timeout: 50000,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
};

export default api;