import { DatabaseMenu } from "../types/myRouters";

//菜单数据
export const siderDatabase: DatabaseMenu[] = [
	// {
	// 	id: 1,
	// 	permissionId: "1",
	// 	name: "推送管理",
	// 	url: "/smsSend",
	// 	perms: "smsSend",
	// 	parentId: 0,
	// 	type: 1,
	// 	orderNum: 0,
	// 	status: 1,
	// 	icon: "CloudUploadOutlined",
	// },
	// {
	// 	id: 2,
	// 	permissionId: "2",
	// 	name: "短信模版",
	// 	url: "/smsTemplate",
	// 	perms: "smsTemplate",
	// 	parentId: 0,
	// 	type: 1,
	// 	orderNum: 0,
	// 	status: 1,
	// 	icon: "FileWordOutlined",
	// },
	// {
	// 	id: 3,
	// 	permissionId: "3",
	// 	name: "配置中心",
	// 	url: "/settings",
	// 	perms: "settings",
	// 	parentId: 0,
	// 	type: 1,
	// 	orderNum: 0,
	// 	status: 1,
	// 	icon: "SettingOutlined",
	// },
	{
		id: 4,
		permissionId: "4",
		name: "需求任务",
		url: "/demand-tasks",
		perms: "taskManage",
		parentId: 0,
		type: 1,
		orderNum: 0,
		status: 1,
		icon: "ScheduleOutlined",
	},
];

//路由数据
export const menuDatabase: DatabaseMenu[] = siderDatabase;
