import { configureStore } from "@reduxjs/toolkit";
import controller from "./controller";
import keyCode from "./keyCode";
import menuRedux from "./menu";
import user from "./user";

export const store = configureStore({
	reducer: {
		user: user,
		menuRedux: menuRedux,
		controller: controller,
		keyCode: keyCode,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});
