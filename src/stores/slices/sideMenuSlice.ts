import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { icons } from "../../base-components/Lucide";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
  right:string;
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
  currentSideMenu: Menu
}

export const initialSideMenu = {
  icon: "Activity",
  pathname: `/`,
  title: "Aceuil",
  right:"ADMIN",
}

const initialState: SideMenuState = {
  menu: [
    {
      icon: "LayoutDashboard",
      pathname: "/",
      title: "Dashbord",
      right:"ADMIN",
    },
    {
      icon: "Building2",
      pathname: "/residences",
      title: "Résidences",
      right:"ADMIN",
    },
    {
      icon: "Settings",
      pathname: "/config-chambres",
      title: "Config. Chambres",
      right:"ADMIN",
    },
      {
        icon: "BedDouble",
      pathname: "/chambres",
      title: "Chambres",
      right:"ADMIN",
    },
    {
      icon: "Calendar",
      pathname: "/reservations",
      title: "Reservations",
      right:"CAISSIER",
    },
    {
      icon: "ListChecks",
      pathname: "/nos-prestations",
      title: "Nos prestations",
      right:"ADMIN",
    },
    {
      icon: "Users",
      pathname: "/utilisateurs",
      title: "Utilisateurs",
      right:"ADMIN",
    },
  ],
  currentSideMenu: {
    icon: "Activity",
    pathname: `/`,
    title: "Aceuil",
    right:"ADMIN",
  }
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {
    setCurrentSideMenu: (state, action: PayloadAction<Menu>) => {
      state.currentSideMenu = action.payload;
    },
  },});

  export const {
    setCurrentSideMenu,
  } = sideMenuSlice.actions;
  
export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;
