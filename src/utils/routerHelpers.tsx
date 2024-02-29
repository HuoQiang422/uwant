import { myRoutersType } from "../types/myRouters";

//遍历获得当前的router对象
export const getCurrentRouterMap = (
	routers: myRoutersType[],
	path: string
): myRoutersType | undefined => {
	for (let router of routers) {
		if (router.path == path) return router;
		if (router.children) {
			const childRouter = getCurrentRouterMap(router.children, path);
			if (childRouter) return childRouter;
		}
	}
	return undefined;
};
