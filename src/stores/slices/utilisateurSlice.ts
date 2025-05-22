import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { utilisateurService } from '../../services/utilisateur.service';
import { IReduxState } from '../store';
import { CreateUtilisateur, UpdateUtilisateur, Utilisateur } from '../../schema/utilisateur.schema';

export interface UtilisateurState {
    utilisateurs: Utilisateur[];
    currentUtilisateur: Utilisateur | null;
    loading: boolean;
    error: string | null;
}

const initialState: UtilisateurState = {
    utilisateurs: [],
    currentUtilisateur: null,
    loading: false,
    error: null,
};


// Thunks
export const fetchAllUtilisateurs = createAsyncThunk(
    'utilisateur/fetchAll',
    async () => {
        const response = await utilisateurService.getAllUtilisateurs();
        return response;
    }
);

export const selectAllUtilisateurs = (state: IReduxState) => state.utilisateur.utilisateurs;
export const selectCurrentUtilisateur = (state: IReduxState) => state.utilisateur.currentUtilisateur;
export const selectUtilisateurLoading = (state: IReduxState) => state.utilisateur.loading;
export const selectUtilisateurError = (state: IReduxState) => state.utilisateur.error;

export const createUtilisateur = createAsyncThunk(
    'utilisateur/create',
    async (utilisateur: CreateUtilisateur) => {
        const response = await utilisateurService.createUtilisateur(utilisateur);
        return response;
    }
);

export const updateUtilisateur = createAsyncThunk(
    'utilisateur/update',
    async ({ id, utilisateur }: { id: number; utilisateur: UpdateUtilisateur }) => {
        const response = await utilisateurService.updateUtilisateur(id, utilisateur);
        return response;
    }
);

export const deleteUtilisateur = createAsyncThunk(
    'utilisateur/delete',
    async (id: number) => {
        await utilisateurService.deleteUtilisateur(id);
        return id;
    }
);

// Slice
const utilisateurSlice = createSlice({
    name: 'utilisateur',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUtilisateurs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUtilisateurs.fulfilled, (state, action) => {
                state.loading = false;
                state.utilisateurs = action.payload;
            })
            .addCase(fetchAllUtilisateurs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erreur lors de la récupération des utilisateurs';
            })
            .addCase(createUtilisateur.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUtilisateur.fulfilled, (state, action) => {
                state.loading = false;
                state.utilisateurs.unshift(action.payload);
            })
            .addCase(createUtilisateur.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erreur lors de la création de l\'utilisateur';
            })
            .addCase(updateUtilisateur.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUtilisateur.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.utilisateurs.findIndex(u => u.utilisateurId === action.payload.utilisateurId);
                if (index !== -1) {
                    state.utilisateurs[index] = action.payload;
                }
            })
            .addCase(updateUtilisateur.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erreur lors de la mise à jour de l\'utilisateur';
            })
            .addCase(deleteUtilisateur.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUtilisateur.fulfilled, (state, action) => {
                state.loading = false;
                state.utilisateurs = state.utilisateurs.filter(u => u.utilisateurId !== action.payload);
            })
            .addCase(deleteUtilisateur.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Erreur lors de la suppression de l\'utilisateur';
            });
    },
});

export default utilisateurSlice.reducer;
