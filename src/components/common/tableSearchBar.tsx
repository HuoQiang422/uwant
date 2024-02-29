import {
	DownOutlined,
	ExportOutlined,
	RedoOutlined,
	SearchOutlined,
} from "@ant-design/icons";
import { Button, Divider, Form, Input, Select, Space } from "antd";
import { saveAs } from "file-saver";
import { useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useWindowSize } from "react-use";
import ButtonPermission from "../../controller/buttonPermission";
import { MenuRedux } from "../../redux/menu";
import { User } from "../../redux/user";
import {
	InputFieldConfig,
	MyFormProps,
	SelectFieldConfig,
} from "../../types/myForm";
import {
	enterLoading,
	getPermissionUrl,
	hasPermission,
	leaveLoading,
} from "../../utils/controllerUtils";
import { get, post } from "../../utils/request";
import { removeEmptyValues } from "../../utils/transformData";

const gridWidth = 220;

interface TableSearchBarProps {
	exportRequestType?: "GET" | "POST";
	exportPermissionKey?: string;
	showExport?: boolean;
}

export default function TableSearchBar(
	props: MyFormProps<InputFieldConfig | SelectFieldConfig> & TableSearchBarProps
) {
	const {
		fields,
		onFinish,
		rows = 1,
		permissionKey,
		childStyle,
		form,
		exportRequestType = "POST",
		exportPermissionKey,
		showExport,
	} = props;
	const [myForm] = Form.useForm();
	const gridRef = useRef<HTMLDivElement>(null);
	const [showNum, setShowNum] = useState<number>(0);
	const { width } = useWindowSize();
	const [expand, setExpand] = useState(false);
	const permissionsList = useSelector(
		(state: { menuRedux: MenuRedux }) => state.menuRedux.permissionsList
	);
	const token = useSelector((state: { user: User }) => state.user.token);
	const [loadings, setLoadings] = useState<boolean[]>([]);

	const showItem = (childItem: InputFieldConfig | SelectFieldConfig) => {
		return (
			<Form.Item
				key={childItem.name}
				label={childItem.label}
				name={childItem.name}
				rules={childItem.rules}
				required={childItem.required}
			>
				{renderItem(childItem)}
			</Form.Item>
		);
	};

	function renderItem(item: InputFieldConfig | SelectFieldConfig) {
		switch (item.type) {
			case "input":
				return (
					<Input
						placeholder={item.placeholder}
						allowClear
						disabled={
							item.disabled
								? typeof item.disabled === "boolean"
									? item.disabled
									: (Array.isArray(item.disabled)
											? item.disabled
											: [item.disabled]
									  ).includes(
											form
												? form.getFieldValue(item.name)
												: myForm.getFieldValue(item.name)
									  )
								: false
						}
						style={{ ...item.style, ...childStyle }}
						className={item.className}
					/>
				);
			case "select":
				return (
					<Select
						options={item.selectOptions}
						placeholder={item.placeholder}
						allowClear
						optionRender={item.optionRender}
						style={{ ...item.style, ...childStyle }}
						className={item.className}
					/>
				);
			default:
				return null;
		}
	}

	const showFields = () => {
		return (
			<>
				{showNum > 0
					? fields.map((item, index) => {
							if (item.type !== "children" && item.type !== "label") {
								if (expand) {
									return showItem(item);
								} else {
									if (index < showNum) {
										return showItem(item);
									}
								}
							}
					  })
					: null}
			</>
		);
	};

	useLayoutEffect(() => {
		if (gridRef.current) {
			const width = gridRef.current.clientWidth;
			const num = Math.floor((width + 12) / (gridWidth + 12));
			setShowNum(num > 0 ? rows * num : rows);
		}
	}, [width]);

	return (
		<>
			{fields.length > 0 &&
			(permissionKey ? hasPermission(permissionsList, permissionKey) : true) ? (
				<>
					<Form
						form={form ? form : myForm}
						className="no-gap-form"
						name="tabel-search-bar"
						onFinish={(e) => {
							if (onFinish) onFinish(removeEmptyValues(e));
						}}
					>
						<div
							ref={gridRef}
							className="grid mb-3 gap-3"
							style={{
								gridTemplateColumns: `repeat(auto-fill,minmax(${gridWidth}px,1fr))`,
								gridTemplateRows: `32px`,
								overflow: "hidden",
							}}
						>
							{showFields()}
						</div>
						<div style={{ textAlign: "left" }}>
							<Space size="small">
								<Button
									type="primary"
									htmlType="submit"
									icon={<SearchOutlined />}
									className="px-3"
								>
									查询
								</Button>
								<Button
									className="px-3"
									icon={<RedoOutlined />}
									onClick={() => {
										if (form) {
											form.resetFields();
											if (onFinish)
												onFinish(removeEmptyValues(form.getFieldsValue()));
										} else {
											myForm.resetFields();
											if (onFinish)
												onFinish(removeEmptyValues(myForm.getFieldsValue()));
										}
									}}
								>
									重置
								</Button>
								{showExport ? (
									<ButtonPermission
										permissionKey={exportPermissionKey}
										className="px-3"
										icon={<ExportOutlined />}
										loading={loadings["export" as any]}
										onClick={async () => {
											if (exportPermissionKey) {
												enterLoading("export", setLoadings);
												const mform = form ? form : myForm;
												const formValues = removeEmptyValues(
													mform.getFieldsValue()
												);
												const requestData = {
													url: getPermissionUrl(
														permissionsList,
														exportPermissionKey
													),
													token,
													data: { ...formValues, pageNum: 1, pageSize: 10 },
												};
												try {
													const result =
														exportRequestType === "GET"
															? await get(requestData)
															: await post(requestData);
													const blob = new Blob([result.data], {
														type: result.headers["Content-Type"],
													});

													const disposition =
														result.headers["content-disposition"]; // 获取Content-Disposition头部

													let fileName = "export"; // 默认文件名

													if (disposition) {
														const match =
															disposition.match(/filename="?(.+?)"?$/); // 提取文件名和后缀信息
														if (match && match.length >= 2) {
															fileName = decodeURIComponent(match[1]);
														}
													}
													saveAs(blob, fileName);
												} catch (error) {
													console.error(error);
												} finally {
													leaveLoading("export", setLoadings);
												}
											}
										}}
									>
										导出
									</ButtonPermission>
								) : null}
								<Button
									style={{
										display:
											showNum === 0
												? "none"
												: showNum >= fields.length
												? "none"
												: "",
									}}
									type="link"
									className="px-1"
									onClick={() => {
										setExpand(!expand);
									}}
									icon={<DownOutlined rotate={expand ? 180 : 0} />}
								>
									更多
								</Button>
							</Space>
						</div>
					</Form>
					<Divider className="my-3" />
				</>
			) : null}
		</>
	);
}
