import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Residence, CreateResidence, UpdateResidence } from '../../schema/residence.schema';
import { residenceService } from '../../services/residence.service';
import { IReduxState } from '../store';

export interface ResidenceState {
    residences: Residence[];
    currentResidence: Residence | null;
    loading: boolean;
    error: string | null;
}

const initialState: ResidenceState = {
    residences: [],
    currentResidence: null,
    loading: false,
    error: null,
};

// Thunks
export const fetchAllResidences = createAsyncThunk(
    'residence/fetchAll',
    async () => {
        const response = await residenceService.getAllResidences();
        return response.data;  
      }
);

export const fetchResidenceById = createAsyncThunk(
    'residence/fetchById',
    async (residenceId: number) => {
        return await residenceService.getResidenceById(residenceId);
    }
);

export const createResidence = createAsyncThunk(
    'residence/create',
    async (residence: CreateResidence) => {
        return await residenceService.createResidence(residence);
    }
);

export const updateResidence = createAsyncThunk(
    'residence/update',
    async (residence: UpdateResidence) => {
        return await residenceService.updateResidence(residence);
    }
);

export const deleteResidence = createAsyncThunk(
    'residence/delete',
    async (residenceId: number) => {
        await residenceService.deleteResidence(residenceId);
        return residenceId;
    }
);

export const activateResidence = createAsyncThunk(
    'residence/activate',
    async (residenceId: number) => {
        return await residenceService.activateResidence(residenceId);
    }
);

const residenceSlice = createSlice({
    name: 'residence',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentResidence: (state) => {
            state.currentResidence = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch All
        builder
            .addCase(fetchAllResidences.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllResidences.fulfilled, (state, action) => {
                state.loading = false;
                state.residences = action.payload;
            })
            .addCase(fetchAllResidences.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erreur lors du chargement des résidences';
            });

        // Fetch By Id
        builder
            .addCase(fetchResidenceById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchResidenceById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentResidence = action.payload;
            })
            .addCase(fetchResidenceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erreur lors du chargement de la résidence';
            });

        // Create
        builder
            .addCase(createResidence.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createResidence.fulfilled, (state, action:any) => {
                state.loading = false;
                state.residences.push(action.payload.data[0]);
            })
            .addCase(createResidence.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erreur lors de la création de la résidence';
            });

        // Update
        builder
            .addCase(updateResidence.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateResidence.fulfilled, (state, action:any) => {
                console.log("🚀 ~ .addCase ~ action:", action)
                state.loading = false;
                const index = state.residences.findIndex(r => r.residenceId === action.payload.data[0].residenceId);
                if (index !== -1) {
                    state.residences[index] = action.payload.data[0];
                }
              
            })
            .addCase(updateResidence.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erreur lors de la mise à jour de la résidence';
            });

        // Delete
        builder
            .addCase(deleteResidence.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteResidence.fulfilled, (state, action) => {
                state.loading = false;
                state.residences = state.residences.filter(r => r.residenceId !== action.payload);
            })
            .addCase(deleteResidence.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erreur lors de la suppression de la résidence';
            });

        // Activate
        builder
            .addCase(activateResidence.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(activateResidence.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.residences.findIndex(r => r.residenceId === action.payload.residenceId);
                if (index !== -1) {
                    state.residences[index] = action.payload;
                }
            })
            .addCase(activateResidence.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erreur lors de l\'activation de la résidence';
            });
    },
});

export const selectAllResidences = (state: IReduxState) => state.residence.residences;
export const selectCurrentResidence = (state: IReduxState) => state.residence.currentResidence;
export const selectLoading = (state: IReduxState) => state.residence.loading;
export const selectError = (state: IReduxState) => state.residence.error;

export const { clearError, clearCurrentResidence } = residenceSlice.actions;
export default residenceSlice.reducer; 