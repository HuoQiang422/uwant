import { Navigate } from "react-router-dom";
import HomeLayout from "../layout/homeLayout";
import Login from "../pages/login";
import NotFound from "../pages/notFound";
import { myRoutersType } from "../types/myRouters";

export let myRouters: myRoutersType[] = [
	{
		path: "/",
		element: <HomeLayout />,
		auth: true,
		children: [],
	},
	{
		path: "/login",
		element: <Login />,
		auth: false,
		title: "用户登录",
	},
	{
		path: "/404",
		element: <NotFound />,
		auth: false,
		title: "您好像迷路啦",
	},
	{
		path: "*",
		element: <Navigate to={"/404"} replace={true} />,
		auth: false,
	},
];

export const localRouter: myRoutersType[] = [
	{
		path: "/login",
		element: <Login />,
		auth: false,
		title: "用户登录",
	},
	{
		path: "/404",
		element: <NotFound />,
		auth: false,
		title: "您好像迷路啦",
	},
];

export function setRouters(routers: myRoutersType[]) {
	myRouters = routers;
}
