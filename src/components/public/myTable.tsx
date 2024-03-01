import { Table, TableColumnsType } from "antd";
import { GetRowKey, Key } from "antd/es/table/interface";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useUpdateEffect } from "react-use";
import { MenuRedux } from "../../redux/menu";
import { User } from "../../redux/user";
import { enterLoading, leaveLoading } from "../../utils/controllerUtils";
import { get, post } from "../../utils/request";
import { abort } from "./signal";
import TableFix from "./tableFix";

interface MyTableProps {
	columns: TableColumnsType<any>;
	getListUrl: string;
	tableKey?: number;
	checked?: boolean;
	selectedRowKeys?: Key[] | any[];
	setSelectedRowKeys?: React.Dispatch<React.SetStateAction<React.Key[]>>;
	rowKey?: string | number | symbol | GetRowKey<any>;
	selectType?: "object" | "string";
	multiPermissionKey?: string | string[];
	searchParams?: object;
	method?: "POST" | "GET" | "get" | "post";
	data?: any[];
	onChange?: (page: number, pageSize: any) => void;
	showPagination?: boolean;
}

export default function MyTable(props: MyTableProps) {
	const {
		columns,
		getListUrl,
		tableKey = 0,
		selectedRowKeys,
		setSelectedRowKeys,
		checked,
		rowKey = "id",
		selectType = "string",
		multiPermissionKey,
		searchParams,
		method = "POST",
		data,
		onChange,
		showPagination = true,
	} = props;
	const [dataSource, setDataSource] = useState<any[]>(data ? data : []);
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
		const requestOptions = {
			url: getListUrl,
			data: showPagination
				? {
						pageNum: newPage ? newPage : currentPage,
						pageSize: newPageSize ? newPageSize : pageSize,
						...searchParams,
				  }
				: searchParams,
			token,
		};

		const requestPromise =
			method === "POST" ? post(requestOptions) : get(requestOptions);

		requestPromise
			.then((res: any) => {
				if (res.content.records) {
					const data = res.content.records;
					setDataSource(data);
					if (showPagination) setTotal(res.content.total);
				} else {
					setDataSource(res.content);
				}
			})
			.finally(() => {
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
											: selectedRowKeys!.map((item) => item[rowKey as string]),
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
										if (onChange) onChange(page, pageSize);
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
}
