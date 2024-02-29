export interface myRoutersType {
	/**
	 * 路由地址
	 */
	path: string;

	/**
	 * 路由页面
	 */
	element: ReactNode;

	/**
	 * 子页面
	 */
	children?: myRoutersType[];

	/**
	 * 是否需要权限认证
	 */
	auth?: boolean = false;

	/**
	 * 路由页面标题
	 */
	title?: string;

	/**
	 * 路由名称
	 */
	label?: string;

	/**
	 * 重定向地址
	 */
	redirect?: string;

	/**
	 * id
	 */
	id?: string;

	/**
	 * 排序号
	 */
	orderNum?: string | number;
}

export interface DatabaseMenu {
	/**
	 * @description 菜单id
	 */
	id: number;

	/**
	 * @description 权限id
	 */
	permissionId: string;

	/**
	 * @description 菜单名称
	 */
	name: string;

	/**
	 * @description 菜单URL，对应前端路由地址
	 */
	url: string;

	/**
	 * @description 权限标识，对应前端页面，多个用逗号分隔，如：user:list,user:create
	 */
	perms: string;

	/**
	 * @description 父菜单ID，一级菜单为0，默认为0，不排序，菜单类型为目录时，该字段必填，菜单类型为菜单或按钮�
	 */
	parentId: number;

	/**
	 * @description 0:目录，1:菜单，2:接口，3:内嵌网址，4:外链地址
	 */
	type: number;

	/**
	 * @description 排序字段，越小越靠前，默认为0，不排序
	 */
	orderNum: number;

	/**
	 * @description 0:禁用，1:正常，默认为1，不排序
	 */
	status: number;

	/**
	 * @description 菜单图标，默认为空，不排序，菜单类型为目录时，该字段必填，菜单类型为菜单或按钮时，该字段可选
	 */
	icon: string;
}
[];
