import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { icons } from "../../base-components/Lucide";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}

const initialState: SideMenuState = {
  menu: [
    {
      icon: "Activity",
      pathname: "/",
      title: "Dashbord",
    },
    {
      icon: "Activity",
      pathname: "/residences",
      title: "Résidences",
    },
    {
      icon: "Activity",
      pathname: "/config-chambres",
      title: "Config. Chambres",
    },
    {
      icon: "Activity",
      pathname: "/chambres",
      title: "Chambres",
    },
    {
      icon: "Activity",
      pathname: "/reservations",
      title: "Reservations",
    },
    // {
    //   icon: "Activity",
    //   pathname: "/clients",
    //   title: "Clients",
    // },
    {
      icon: "Activity",
      pathname: "/utilisateurs",
      title: "Utilisateurs",
    },
  ],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;
