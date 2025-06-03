import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { prestationService } from '../../services/prestation.service';
import { CreatePrestation, Prestation, UpdatePrestation } from '../../schema/prestation.schema';
import { RootState } from '../store';

export interface PrestationState {
    prestations: Prestation[];
    loading: boolean;
    error: string | null;
}

const initialState: PrestationState = {
    prestations: [],
    loading: false,
    error: null
};

// Thunks
export const fetchAllPrestations = createAsyncThunk(
    'prestations/fetchAll',
    async () => {
        return await prestationService.getAllPrestations();
    }
);

export const createPrestation = createAsyncThunk(
    'prestations/create',
    async (prestation: CreatePrestation) => {
        return await prestationService.createPrestation(prestation);
    }
);

export const updatePrestation = createAsyncThunk(
    'prestations/update',
    async (prestation: UpdatePrestation) => {
        return await prestationService.updatePrestation(prestation);
    }
);

export const deletePrestation = createAsyncThunk(
    'prestations/delete',
    async (prestationId: number) => {
        await prestationService.deletePrestation(prestationId);
        return prestationId;
    }
);

export const activatePrestation = createAsyncThunk(
    'prestations/activate',
    async (prestationId: number) => {
        return await prestationService.activatePrestation(prestationId);
    }
);

const prestationSlice = createSlice({
    name: 'prestations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchAllPrestations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllPrestations.fulfilled, (state, action) => {
                state.loading = false;
                state.prestations = action.payload;
            })
            .addCase(fetchAllPrestations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            })
            // Create
            .addCase(createPrestation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPrestation.fulfilled, (state, action:any) => {
                state.prestations.push(action.payload?.data[0]);
            })
            .addCase(createPrestation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            })
            // Update
            .addCase(updatePrestation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePrestation.fulfilled, (state, action:any) => {
                state.loading = false;
                const index = state.prestations.findIndex(p => p.prestationId === action.payload?.data[0]?.prestationId);
                if (index !== -1) {
                    state.prestations[index] = action.payload?.data[0];
                }
            })
            .addCase(updatePrestation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            })
            // Delete
            .addCase(deletePrestation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePrestation.fulfilled, (state, action) => {
                state.loading = false;
                state.prestations = state.prestations.filter(p => p.prestationId !== action.payload);
            })
            .addCase(deletePrestation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            })
            // Activate
            .addCase(activatePrestation.fulfilled, (state, action) => {
                const index = state.prestations.findIndex(p => p.prestationId === action.payload.prestationId);
                if (index !== -1) {
                    state.prestations[index] = action.payload;
                }
            });
    }
});

// Selectors
export const selectAllPrestations = (state: RootState) => state.prestations.prestations;
export const selectLoading = (state: RootState) => state.prestations.loading;
export const selectError = (state: RootState) => state.prestations.error;

export default prestationSlice.reducer; 