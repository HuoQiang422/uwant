import { message } from "../components/common/myMessage";
import { API_URL } from "../config/api";
import { isURL } from "./transformData";

//进入加载中状态
export const enterLoading = (
	index: number | string,
	setLoadings: React.Dispatch<React.SetStateAction<boolean[]>>
) => {
	setLoadings((prevLoadings: any) => {
		const newLoadings = [...prevLoadings];
		newLoadings[index as number] = true;
		return newLoadings;
	});
};

//离开加载中状态
export const leaveLoading = (
	index: number | string,
	setLoadings: React.Dispatch<React.SetStateAction<boolean[]>>
) => {
	setLoadings((prevLoadings: any) => {
		const newLoadings = [...prevLoadings];
		newLoadings[index as number] = false;
		return newLoadings;
	});
};

//判断是否有权限
export const hasPermission = (
	permissions: any[] | undefined,
	permission: string[] | string
) => {
	if (!permissions) {
		return false;
	}
	return permissions?.find((item: any) =>
		(Array.isArray(permission) ? permission : [permission]).includes(item.perms)
	)
		? true
		: false;
};

//获取按钮路由
export const getPermissionUrl = (
	permissions: any[] | undefined,
	permission: string
) => {
	if (!permissions) {
		return "";
	}
	const permissionPerms = permissions?.find((item: any) =>
		(Array.isArray(permission) ? permission : [permission]).includes(item.perms)
	);
	return permissionPerms
		? isURL(permissionPerms.url)
			? permissionPerms.url
			: `${API_URL}${permissionPerms.url}`
		: "";
};

//复制文本到剪贴板
export function copyToClipboard(text: string) {
	navigator.clipboard
		.writeText(text)
		.then(() => {
			message.success("复制成功");
		})
		.catch(() => {
			message.error(`复制失败`);
		});
}

//数组文本中添加或删除文本
export function stringArrAddOrDeleteText(
	arr: string[],
	text: string | string[]
): string[] {
	const newArr = [...arr];
	if (Array.isArray(text)) {
		for (const t of text) {
			if (!newArr.includes(t)) {
				newArr.push(t);
			} else {
				const index = newArr.indexOf(t);
				newArr.splice(index, 1);
			}
		}
	} else {
		if (!newArr.includes(text)) {
			newArr.push(text);
		} else {
			const index = newArr.indexOf(text);
			newArr.splice(index, 1);
		}
	}
	return newArr;
}
