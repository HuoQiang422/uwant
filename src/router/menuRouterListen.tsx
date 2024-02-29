import { useDispatch, useSelector } from "react-redux";
import { API_LOGIN_USERMENU, API_LOGIN_USERROUTER } from "../config/api";
import { GET_MENU_FROM_SERVER } from "../config/settings";
import {
	setDatabaseMenu,
	setDatabaseSiderMenu,
	setPermissionsList,
	setSiderMenu,
} from "../redux/menu";
import { User } from "../redux/user";
import {
	generateAuthMenu,
	generateAuthRouterWithRedirect,
} from "../utils/generateAuthList";
import { post } from "../utils/request";
import { buildTree } from "../utils/transformData";
import { menuDatabase, siderDatabase } from "./menuRouterData";
import { myRouters, setRouters } from "./myRouter";

export default function menuRouterListen() {
	const dispatch = useDispatch();
	const token = useSelector((state: { user: User }) => state.user.token);

	async function getMenu() {
		let res: any;
		if (GET_MENU_FROM_SERVER) {
			const result = await post({
				url: API_LOGIN_USERMENU,
				token,
			});
			res = result.content;
		} else {
			res = siderDatabase;
		}
		const data = buildTree(res);
		dispatch(setDatabaseSiderMenu(data));
		const menuData = generateAuthMenu(data!);
		dispatch(setSiderMenu(menuData));
	}

	async function getAuthList(
		setLoadingCompleted?: React.Dispatch<React.SetStateAction<boolean>>
	) {
		let res: any;
		if (GET_MENU_FROM_SERVER) {
			const result = await post({
				url: API_LOGIN_USERROUTER,
				token,
			});
			res = result.content;
		} else {
			res = menuDatabase;
		}

		if (res) {
			//设置按钮权限列表
			dispatch(
				setPermissionsList(
					res.filter((item: any) => item.type === 2 || item.type === 3)
				)
			);

			//生成数据库里面的层级权限列表
			const data = buildTree(res);
			dispatch(setDatabaseMenu(data));

			//生成权限路由
			const authRouter = generateAuthRouterWithRedirect(data!);

			let list = myRouters;
			list[0].children = authRouter;

			setRouters(list);

			//正常加载路由
			if (setLoadingCompleted) setLoadingCompleted(true);
		}
	}

	return {
		getMenu,
		getAuthList,
	};
}
