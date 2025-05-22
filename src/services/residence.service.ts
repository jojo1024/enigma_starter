import axios from 'axios';
import { CreateResidence, Residence, UpdateResidence } from '../schema/residence.schema';
import { BASE_URL } from '../utils/constant';

const API_URL = `${BASE_URL}/api/residence`;

export const residenceService = {
    // Créer une résidence
    createResidence: async (residence: CreateResidence): Promise<Residence> => {
        const response = await axios.post(`${API_URL}/create`, residence);
        return response.data;
    },

    // Obtenir une résidence par ID
    getResidenceById: async (residenceId: number): Promise<Residence> => {
        const response = await axios.get(`${API_URL}/fetchById/${residenceId}`);
        return response.data.data;
    },

    // Obtenir toutes les résidences
    getAllResidences: async () => {
        const response = await axios.get(`${API_URL}/fetchAll`);
        return response.data;
    },

    // Mettre à jour une résidence
    updateResidence: async (residence: UpdateResidence): Promise<Residence> => {
        const response = await axios.put(`${API_URL}/update`, residence);
        return response.data;
    },

    // Supprimer une résidence
    deleteResidence: async (residenceId: number): Promise<void> => {
        await axios.delete(`${API_URL}/delete/${residenceId}`);
    },

    // Activer une résidence
    activateResidence: async (residenceId: number): Promise<Residence> => {
        const response = await axios.put(`${API_URL}/activate/${residenceId}`);
        return response.data.data;
    }
}; 