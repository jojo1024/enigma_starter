import axios from 'axios';
import { BASE_URL } from '../utils/constant';
import { IConfigChambre } from '../schema/configChambre.schema';

const API_URL = `${BASE_URL}/api/config-chambre`;


export interface ConfigChambreResponse {
  success: boolean;
  data: IConfigChambre;
}

export interface ConfigChambreListResponse {
  success: boolean;
  data: IConfigChambre[];
}

export const configChambreService =  {
   createConfigChambre: async (config: IConfigChambre): Promise<ConfigChambreResponse> => {
    const response = await axios.post(`${API_URL}/create`, config);
    return response.data;
  },

   getConfigChambreById: async (id: number): Promise<ConfigChambreResponse> => {
    const response = await axios.get(`${API_URL}/fetchById/${id}`);
    return response.data;
  },

  getAllConfigChambres: async (params?: {
    configResidenceId?: number;
    configTypeChambreId?: number;
    status?: number;
  }): Promise<ConfigChambreListResponse> => {
    const response = await axios.get(`${API_URL}/fetchAll`, { params });
    return response.data;
  },

  updateConfigChambre: async (config: IConfigChambre): Promise<ConfigChambreResponse> => {
    const response = await axios.put(`${API_URL}/update`, config);
    return response.data;
  },

  deleteConfigChambre: async (id: number): Promise<ConfigChambreResponse> => {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  },

  activateConfigChambre: async (id: number): Promise<ConfigChambreResponse> => {
    const response = await axios.put(`${API_URL}/activate/${id}`);
    return response.data;
  }


};
