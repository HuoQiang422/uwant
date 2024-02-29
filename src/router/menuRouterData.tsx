import { DatabaseMenu } from "../types/myRouters";

//菜单数据
export const siderDatabase: DatabaseMenu[] = [
	{
		id: 1,
		permissionId: "1",
		name: "推送管理",
		url: "/smsSend",
		perms: "smsSend",
		parentId: 0,
		type: 1,
		orderNum: 0,
		status: 1,
		icon: "CloudUploadOutlined",
	},
	{
		id: 2,
		permissionId: "2",
		name: "短信模版",
		url: "/smsTemplate",
		perms: "smsTemplate",
		parentId: 0,
		type: 1,
		orderNum: 0,
		status: 1,
		icon: "FileWordOutlined",
	},
];

//路由数据
export const menuDatabase: DatabaseMenu[] = siderDatabase;
