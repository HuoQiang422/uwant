import { MenuProps } from "antd";
import { cloneDeep } from "lodash";
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { myRoutersType } from "../types/myRouters";

const modules = import.meta.glob(["../pages/**/**.tsx", "../layout/**/**.tsx"]);

export let homeUrl: string = "";

//生成带重定向的路由
export function generateAuthRouterWithRedirect(
	menuList: any[]
): myRoutersType[] {
	let hasRootRoute = false; // 标志变量，表示是否已经存在根路径的路由
	//生成路由表
	const authRouter = generateAuthRouter(menuList);

	for (const route of authRouter) {
		if (route.path === "/") {
			hasRootRoute = true;
			break;
		}
	}

	//添加默认跳转
	if (!hasRootRoute && authRouter.length > 0) {
		const firstRoutePath = authRouter[0].path;
		homeUrl = firstRoutePath;
		// 在根路径添加重定向到第一个路由地址
		authRouter.unshift({
			path: "/",
			element: <Navigate to={firstRoutePath} replace={true} />,
			auth: true,
		});
	}

	// 过滤掉 path 为空的元素
	const filteredAuthRouter = authRouter.filter((route) => route.path !== "");

	return filteredAuthRouter;
}

//生成路由表
export function generateAuthRouter(menuList: any[]): myRoutersType[] {
	const authRouter: myRoutersType[] = [];

	menuList.forEach((menu) => {
		const { url, perms, name, type, orderNum, permissionId, children } = menu;

		if (type === 2) {
			// 排除类型为button的菜单项
			return;
		}

		const componentsUrl = modules[`../pages/${perms}.tsx`] as any;
		const Component = componentsUrl
			? lazy(componentsUrl)
			: () => {
					return <></>;
			  };

		const route: myRoutersType = {
			id: permissionId,
			path: url,
			element: <Component />,
			auth: true,
			title: name,
			label: name,
			orderNum: orderNum,
		};

		authRouter.push(route);

		if (children && children.length > 0) {
			const flatRoutes = generateAuthRouter(children);
			authRouter.push(...flatRoutes);
		}
	});

	return authRouter;
}

//生成权限菜单
export function generateAuthMenu(menuList: any[]): MenuProps["items"] {
	const authMenu: MenuProps["items"] = [];

	function processMenu(menu: any): any {
		const { name, children, permissionId, icon, url } = menu;

		let menuItem: any = {
			label: name,
			icon: icon,
			key: permissionId, // 仅对type为'menu'的项，生成key并拼接父级路径
			url: url,
			// 注意：这里不直接添加children字段
		};

		// 检查并处理children
		if (children && children.length > 0) {
			const processedChildren: any[] = [];
			children.forEach((child: any) => {
				const processedChild = processMenu(child);
				if (processedChild) {
					processedChildren.push(processedChild);
				}
			});
			// 只有在processedChildren非空时才添加children字段
			if (processedChildren.length > 0) {
				menuItem = { ...menuItem, children: processedChildren };
			}
		}

		return menuItem;
	}

	menuList.forEach((menu) => {
		const processedMenu = processMenu(menu);
		if (processedMenu) {
			authMenu.push(processedMenu);
		}
	});

	return authMenu;
}

//获取父级菜单
export const BuildParentMenuTree = (data: any[]) => {
	const idMap: any = {};
	const root: any[] = [];

	const copiedData = cloneDeep(data); // 进行深拷贝

	copiedData.forEach((node) => {
		idMap[node.id] = node;
	});

	copiedData.forEach((node) => {
		if (node.type !== 2) {
			const parent = idMap[node.parentId];
			if (parent) {
				(parent.children || (parent.children = [])).push(node);
			} else {
				root.push(node);
			}
		}
	});

	return root;
};
