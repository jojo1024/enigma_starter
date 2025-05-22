import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Utilisateur } from '../../schema/utilisateur.schema';
import { IReduxState } from '../store';

export interface AppState {
    isLoggedIn: boolean;
    connectionInfo: Utilisateur | null;
    loading: boolean;
    error: string | null;
}

const initialState: AppState = {
    isLoggedIn: false,
    connectionInfo: null,
    loading: false,
    error: null,
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setUserLogged: (state, action) => {
            state.isLoggedIn = true;
            state.connectionInfo = action.payload;
        },
        setUserLoggedOut: (state) => {
            state.isLoggedIn = false;
            state.connectionInfo = null;
        },
    },
});

export const selectConnectionInfo = (state: IReduxState) => state.app.connectionInfo;
export const selectIsLoggedIn = (state: IReduxState) => state.app.isLoggedIn;
export const { setUserLogged, setUserLoggedOut } = appSlice.actions;
export default appSlice.reducer;
