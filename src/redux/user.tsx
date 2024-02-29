import { createSlice } from "@reduxjs/toolkit";

export type User = {
	token: string;
	name: string;
	username: string;
};

const defaultValues: User = {
	token: localStorage.getItem("token")!,
	name: localStorage.getItem("name")!,
	username: localStorage.getItem("username")!,
};

const user = createSlice({
	name: "user",
	initialState: defaultValues,
	reducers: {
		setToken: (state, action) => {
			state.token = action.payload;
			localStorage.setItem("token", action.payload);
		},
		setName: (state, action) => {
			state.name = action.payload;
			localStorage.setItem("name", action.payload);
		},
		setUsername: (state, action) => {
			state.username = action.payload;
			localStorage.setItem("username", action.payload);
		},
	},
});

export const { setToken, setName, setUsername } = user.actions;

export default user.reducer;
