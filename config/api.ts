import axios from 'axios';

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: 'http://localhost:3001/api/v1',
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json',
    },
});


export default api;