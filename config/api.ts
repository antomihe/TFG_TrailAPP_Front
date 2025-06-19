// config\api.ts
import axios, { AxiosError } from 'axios';

axios.defaults.withCredentials = true;

interface ErrorResponseData {
  message?: string;
}

const api = (token: string | undefined = undefined, version: string = 'v1') => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined in the environment variables.');
    }
    return axios.create({
        baseURL: `${process.env.NEXT_PUBLIC_API_URL}/${version}`,
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
    });
};

export default api;

export const errorHandler = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponseData>;
        if (axiosError.response) {
            const data = axiosError.response.data;
            return data?.message || `Error ${axiosError.response.status}: Ocurrió un error en el servidor.`;
        } else if (axiosError.request) {
            return 'No se recibió respuesta del servidor. Verifica tu conexión e inténtalo de nuevo.';
        } else {
            return axiosError.message || 'Error al configurar la solicitud.';
        }
    } else if (error instanceof Error) {
        return error.message;
    }
    return 'Ha ocurrido un error desconocido.';
}