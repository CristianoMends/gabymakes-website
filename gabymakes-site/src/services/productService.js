import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Busca a lista de produtos da API.
 * @returns {Promise<Array<Object>>} Uma promessa que resolve para a lista de produtos.
 */
export const getProducts = () => {
    // A chamada `axios.get` já retorna uma promessa.
    return axios.get(`${API_BASE_URL}/products`)
        .then(response => {
            // O axios aninha a resposta real na propriedade 'data'.
            return response.data;
        })
        .catch(error => {
            console.error('Erro ao buscar produtos:', error);
            // Propaga o erro para que o componente que chamou a função possa lidar com ele.
            throw error;
        });
};