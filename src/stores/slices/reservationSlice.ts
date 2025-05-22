import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reservationService, Reservation, CreateReservation, IReservation } from '../../services/reservation.service';
import { IReduxState } from '../store';

export interface ReservationState {
    reservations: IReservation[];
    loading: boolean;
    error: string | null;
}

const initialState: ReservationState = {
    reservations: [],
    loading: false,
    error: null
};

// Thunks
export const fetchAllReservations = createAsyncThunk<IReservation[]>(
    'reservation/fetchAll',
    async () => {
        const response = await reservationService.getAllReservations();
        return response;
    }
);

export const createReservation = createAsyncThunk<IReservation, CreateReservation>(
    'reservation/create',
    async (reservation) => {
        const response = await reservationService.createReservation(reservation);
        return response;
    }
);

export const updateReservationStatus = createAsyncThunk<IReservation, { reservationId: number, reservationStatut: "confirmee" | "annulee", utilisateurId: number }>(
    'reservation/updateStatus',
    async (data) => {
        const response = await reservationService.updateReservationStatus(data);
        return response;
    }
);

const reservationSlice = createSlice({
    name: 'reservation',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchAllReservations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllReservations.fulfilled, (state, action) => {
                state.loading = false;
                state.reservations = action.payload;
            })
            .addCase(fetchAllReservations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            })
            // Create
            .addCase(createReservation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReservation.fulfilled, (state, action) => {
                state.loading = false;
                state.reservations.push(action.payload);
            })
            .addCase(createReservation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            })
            // Update Status
            .addCase(updateReservationStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateReservationStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.reservations.findIndex(r => r.reservationId === action.payload.reservationId);
                if (index !== -1) {
                    state.reservations[index] = {...state.reservations[index], ...action.payload};
                }
            })
            .addCase(updateReservationStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Une erreur est survenue';
            });
    }
});

export const selectAllReservations = (state: IReduxState) => state.reservation.reservations;
export const { clearError } = reservationSlice.actions;
export default reservationSlice.reducer; 