import { Button, Space, TableColumnsType, Tag } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { TimeTag } from "../components/common/myTag";
import TableSearchBar from "../components/common/tableSearchBar";
import { API_SMS_LIST, API_SMS_SEND } from "../config/api";
import MyTable from "../controller/myTable";
import { User } from "../redux/user";
import { enterLoading, leaveLoading } from "../utils/controllerUtils";
import { post } from "../utils/request";
import { transformJsonToFormData } from "../utils/transformData";

export default function SmsSend() {
	const [searchParams, setSearchParams] = useState<any>();
	const token = useSelector((state: { user: User }) => state.user.token);
	const [loadings, setLoadings] = useState<boolean[]>([]);
	const [tableKey, setTableKey] = useState<number>(0);

	const columns: TableColumnsType<any> = [
		{
			title: "手机号",
			width: 160,
			dataIndex: "mobile",
			key: "mobile",
			fixed: "left",
			render: (text) => (text ? text : "-"),
		},
		{
			title: "推送内容",
			width: 380,
			dataIndex: "content",
			key: "content",
			render: (text) => (text ? text : "-"),
		},
		{
			title: "发送时间",
			width: 200,
			dataIndex: "sendDate",
			key: "sendDate",
			render: (text) => <TimeTag text={text} />,
		},
		{
			title: "状态",
			width: 160,
			dataIndex: "state",
			key: "state",
			render: (text) => <Tag color="blue">{text ? text : "-"}</Tag>,
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
						loading={loadings[record.id]}
						disabled={record.state === "已发送"}
						onClick={() => {
							smsSend(record.id);
						}}
					>
						发送短信
					</Button>
				</Space>
			),
		},
	];

	function smsSend(id: string) {
		enterLoading(id, setLoadings);
		post({
			url: API_SMS_SEND,
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

	return (
		<>
			<TableSearchBar
				fields={[
					{
						type: "input",
						placeholder: "手机号",
						name: "mobile",
					},
					{
						type: "input",
						placeholder: "推送内容",
						name: "content",
					},
					{
						type: "input",
						placeholder: "状态",
						name: "state",
					},
				]}
				onFinish={setSearchParams}
				rows={1}
			/>
			<MyTable
				tableKey={tableKey}
				columns={columns}
				searchParams={searchParams}
				getListUrl={API_SMS_LIST}
			/>
		</>
	);
}
