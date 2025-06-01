import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chambreService } from '../../services/chambre.service';
import { IReduxState } from '../store';
import { CreateChambre, IChambre, UpdateChambre } from '../../schema/chambre.schema';

export interface ChambreState {
    chambres: IChambre[];
    currentChambre: IChambre | null;
    loading: boolean;
    error: string | null;
}

const initialState: ChambreState = {
    chambres: [],
    currentChambre: null,
    loading: false,
    error: null,
};

// Thunks
export const fetchAllChambres = createAsyncThunk(
    'chambre/fetchAll',
    async () => {
        const response = await chambreService.getAllChambres();
        return response;
    }
);

export const fetchChambreById = createAsyncThunk(
    'chambre/fetchById',
    async (chambreId: number) => {
        return await chambreService.getChambreById(chambreId);
    }
);

export const createChambre = createAsyncThunk(
    'chambre/create',
    async (chambre: CreateChambre) => {
        const response = await chambreService.createChambre(chambre);
        return response;
    }
);

export const updateChambre = createAsyncThunk(
    'chambre/update',
    async ({ chambreId, chambre }: { chambreId: number; chambre: UpdateChambre }) => {
        const response = await chambreService.updateChambre(chambreId, chambre);
        return response;
    }
);

export const deleteChambre = createAsyncThunk(
    'chambre/delete',
    async (chambreId: number) => {
        await chambreService.deleteChambre(chambreId);
        return { chambreId };
    }
);

// Slice
const chambreSlice = createSlice({
    name: 'chambre',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchAllChambres
            .addCase(fetchAllChambres.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllChambres.fulfilled, (state, action) => {
                state.loading = false;
                state.chambres = action.payload;
            })
            .addCase(fetchAllChambres.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            })
            // fetchChambreById
            .addCase(fetchChambreById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChambreById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentChambre = action.payload;
            })
            .addCase(fetchChambreById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            })
            // createChambre
            .addCase(createChambre.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createChambre.fulfilled, (state, action) => {
                state.loading = false;
                state.chambres.push(action.payload);
            })
            .addCase(createChambre.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            })
            // updateChambre
            .addCase(updateChambre.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateChambre.fulfilled, (state, action:any) => {
                console.log("🚀 ~ .addCase ~ action.payload:", action.payload)
                state.loading = false;
                const index = state.chambres.findIndex(chambre => chambre.chambreId === action.payload?.data[0]?.chambreId);
                if (index !== -1) {
                    state.chambres[index] = {...state.chambres[index], ...action.payload?.data[0]};
                }
            })
            .addCase(updateChambre.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            })
            // deleteChambre
            .addCase(deleteChambre.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteChambre.fulfilled, (state, action) => {
                state.loading = false;
                state.chambres = state.chambres.filter(chambre => chambre.chambreId !== action.payload.chambreId);
            })
            .addCase(deleteChambre.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            });
    }
});

// Selectors
export const selectAllChambres = (state: IReduxState) => state.chambre.chambres;
export const selectCurrentChambre = (state: IReduxState) => state.chambre.currentChambre;
export const selectChambreLoading = (state: IReduxState) => state.chambre.loading;
export const selectChambreError = (state: IReduxState) => state.chambre.error;

export default chambreSlice.reducer;



