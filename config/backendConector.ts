import axios from 'axios';

axios.defaults.withCredentials = true;

const backendConector = axios.create({
    baseURL: process.env.API_URL || 'http://localhost:3001/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});


export default backendConector;