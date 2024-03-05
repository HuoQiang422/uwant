import { configureStore } from "@reduxjs/toolkit";
import keyCode from "./keyCode";
import menuRedux from "./menu";
import settings from "./settings";
import user from "./user";

export const store = configureStore({
	reducer: {
		user: user,
		menuRedux: menuRedux,
		settings: settings,
		keyCode: keyCode,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});
