import { Table } from "antd";
import { useEffect, useMemo, useState } from "react";
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

const MyTable = (props: MyTableProps & { onRowClick?: (record: any, event: React.MouseEvent<HTMLElement>) => void; }) => {
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
		expandable,
		handleData,
		onRowClick,
		onRow,
		getProgress,
		getAttachments,
		onProgressData,
		onAttachmentsData,
	} = props;
	const {
		selectedRowKeys,
		setSelectedRowKeys,
		checked,
		selectType = "string",
		multiPermissionKey,
	} = select || {};
	const { searchParams, paramsType, main_id } = params || {};
	const { onPageChange, showPagination = true } = pagination || {};
	const [dataSource, setDataSource] = useState<any[]>([]);
	const [progressList, setProgressList] = useState<any[]>([]);
	const [attachmentsList, setAttachmentsList] = useState<any[]>([]);
	const [loadings, setLoadings] = useState<boolean[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [total, setTotal] = useState<number>(0);
	const token = useSelector((state: { user: User }) => state.user.token);
	const permissionsList = useSelector(
		(state: { menuRedux: MenuRedux }) => state.menuRedux.permissionsList
	);

	// 获取进度列表
	const getProgressList = async (taskId: string | number) => {
		if (!getProgress) return;
		try {
			const requestOptions = {
				url: `${getProgress}?main_id=${taskId}`,
				data: {},
				token
			};
			const response = await post(requestOptions);
			console.log('Progress response:', response);
			if (response.code === 200) {
				const progressData = response.content || [];
				setProgressList(progressData);
				if (onProgressData) {
					onProgressData(progressData);
				}
			}
		} catch (error) {
			console.error('Failed to fetch progress:', error);
			setProgressList([]);
			if (onProgressData) {
				onProgressData([]);
			}
		}
	};

	// 获取附件列表
	const getAttachmentsList = async (taskId: string | number) => {
		if (!getAttachments) return;
		try {
			const requestOptions = {
				url: `${getAttachments}?main_id=${taskId}`,
				data: {},
				token
			};
			const response = await post(requestOptions);
			console.log('Attachments response:', response);
			if (response.code === 200) {
				const attachmentsData = response.content || [];
				setAttachmentsList(attachmentsData);
				if (onAttachmentsData) {
					onAttachmentsData(attachmentsData);
				}
			}
		} catch (error) {
			console.error('Failed to fetch attachments:', error);
			setAttachmentsList([]);
			if (onAttachmentsData) {
				onAttachmentsData([]);
			}
		}
	};

	useEffect(() => {
		if (getListUrl) getTableList(currentPage, pageSize);
		if (getProgress && main_id) {
			console.log('Fetching progress for main_id:', main_id);
			getProgressList(main_id);
		}
		if (getAttachments && main_id) {
			console.log('Fetching attachments for main_id:', main_id);
			getAttachmentsList(main_id);
		}
	}, [tableKey]);

	useEffect(() => {
		if (getProgress && main_id) {
			console.log('main_id changed, fetching progress:', main_id);
			getProgressList(main_id);
		}
		if (getAttachments && main_id) {
			console.log('main_id changed, fetching attachments:', main_id);
			getAttachmentsList(main_id);
		}
	}, [main_id]);

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

	const searchContent = useMemo(() => {
		const searchText = JSON.stringify(searchParams);
		if (searchText === "{}") {
			return Math.random();
		} else {
			return searchText;
		}
	}, [searchParams]);

	useUpdateEffect(() => {
		abort();
		getTableList(1);
	}, [searchContent]);

	return (
		<>
			<TableFix>
				<Table
					loading={loadings[0]}
					dataSource={dataSource}
					columns={columns}
					scroll={{ x: "max-content" }}
					rowKey={rowKey}
					tableLayout="fixed"
					expandable={expandable}
					onRow={(record) => ({
						onClick: (event) => {
							if (onRowClick) onRowClick(record, event);
						},
					})}
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