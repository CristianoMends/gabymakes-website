import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getProducts = () => {
    return axios.get(`${API_BASE_URL}/products`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Erro ao buscar produtos:', error);
            throw error;
        });
};