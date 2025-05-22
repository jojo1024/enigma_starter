import axios from 'axios';
import { BASE_URL } from '../utils/constant';
import { Chambre, CreateChambre, IChambre, UpdateChambre } from '../schema/chambre.schema';

const API_URL = `${BASE_URL}/api/chambre`;

export const chambreService = {
    // Créer une chambre
    createChambre: async (chambre: CreateChambre): Promise<IChambre> => {
        const response = await axios.post(`${API_URL}/create`, chambre);
        return response.data;
    },

    // Obtenir une chambre par ID
    getChambreById: async (chambreId: number): Promise<IChambre> => {
        const response = await axios.get(`${API_URL}/fetchById/${chambreId}`);
        return response.data.data;
    },

    // Obtenir toutes les chambres
    getAllChambres: async (): Promise<IChambre[]> => {
        const response = await axios.get(`${API_URL}/fetchAll`);
        return response.data.data;
    },

    // Mettre à jour une chambre
    updateChambre: async (chambreId: number, chambre: UpdateChambre): Promise<IChambre> => {
        const response = await axios.put(`${API_URL}/update/${chambreId}`, chambre);
        return response.data;
    },

    // Supprimer une chambre
    deleteChambre: async (chambreId: number): Promise<void> => {
        await axios.delete(`${API_URL}/delete/${chambreId}`);
    }
}