import { configureStore } from "@reduxjs/toolkit";
import keyCode from "./keyCode";
import menuRedux from "./menu";
import settings from "./settings";
import user from "./user";
import demandTasksReducer from './demandTasks';


export const store = configureStore({
	reducer: {
		user: user,
		menuRedux: menuRedux,
		settings: settings,
		keyCode: keyCode,
		demandTasks: demandTasksReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
