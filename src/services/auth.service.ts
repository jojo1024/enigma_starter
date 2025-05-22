import axios from 'axios';
import { BASE_URL } from '../utils/constant';

const API_URL = `${BASE_URL}/api/auth`;

export const authService = {
    authentificateUtilisateur: async (utilisateurTelephone: string, utilisateurMotDePasse: string) => {
        const response = await axios.post(`${API_URL}`, {
            utilisateurTelephone,
            utilisateurMotDePasse
        });
        return response.data;
    }
}
