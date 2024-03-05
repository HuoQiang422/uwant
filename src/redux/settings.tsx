import { createSlice } from "@reduxjs/toolkit";

export type SettingsProps = {
	siderOpen: boolean;
	layoutType: "top-down" | "left-right";
	theme: "light" | "dark";
	showKeepAliveTabs: boolean;
	siderWidth: number;
	debounceTime: number;
	themeColor: string;
	getMenuFromServer: boolean;
	homeHasBg: boolean;
	handleLogoColor: boolean;
};

const defaultValues: SettingsProps = {
	siderOpen: localStorage.getItem("siderOpen")
		? localStorage.getItem("siderOpen") === "true"
			? true
			: false
		: window.innerWidth >= 768
		? true
		: false,
	layoutType:
		localStorage.getItem("layoutType") === "left-right"
			? "left-right"
			: "top-down",
	theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
	showKeepAliveTabs: true,
	siderWidth: 224,
	debounceTime: 200,
	themeColor: "#FF640B",
	getMenuFromServer: false,
	homeHasBg: true,
	handleLogoColor: false,
};

const settings = createSlice({
	name: "settings",
	initialState: defaultValues,
	reducers: {
		setSiderOpenState: (state, action) => {
			state.siderOpen = action.payload;
		},
		setLayoutType: (state, action) => {
			state.layoutType = action.payload;
			localStorage.setItem("layoutType", action.payload);
		},
		setTheme: (state, action) => {
			state.theme = action.payload;
			localStorage.setItem("theme", action.payload);
		},
	},
});

export const { setSiderOpenState, setLayoutType, setTheme } = settings.actions;

export default settings.reducer;
