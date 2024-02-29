import { createSlice } from "@reduxjs/toolkit";

export type KeyCodeProps = {
	verifyKey?: string;
	verification?: string;
};

const defaultValues: KeyCodeProps = {
	verification: "",
	verifyKey: "",
};

const keyCode = createSlice({
	name: "keyCode",
	initialState: defaultValues,
	reducers: {
		setVerifyKey: (state, action) => {
			state.verifyKey = action.payload;
		},
		setVerification: (state, action) => {
			state.verification = action.payload;
		},
	},
});

export const { setVerifyKey, setVerification } = keyCode.actions;

export default keyCode.reducer;
