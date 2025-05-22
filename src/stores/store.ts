import { configureStore, ThunkAction, Action, combineReducers } from "@reduxjs/toolkit";
import darkModeReducer, { DarkModeState } from "./slices/darkModeSlice";
import colorSchemeReducer, { ColorSchemeState } from "./slices/colorSchemeSlice";
import sideMenuReducer, { SideMenuState } from "./slices/sideMenuSlice";
import simpleMenuReducer, { SimpleMenuState } from "./slices/simpleMenuSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import topMenuReducer, { TopMenuState } from "./slices/topMenuSlice";
import residenceReducer, { ResidenceState } from "./slices/residenceSlice";
import configChambreReducer, { ConfigChambreState } from "./slices/configChambreSlice";
import thunk from "redux-thunk";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import reservationReducer, { ReservationState } from "./slices/reservationSlice";
import chambreReducer, { ChambreState } from "./slices/ChambreSlice";
import utilisateurReducer, { UtilisateurState } from "./slices/utilisateurSlice";
import appReducer, { AppState } from "./slices/appSlice";
export interface IReduxState {
  app: AppState;
  residence: ResidenceState;
  configChambre: ConfigChambreState;
  reservation: ReservationState;
  chambre: ChambreState;
  utilisateur: UtilisateurState;
  darkMode: DarkModeState;
  colorScheme: ColorSchemeState;
  sideMenu: SideMenuState;
  simpleMenu: SimpleMenuState;
  topMenu: TopMenuState;
}

const rootReducer = combineReducers({
  app: appReducer,
  residence: residenceReducer,
  configChambre: configChambreReducer,
  reservation: reservationReducer,
  chambre: chambreReducer,
  utilisateur: utilisateurReducer,
  darkMode: darkModeReducer,
  colorScheme: colorSchemeReducer,
  sideMenu: sideMenuReducer,
  simpleMenu: simpleMenuReducer,
  topMenu: topMenuReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['app','darkMode', 'colorScheme', 'sideMenu', 'simpleMenu', 'topMenu'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Hooks typés
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
