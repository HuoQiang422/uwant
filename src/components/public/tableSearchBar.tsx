import {
	DownOutlined,
	ExportOutlined,
	ImportOutlined,
	RedoOutlined,
	SearchOutlined,
	SoundOutlined,
} from "@ant-design/icons";
import {
	Button,
	DatePicker,
	Divider,
	Form,
	Input,
	Modal,
	Select,
	Space,
} from "antd";
import { debounce } from "lodash";
import { useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useWindowSize } from "react-use";
import { MenuRedux } from "../../redux/menu";
import { User } from "../../redux/user";
import {
	InputFieldConfig,
	MyFormProps,
	RangePickerConfig,
	SelectFieldConfig,
	UploadConfig,
} from "../../types/myForm";
import { MyTableSearchBarProps } from "../../types/myTableSearchBar";
import {
	enterLoading,
	getPermissionUrl,
	hasPermission,
	leaveLoading,
} from "../../utils/controllerUtils";
import { download } from "../../utils/downloadBlob";
import { RequestParams, get, post } from "../../utils/request";
import { removeEmptyValues } from "../../utils/transformData";
import ButtonPermission from "./buttonPermission";
import MyForm from "./myForm";

const gridWidth = 220;

const { RangePicker } = DatePicker;

export default function TableSearchBar(
	props: MyFormProps<InputFieldConfig | SelectFieldConfig | RangePickerConfig> &
		MyTableSearchBarProps
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
		importPermissionKey,
		showExport,
		showImport,
		showOk = true,
		showCancel = true,
		showImportTemplate = false,
		importTemplateLinkText = "下载模版",
		importTemplateLabel = "文件上传需使用特定模版",
		importTemplateIcon = <SoundOutlined />,
		uploadAccept,
		importFieldName = "file",
		reFresh,
		exportRequestUrl,
		importRequestUrl,
		realTimeSearch,
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
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [modalType, setModalType] = useState<string>("");

	function openModal(type: string) {
		setModalOpen(true);
		setModalType(type);
	}

	function closeModal() {
		setModalOpen(false);
		setModalType("");
	}

	const showItem = (
		childItem: InputFieldConfig | SelectFieldConfig | RangePickerConfig
	) => {
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

	function renderItem(
		item: InputFieldConfig | SelectFieldConfig | RangePickerConfig
	) {
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
			case "rangePicker":
				return (
					<RangePicker
						allowClear
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

	function displayElement() {
		return !showCancel && !showOk && !showExport && !showImport ? "none" : "";
	}

	/**
	 * @description 导入按钮
	 */
	function importButton() {
		const uploadComponent: UploadConfig = {
			type: "upload",
			required: true,
			name: importFieldName,
			label: "从文件导入",
			rules: [
				{
					required: true,
					message: "请选择您要上传的文件",
				},
			],
			valuePropName: "filelist",
			getValueFromEvent: (e) => {
				return e.fileList;
			},
			accept: uploadAccept,
			maxCount: 1,
		};

		return (
			<>
				<ButtonPermission
					permissionKey={importPermissionKey}
					className="px-3"
					icon={<ImportOutlined />}
					onClick={() => {
						openModal("import");
					}}
				>
					导入
				</ButtonPermission>
				<Modal
					destroyOnClose
					centered
					title={modalType === "import" ? "导入" : ""}
					open={modalOpen}
					onCancel={closeModal}
					footer={null}
				>
					<MyForm
						labelWidth={100}
						showOk
						showCancel
						onCancel={closeModal}
						okLoading={loadings["import" as any]}
						onFinish={(e) => {
							if (importPermissionKey || importRequestUrl) {
								enterLoading("import", setLoadings);
								post({
									url: importPermissionKey
										? getPermissionUrl(permissionsList, importPermissionKey)
										: importRequestUrl,
									token,
									data: e,
								})
									.then((res) => {
										if (res.code === 200 || res.errorCode === 200) {
											closeModal();
											if (reFresh) reFresh();
										}
									})
									.finally(() => {
										leaveLoading("import", setLoadings);
									});
							}
						}}
						footerStyle="end"
						fields={
							showImportTemplate && importPermissionKey
								? [
										{
											type: "label",
											label: importTemplateLabel,
											link: getPermissionUrl(
												permissionsList,
												importPermissionKey
											),
											tagIcon: importTemplateIcon,
											linkText: importTemplateLinkText,
											componentType: "tag",
										},
										uploadComponent,
								  ]
								: [uploadComponent]
						}
					/>
				</Modal>
			</>
		);
	}

	/**
	 * @description 导出按钮
	 */
	function exportButton() {
		return (
			<ButtonPermission
				permissionKey={exportPermissionKey}
				className="px-3"
				icon={<ExportOutlined />}
				loading={loadings["export" as any]}
				onClick={async () => {
					if (exportPermissionKey || exportRequestUrl) {
						enterLoading("export", setLoadings);
						const mform = form ? form : myForm;
						const formValues = mform.getFieldsValue();
						const requestData: RequestParams = {
							url: exportPermissionKey
								? getPermissionUrl(permissionsList, exportPermissionKey)
								: exportRequestUrl,
							token,
							data: formValues,
							responseType: "blob",
						};
						try {
							const result =
								exportRequestType === "GET"
									? await get(requestData)
									: await post(requestData);
							download(result);
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
		);
	}

	return (
		<>
			{(
				permissionKey ? hasPermission(permissionsList, permissionKey) : true
			) ? (
				<>
					<Form
						form={form ? form : myForm}
						className="no-gap-form"
						name="tabel-search-bar"
						onFinish={(e) => {
							if (onFinish) onFinish(removeEmptyValues(e));
						}}
						onValuesChange={debounce((_, all) => {
							if (realTimeSearch) {
								if (onFinish) {
									onFinish(removeEmptyValues(all));
								}
							}
						}, 500)}
					>
						{fields.length > 0 ? (
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
						) : null}
						<div
							style={{
								textAlign: "left",
								display: displayElement(),
							}}
						>
							<Space size="small" wrap>
								{showOk && !realTimeSearch ? (
									<Button
										type="primary"
										htmlType="submit"
										icon={<SearchOutlined />}
										className="px-3"
									>
										查询
									</Button>
								) : null}
								{showCancel ? (
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
								) : null}
								{showImport ? importButton() : null}
								{showExport ? exportButton() : null}
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
					<Divider className="my-3" style={{ display: displayElement() }} />
				</>
			) : null}
		</>
	);
}
