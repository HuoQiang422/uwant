import { Flex, Spin } from "antd";
import "nprogress/nprogress.css";
import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import { HOME_TITLE } from "../config/staticInfo";
import HomeLayout from "../layout/homeLayout";
import {
	setDatabaseMenu,
	setDatabaseSiderMenu,
	setPermissionsList,
	setSiderMenu,
} from "../redux/menu";
import { User } from "../redux/user";
import { getCurrentRouterMap } from "../utils/routerHelpers";
import menuRouterListen from "./menuRouterListen";
import { localRouter, myRouters, setRouters } from "./myRouter";

function RouterBeforeEach({ children }: any) {
	const { getMenu, getAuthList } = menuRouterListen();
	const navigator = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const token = useSelector((state: { user: User }) => state.user.token);
	const [loadingCompleted, setLoadingCompleted] = useState<boolean>(false);

	// 第一次加载获取菜单列表
	useEffect(() => {
		if (token) {
			getMenu();
			getAuthList(setLoadingCompleted);
		} else {
			setLoadingCompleted(false);
			dispatch(setPermissionsList([]));
			dispatch(setDatabaseMenu([]));
			dispatch(setDatabaseSiderMenu([]));
			dispatch(setSiderMenu([]));
			setRouters(myRouters);
		}
	}, [token]);

	// 路由鉴权
	useEffect(() => {
		let router = getCurrentRouterMap(myRouters, location.pathname);
		document.title = `${router?.title || HOME_TITLE} - ${HOME_TITLE}`;
		if ((!router && !token) || (router?.auth && !token)) {
			navigator("/login");
		} else if (token) {
			if (localRouter.some((router) => router.path === location.pathname)) {
				navigator("/");
			}
		}
	}, [location.pathname]);

	// 路由加载中动画
	function whenRouterSpin(type: string) {
		return (
			<Flex
				style={{ width: "100vw", height: "100vh" }}
				align="center"
				vertical
				gap={24}
				justify="center"
			>
				<Spin size={"large"} />
				<p className="font-bold">
					{type === "login" ? "登录中..." : "加载中..."}
				</p>
			</Flex>
		);
	}

	return (
		<div className="root-container flex">
			{localRouter.some((router) => router.path === location.pathname) &&
			token &&
			!loadingCompleted ? (
				whenRouterSpin("login")
			) : loadingCompleted ? (
				children
			) : localRouter.some((router) => router.path === location.pathname) ? (
				children
			) : location.pathname === "/" && token ? (
				<HomeLayout />
			) : (
				whenRouterSpin("load")
			)}
		</div>
	);
}

//路由详情
function Router() {
	return <Suspense>{useRoutes(myRouters)}</Suspense>;
}
export { Router, RouterBeforeEach };
