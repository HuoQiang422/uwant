import { Button, Modal, Space, Switch, TableColumnsType } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import Confirm from "../components/public/confirm";
import MyTable from "../components/public/myTable";
import { TimeTag } from "../components/public/myTag";
import PageHeaderSpace from "../components/public/pageHeaderSpace";
import TableSearchBar from "../components/public/tableSearchBar";
import AddOrEditSmsTemplate from "../components/smsTemplate/addOrEditSmsTemplate";
import {
	API_SMS_TEMPLATE_DELETE,
	API_SMS_TEMPLATE_LIST,
	API_SMS_TEMPLATE_OPERATE,
} from "../config/api";
import useFresh from "../hook/useFresh";
import { User } from "../redux/user";
import { enterLoading, leaveLoading } from "../utils/controllerUtils";
import { post } from "../utils/request";
import { transformJsonToFormData } from "../utils/transformData";

export default function SmsTemplate() {
	const [searchParams, setSearchParams] = useState<any>();
	const token = useSelector((state: { user: User }) => state.user.token);
	const [loadings, setLoadings] = useState<boolean[]>([]);
	const { key, refresh } = useFresh();
	const [modalType, setModalType] = useState<string>("");
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [handleItem, setHandleItem] = useState<any>();

	function openModal() {
		setModalOpen(true);
	}

	function closeModal() {
		setHandleItem(null);
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
			width: 280,
			dataIndex: "text",
			key: "text",
			render: (text) => (text ? text : "-"),
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
					checked={text === "启用"}
					checkedChildren="启用"
					unCheckedChildren="禁用"
					loading={loadings[`state-${record.id}` as any]}
					onChange={(e) => {
						changeTemplateStatus(e, record.id);
					}}
				/>
			),
		},
		{
			title: "操作",
			fixed: "right",
			width: 160,
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
					refresh();
				}
			})
			.finally(() => {
				leaveLoading(id, setLoadings);
			});
	}

	function changeTemplateStatus(e: boolean, id: string) {
		enterLoading(`state-${id}`, setLoadings);
		post({
			url: API_SMS_TEMPLATE_OPERATE,
			token,
			data: transformJsonToFormData({
				id,
				state: e === true ? "启用" : "禁用",
			}),
		})
			.then((res) => {
				if (res) {
					refresh();
				}
			})
			.finally(() => {
				leaveLoading(`status-${id}`, setLoadings);
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
				tableKey={key}
				columns={columns}
				params={{ searchParams: searchParams }}
				getListUrl={API_SMS_TEMPLATE_LIST}
				dataKey="content"
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
				footer={null}
				destroyOnClose
			>
				<AddOrEditSmsTemplate
					modalType={modalType}
					handleItem={handleItem}
					closeModal={closeModal}
					reFresh={refresh}
				/>
			</Modal>
		</>
	);
}
