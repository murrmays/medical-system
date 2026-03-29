import axios from "axios";

export const api = axios.create({
    baseURL: 'https://mis-api.kreosoft.space/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token)
        config.headers.Authorization = `Bearer ${token}`;
    return config;
});