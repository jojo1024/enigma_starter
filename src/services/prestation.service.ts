import axios from 'axios';
import { CreatePrestation, Prestation, UpdatePrestation } from '../schema/prestation.schema';
import { BASE_URL } from '../utils/constant';

const API_URL = `${BASE_URL}/api/prestation`;

export const prestationService = {
    // Créer une nouvelle prestation
    createPrestation: async (prestation: CreatePrestation): Promise<Prestation> => {
        const response = await axios.post(`${API_URL}/create`, prestation);
        return response.data;
    },

    // Récupérer toutes les prestations
    getAllPrestations: async (): Promise<Prestation[]> => {
        const response = await axios.get(`${API_URL}/fetchAll`);
        return response.data.data;
    },

    // Récupérer une prestation par ID
    getPrestationById: async (prestationId: number): Promise<Prestation> => {
        const response = await axios.get(`${API_URL}/fetchById/${prestationId}`);
        return response.data.data;
    },

    // Mettre à jour une prestation
    updatePrestation: async (prestation: UpdatePrestation): Promise<Prestation> => {
        const response = await axios.put(`${API_URL}/update`, prestation);
        return response.data;
    },

    // Supprimer une prestation
    deletePrestation: async (prestationId: number): Promise<void> => {
        await axios.delete(`${API_URL}/delete/${prestationId}`);
    },

    // Activer une prestation
    activatePrestation: async (prestationId: number): Promise<Prestation> => {
        const response = await axios.put(`${API_URL}/activate/${prestationId}`);
        return response.data.data;
    }
}; 