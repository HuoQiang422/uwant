import { createSlice } from "@reduxjs/toolkit";

export type ControllerProps = {
	siderOpen: boolean;
};

const defaultValues: ControllerProps = {
	siderOpen:
		localStorage.getItem("siderOpen") === "true"
			? true
			: window.innerWidth > 768
			? true
			: false,
};

const controller = createSlice({
	name: "controller",
	initialState: defaultValues,
	reducers: {
		setSiderOpenState: (state, action) => {
			state.siderOpen = action.payload;
		},
	},
});

export const { setSiderOpenState } = controller.actions;

export default controller.reducer;
