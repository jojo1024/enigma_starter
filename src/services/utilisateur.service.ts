import axios from 'axios';
import { BASE_URL } from '../utils/constant';
import { CreateUtilisateur, UpdateUtilisateur, Utilisateur } from '../schema/utilisateur.schema';

const API_URL = `${BASE_URL}/api/utilisateur`;

export const utilisateurService = {
    // Créer un utilisateur
    createUtilisateur: async (utilisateur: CreateUtilisateur): Promise<Utilisateur> => {
        const response = await axios.post(`${API_URL}/create`, utilisateur);
        return response.data.data;
    },

    // Obtenir un utilisateur par ID
    getUtilisateurById: async (utilisateurId: number): Promise<Utilisateur> => {
        const response = await axios.get(`${API_URL}/fetchById/${utilisateurId}`);
        return response.data.data;
    },

    // Obtenir tous les utilisateurs
    getAllUtilisateurs: async () => {
        const response = await axios.get(`${API_URL}/fetchAll`);
        return response.data.data;
    },

    // Mettre à jour un utilisateur
    updateUtilisateur: async (utilisateurId: number, utilisateur: UpdateUtilisateur): Promise<Utilisateur> => {
        const response = await axios.put(`${API_URL}/update/${utilisateurId}`, utilisateur);
        return response.data.data;
    },

    // Supprimer un utilisateur
    deleteUtilisateur: async (utilisateurId: number): Promise<void> => {
        await axios.delete(`${API_URL}/delete/${utilisateurId}`);
    },

    // Vérifier si un utilisateur existe déjà par email
    checkUtilisateurByEmail: async (email: string): Promise<boolean> => {
        const response = await axios.get(`${API_URL}/checkByEmail/${email}`);
        return response.data.data;
    },

    // Vérifier si un utilisateur existe déjà par numéro de téléphone
    checkUtilisateurByTelephone: async (telephone: string): Promise<boolean> => {
        const response = await axios.get(`${API_URL}/checkByTelephone/${telephone}`);
        return response.data.data;
    },

    // Vérifier si un utilisateur existe déjà par nom
    checkUtilisateurByNom: async (nom: string): Promise<boolean> => {   
        const response = await axios.get(`${API_URL}/checkByNom/${nom}`);
        return response.data.data;
    },

    // Modifier le mot de passe d'un utilisateur
    updateUtilisateurMotDePasse: async (utilisateurId: number, motDePasse: string) => {
        const response = await axios.put(`${API_URL}/updatePassword/${utilisateurId}`, { motDePasse });
        return response.data;
    }

  
    
}