interface MyTableSelectProps {
	/**
	 * @description 多选开关
	 */
	checked: boolean;

	/**
	 * @description 选中行
	 */
	selectedRowKeys: Key[] | any[];

	/**
	 * @description 获取多选key值
	 */
	setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;

	/**
	 * @description 多选的选择数据模式
	 */
	selectType?: "object" | "string";

	/**
	 * @description 多选权限key，如果需要多选，请传此参数
	 */
	multiPermissionKey?: string | string[];
}

interface MyTablePageProps {
	/**
	 * @description 是否显示分页，默认为true，如果不需要分页，请传false，如果需要分页，请传true
	 */
	showPagination: boolean;

	/**
	 * @description 分页回调函数，如果不需要分页，可以不传此参数，默认返回数据
	 * @param page
	 * @param pageSize
	 * @returns
	 */
	onPageChange?: (page: number, pageSize: any) => void;
}

interface MyTableParamsProps {
	/**
	 * @description 请求参数，默认为{}，如果需要额外参数，请传此参数
	 */
	searchParams: object;

	/**
	 * @description 参数类型，默认为formData，如果需要json格式，请传json
	 */
	paramsType?: "formData" | "json";
}

export interface MyTableProps {
	/**
	 * @description 表格列展示
	 */
	columns: TableColumnsType<any>;

	/**
	 * @description 获取表格数据的接口地址
	 */
	getListUrl: string;

	/**
	 * @description 表格key
	 */
	tableKey?: number;

	/**
	 * @description 行key，默认为id，如果需要其他key，请传此参数
	 */
	rowKey?: string | number | symbol | GetRowKey<any>;

	/**
	 * @description 请求方法
	 */
	method?: "POST" | "GET" | "get" | "post";

	/**
	 * @description 数据结构
	 */
	treeData?: boolean;

	/**
	 * @description 数据的json结构键值
	 */
	dataKey?: string;

	/**
	 * @description 数据处理函数，如果不需要处理，可以不传此参数，默认返回数据
	 * @param result
	 * @returns
	 */
	handleData?: (result: any) => void;

	/**
	 * @description 搜索条件/表格请求参数
	 */
	params?: MyTableParamsProps;

	/**
	 * @description 多选框
	 */
	select?: MyTableSelectProps;

	/**
	 * @description 页码
	 */
	pagination?: MyTablePageProps;
}
