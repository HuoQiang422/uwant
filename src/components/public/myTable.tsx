import { Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useUpdateEffect } from "react-use";
import { MenuRedux } from "../../redux/menu";
import { User } from "../../redux/user";
import { MyTableProps } from "../../types/myTable";
import { enterLoading, leaveLoading } from "../../utils/controllerUtils";
import { get, post } from "../../utils/request";
import { buildTree, transformJsonToFormData } from "../../utils/transformData";
import { abort } from "./signal";
import TableFix from "./tableFix";

const MyTable = (props: MyTableProps) => {
	const {
		columns,
		getListUrl,
		tableKey = 0,
		select,
		rowKey = "id",
		params,
		method = "POST",
		pagination,
		treeData,
		dataKey = "content.list",
		handleData,
	} = props;
	const {
		selectedRowKeys,
		setSelectedRowKeys,
		checked,
		selectType = "string",
		multiPermissionKey,
	} = select || {};
	const { searchParams, paramsType } = params || {};
	const { onPageChange, showPagination = true } = pagination || {};
	const [dataSource, setDataSource] = useState<any[]>([]);
	const [loadings, setLoadings] = useState<boolean[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [total, setTotal] = useState<number>(0);
	const token = useSelector((state: { user: User }) => state.user.token);
	const permissionsList = useSelector(
		(state: { menuRedux: MenuRedux }) => state.menuRedux.permissionsList
	);

	const onSelectChange = (
		newSelectedRowKeys: React.Key[],
		newSelectedRows: any[]
	) => {
		if (selectType === "string") {
			setSelectedRowKeys!(newSelectedRowKeys);
		} else {
			setSelectedRowKeys!(newSelectedRows);
		}
	};

	//获取列表
	function getTableList(newPage?: number, newPageSize?: number) {
		enterLoading(0, setLoadings);
		if (newPage && !newPageSize) setCurrentPage(1);
		const data = showPagination
			? {
					pageNum: newPage ? newPage : currentPage,
					pageSize: newPageSize ? newPageSize : pageSize,
					...searchParams,
			  }
			: searchParams;
		const requestOptions = {
			url: getListUrl,
			data:
				paramsType === "formData" && data
					? transformJsonToFormData(data)
					: data,
			token,
		};

		const requestPromise =
			method === "POST" ? post(requestOptions) : get(requestOptions);

		requestPromise
			.then((res: any) => {
				const keyArray = dataKey.split(".");
				let dataSource = res;
				for (let i = 0; i < keyArray.length; i++) {
					dataSource = dataSource[keyArray[i]];
				}
				leaveLoading(0, setLoadings);
				if (dataSource) {
					if (handleData) handleData(dataSource);
					//解决表格加载中闪动问题
					setTimeout(() => {
						treeData
							? setDataSource(buildTree(dataSource))
							: setDataSource(dataSource);
						if (showPagination) setTotal(res.content.total);
					}, 0);
				} else {
					setDataSource([]);
				}
			})
			.catch(() => {
				leaveLoading(0, setLoadings);
			});
	}

	useEffect(() => {
		if (getListUrl) getTableList(currentPage, pageSize);
	}, [tableKey]);

	useUpdateEffect(() => {
		abort();
		getTableList(1);
	}, [searchParams]);

	return (
		<>
			<TableFix>
				<Table
					loading={loadings[0]}
					dataSource={dataSource}
					columns={columns}
					scroll={{ x: "max-content" }}
					rowKey={rowKey}
					rowSelection={
						checked &&
						permissionsList?.find((item: any) =>
							(Array.isArray(multiPermissionKey)
								? multiPermissionKey
								: [multiPermissionKey]
							).includes(item.perms)
						)
							? {
									type: "checkbox",
									onChange: onSelectChange,
									selectedRowKeys:
										selectType === "string"
											? selectedRowKeys
											: selectedRowKeys!.map(
													(item: any) => item[rowKey as string]
											  ),
							  }
							: undefined
					}
					pagination={
						showPagination
							? {
									current: currentPage,
									pageSize: pageSize,
									total: total,
									onChange(page, pageSize) {
										if (onPageChange) onPageChange(page, pageSize);
										setCurrentPage(page);
										setPageSize(pageSize);
										getTableList(page, pageSize);
									},
									showSizeChanger: true,
							  }
							: false
					}
				/>
			</TableFix>
		</>
	);
};

export default MyTable;
