export interface MyTableSearchBarProps {
	/**
	 * @description 导出的请求方式
	 */
	exportRequestType?: "GET" | "POST";

	/**
	 * @description 导出按钮的权限值
	 */
	exportPermissionKey?: string;

	/**
	 * @description 导入按钮的权限值
	 */
	importPermissionKey?: string;

	/**
	 * @description 显示导出按钮
	 */
	showExport?: boolean;

	/**
	 * @description 显示导入按钮
	 */
	showImport?: boolean;

	/**
	 * @description 是否显示导入模版
	 */
	showImportTemplate?: boolean;

	/**
	 * @description 导入模版的文本说明
	 */
	importTemplateLabel?: string;

	/**
	 * @description 导入模板的tag图标
	 */
	importTemplateIcon?: React.ReactNode;

	/**
	 * @description 导入文件的模版下载地址的文本显示
	 */
	importTemplateLinkText?: string;

	/**
	 * @description 导入文件的字段键值 
	 */
	importFieldName?: string;

	/**
	 * @description 允许上传的文件类型
	 */
	uploadAccept?: string;

	/**
	 * @description 刷新列表函数
	 */
	reFresh?: () => void;

	/**
	 * @description 导出文件的请求地址
	 */
	exportRequestUrl?: string;

	/**
	 * @description 导入文件的请求地址
	 */
	importRequestUrl?: string;

	/**
	 * @description 实时搜索
	 */
	realTimeSearch?: boolean;
}
