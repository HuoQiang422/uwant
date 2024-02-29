import { Button, Modal, Space, Switch, TableColumnsType } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import Confirm from "../components/common/confirm";
import { TimeTag } from "../components/common/myTag";
import PageHeaderSpace from "../components/common/pageHeaderSpace";
import TableSearchBar from "../components/common/tableSearchBar";
import AddOrEditSmsTemplate from "../components/smsTemplate/addOrEditSmsTemplate";
import {
	API_SMS_TEMPLATE_DELETE,
	API_SMS_TEMPLATE_LIST,
	API_SMS_TEMPLATE_OPERATE,
} from "../config/api";
import MyTable from "../controller/myTable";
import { User } from "../redux/user";
import { enterLoading, leaveLoading } from "../utils/controllerUtils";
import { post } from "../utils/request";
import { transformJsonToFormData } from "../utils/transformData";

export default function SmsTemplate() {
	const [searchParams, setSearchParams] = useState<any>();
	const token = useSelector((state: { user: User }) => state.user.token);
	const [loadings, setLoadings] = useState<boolean[]>([]);
	const [tableKey, setTableKey] = useState<number>(0);
	const [modalType, setModalType] = useState<string>("");
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [handleItem, setHandleItem] = useState<any>();

	function openModal() {
		setModalOpen(true);
	}

	function closeModal() {
		setModalOpen(false);
	}

	const columns: TableColumnsType<any> = [
		{
			title: "模版标题",
			width: 160,
			dataIndex: "title",
			key: "title",
			fixed: "left",
			render: (text) => (text ? text : "-"),
		},
		{
			title: "模版内容",
			width: 300,
			dataIndex: "text",
			key: "text",
			render: (text) => (text ? text : "-"),
		},
		{
			title: "链接",
			width: 200,
			dataIndex: "url",
			key: "url",
			render: (text) => (
				<a href={text} target="_blank">
					{text ? text : "-"}
				</a>
			),
		},
		{
			title: "更新时间",
			width: 200,
			dataIndex: "time",
			key: "time",
			render: (text) => <TimeTag text={text} />,
		},
		{
			title: "状态",
			width: 120,
			dataIndex: "state",
			key: "state",
			render: (text, record) => (
				<Switch
					checkedChildren="启用"
					unCheckedChildren="禁用"
					defaultChecked={text === "0"}
					disabled={loadings[`checked-${record.id}` as any]}
					loading={loadings[`checked-${record.id}` as any]}
					onClick={(e) => {
						changeTemplateState(record.id, e ? "0" : "1");
					}}
				/>
			),
		},
		{
			title: "操作",
			fixed: "right",
			width: 120,
			render: (_, record) => (
				<Space size="middle">
					<Button
						size="small"
						type="link"
						onClick={() => {
							setModalType("edit");
							openModal();
							setHandleItem(record);
						}}
					>
						编辑
					</Button>
					<Confirm
						confirmTitle="是否确认删除？"
						buttonText="删除"
						danger
						loading={loadings[record.id]}
						onConfirm={() => {
							deleteTemplate(record.id);
						}}
					/>
				</Space>
			),
		},
	];

	function deleteTemplate(id: string) {
		enterLoading(id, setLoadings);
		post({
			url: API_SMS_TEMPLATE_DELETE,
			token,
			data: transformJsonToFormData({ id }),
		})
			.then((res) => {
				if (res) {
					setTableKey(Math.random());
				}
			})
			.finally(() => {
				leaveLoading(id, setLoadings);
			});
	}

	function changeTemplateState(id: string, state: string) {
		enterLoading(`checked-${id}`, setLoadings);
		post({
			url: API_SMS_TEMPLATE_OPERATE,
			token,
			data: transformJsonToFormData({ id, state }),
		})
			.then((res) => {
				if (res) {
					setTableKey(Math.random());
				}
			})
			.finally(() => {
				leaveLoading(`checked-${id}`, setLoadings);
			});
	}

	return (
		<>
			<TableSearchBar
				fields={[
					{
						type: "input",
						placeholder: "标题",
						name: "title",
					},
					{
						type: "input",
						placeholder: "模版内容",
						name: "text",
					},
				]}
				onFinish={setSearchParams}
				rows={1}
			/>
			<PageHeaderSpace>
				<Button
					onClick={() => {
						setModalType("add");
						openModal();
					}}
					type="primary"
				>
					新增模版
				</Button>
			</PageHeaderSpace>
			<MyTable
				tableKey={tableKey}
				columns={columns}
				searchParams={searchParams}
				getListUrl={API_SMS_TEMPLATE_LIST}
			/>
			<Modal
				open={modalOpen}
				title={
					modalType === "add"
						? "新增模版"
						: modalType === "edit"
						? "编辑模版"
						: ""
				}
				centered
				onCancel={closeModal}
				footer={false}
			>
				<AddOrEditSmsTemplate />
			</Modal>
		</>
	);
}
