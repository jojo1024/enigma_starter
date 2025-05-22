import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {  ConfigChambreResponse, ConfigChambreListResponse, configChambreService } from '../../services/config-chambre.service';
import { IReduxState } from '../store';
import { IConfigChambre } from '../../schema/configChambre.schema';

export interface ConfigChambreState {
    configChambres: IConfigChambre[];
    currentConfig: IConfigChambre | null;
    loading: boolean;
    error: string | null;
}

const initialState: ConfigChambreState = {
    configChambres: [],
    currentConfig: null,
    loading: false,
    error: null,
};

// Thunks
export const fetchAllConfigChambres = createAsyncThunk(
    'configChambre/fetchAll',
    async (params?: { configResidenceId?: number; configTypeChambreId?: number; status?: number }) => {
        const response = await configChambreService.getAllConfigChambres(params);
        return response.data;
    }
);

export const fetchConfigChambreById = createAsyncThunk(
    'configChambre/fetchById',
    async (id: number) => {
        const response = await configChambreService.getConfigChambreById(id);
        return response.data;
    }
);

export const createConfigChambre = createAsyncThunk(
    'configChambre/create',
    async (config: IConfigChambre) => {
        const response = await configChambreService.createConfigChambre(config);
        return response.data;
    }
);

export const updateConfigChambre = createAsyncThunk(
    'configChambre/update',
    async (config: IConfigChambre) => {
        const response = await configChambreService.updateConfigChambre(config);
        return response.data;
    }
);

export const deleteConfigChambre = createAsyncThunk(
    'configChambre/delete',
    async (id: number) => {
        await configChambreService.deleteConfigChambre(id);
        return id;
    }
);

export const activateConfigChambre = createAsyncThunk(
    'configChambre/activate',
    async (id: number) => {
        const response = await configChambreService.activateConfigChambre(id);
        return response.data;
    }
);

const configChambreSlice = createSlice({
    name: 'configChambre',
    initialState,
    reducers: {
        clearCurrentConfig: (state) => {
            state.currentConfig = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch All
        builder
            .addCase(fetchAllConfigChambres.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllConfigChambres.fulfilled, (state, action) => {
                state.loading = false;
                state.configChambres = action.payload;
            })
            .addCase(fetchAllConfigChambres.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            });

        // Fetch By Id
        builder
            .addCase(fetchConfigChambreById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConfigChambreById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentConfig = action.payload;
            })
            .addCase(fetchConfigChambreById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            });

        // Create
        builder
            .addCase(createConfigChambre.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createConfigChambre.fulfilled, (state, action) => {
                state.loading = false;
                state.configChambres.push(action.payload);
            })
            .addCase(createConfigChambre.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            });

        // Update
        builder
            .addCase(updateConfigChambre.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateConfigChambre.fulfilled, (state, action) => {
                console.log("🚀 ~ .addCase ~ action:", action)
                state.loading = false;
                const index = state.configChambres.findIndex(config => config.configChambreId === action.payload.configChambreId);
                if (index !== -1) {
                    state.configChambres[index] = action.payload;
                }
            })
            .addCase(updateConfigChambre.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            });

        // Delete
        builder
            .addCase(deleteConfigChambre.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteConfigChambre.fulfilled, (state, action) => {
                state.loading = false;
                state.configChambres = state.configChambres.filter(config => config.configChambreId !== action.payload);
            })
            .addCase(deleteConfigChambre.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            });

        // Activate
        builder
            .addCase(activateConfigChambre.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(activateConfigChambre.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.configChambres.findIndex(config => config.configChambreId === action.payload.configChambreId);
                if (index !== -1) {
                    state.configChambres[index] = action.payload;
                }
                if (state.currentConfig?.configChambreId === action.payload.configChambreId) {
                    state.currentConfig = action.payload;
                }
            })
            .addCase(activateConfigChambre.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            });
    },
});
export const selectAllConfigChambres = (state: IReduxState) => state.configChambre.configChambres;
export const selectConfigChambreLoading = (state: IReduxState) => state.configChambre.loading;
export const selectConfigChambreError = (state: IReduxState) => state.configChambre.error;
export const { clearCurrentConfig, clearError } = configChambreSlice.actions;
export default configChambreSlice.reducer; 