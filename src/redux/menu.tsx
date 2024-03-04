import { createSlice } from "@reduxjs/toolkit";
import { MenuProps } from "antd";

export interface MenuRedux {
	siderMenu: MenuProps["items"];
	databaseSiderMenu?: any[];
	databaseMenu?: any[];
	permissionsList?: any[];
	keepAliveTabs?: any;
}

const defaultValues: MenuRedux = {
	siderMenu: [],
	databaseSiderMenu: [],
	databaseMenu: [],
	permissionsList: [],
	keepAliveTabs: [],
};

const menuRedux = createSlice({
	name: "menuRedux",
	initialState: defaultValues,
	reducers: {
		setSiderMenu: (state, action) => {
			state.siderMenu = action.payload;
		},
		setDatabaseSiderMenu: (state, action) => {
			state.databaseSiderMenu = action.payload;
		},
		setDatabaseMenu: (state, action) => {
			state.databaseMenu = action.payload;
		},
		setPermissionsList: (state, action) => {
			state.permissionsList = action.payload;
		},
		setKeepAliveTabs: (state, action) => {
			state.keepAliveTabs = action.payload;
		},
	},
});

export const {
	setSiderMenu,
	setDatabaseSiderMenu,
	setDatabaseMenu,
	setPermissionsList,
	setKeepAliveTabs,
} = menuRedux.actions;

export default menuRedux.reducer;
