import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const api = {
    getRates: async (base: string = 'USD') => {
        const response = await axios.get(`${API_URL}/rates`, { params: { base } });
        return response.data;
    },

    getCurrencies: async () => {
        const response = await axios.get(`${API_URL}/currencies`);
        return response.data;
    },

    convert: async (amount: number, from: string, to: string) => {
        const response = await axios.get(`${API_URL}/convert`, { params: { amount, from, to } });
        return response.data;
    },

    getHistory: async (start: string, end: string, base: string) => {
        const response = await axios.get(`${API_URL}/history`, { params: { start_date: start, end_date: end, base } });
        return response.data;
    },
    getGoldRates: async () => {
        const response = await axios.get(`${API_URL}/gold-rates`);
        return response.data;
    }
};
