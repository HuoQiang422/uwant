import { PlusOutlined } from "@ant-design/icons";
import {
	Button,
	DatePicker,
	Flex,
	Form,
	Image,
	Input,
	InputNumber,
	Radio,
	Select,
	Space,
	Spin,
	Switch,
	Tag,
	TreeSelect,
	Upload,
	UploadFile,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MenuRedux } from "../../redux/menu";
import {
	ComponentConfig,
	InputFieldConfig,
	InputNumberConfig,
	InputPasswordConfig,
	MyFormProps,
	RadioGroupConfig,
	RangePickerConfig,
	SelectFieldConfig,
	SwitchConfig,
	TextAreaConfig,
	TreeSelectConfig,
	UploadConfig,
} from "../../types/myForm";
import { hasPermission } from "../../utils/controllerUtils";
import { getBase64, removeEmptyValues } from "../../utils/transformData";

const { RangePicker } = DatePicker;

export default function MyForm(
	props: MyFormProps<
		| InputFieldConfig
		| SelectFieldConfig
		| InputNumberConfig
		| TreeSelectConfig
		| RadioGroupConfig
		| InputPasswordConfig
		| ComponentConfig
		| TextAreaConfig
		| RangePickerConfig
		| UploadConfig
		| SwitchConfig
	>
) {
	const {
		fields,
		onFinish,
		permissionKey,
		name,
		cancelLoading,
		onCancel,
		okLoading,
		okText = "确定",
		cancelText = "取消",
		initialValues,
		onValuesChange,
		childStyle,
		footerStyle,
		footerButtonStyle,
		footerDirection,
		showOk,
		showCancel,
		form,
		id,
		formKey,
		autoComplete,
		size,
		disabled,
		className,
		autoValidRules,
		labelWidth = 82,
		extra,
	} = props;
	const [myForm] = Form.useForm();
	const navigator = useNavigate();
	const permissionsList = useSelector(
		(state: { menuRedux: MenuRedux }) => state.menuRedux.permissionsList
	);
	const [pictureShow, setPictureShow] = useState<boolean>(false);
	const [pictureShowSrc, setPictureShowSrc] = useState<string>("");

	const footerButtonStyleShow = {
		width: "100%",
		justifyContent:
			footerStyle === "end"
				? "flex-end"
				: footerStyle === "start"
				? "flex-start"
				: footerStyle === "center"
				? "center"
				: footerStyle === "between"
				? "space-between"
				: footerStyle === "around"
				? "space-around"
				: footerStyle === "evenly"
				? "space-evenly"
				: undefined,
	};

	const showItem = (
		childItem:
			| InputFieldConfig
			| SelectFieldConfig
			| InputNumberConfig
			| TreeSelectConfig
			| RadioGroupConfig
			| InputPasswordConfig
			| TextAreaConfig
			| RangePickerConfig
			| UploadConfig
			| SwitchConfig
	) => {
		return (
			<Form.Item
				dependencies={
					typeof childItem.dependencies === "string"
						? [childItem.dependencies]
						: childItem.dependencies
				}
				getValueFromEvent={childItem.getValueFromEvent}
				valuePropName={childItem.valuePropName}
				className="flex-1"
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
		item:
			| InputFieldConfig
			| SelectFieldConfig
			| InputNumberConfig
			| TreeSelectConfig
			| RadioGroupConfig
			| InputPasswordConfig
			| TextAreaConfig
			| RangePickerConfig
			| UploadConfig
			| SwitchConfig
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
						showSearch
						optionRender={item.optionRender}
						style={{ ...item.style, ...childStyle }}
						className={item.className}
						onDropdownVisibleChange={(e) => {
							if (e) {
								if (item.onDropdownVisibleChange) {
									item.onDropdownVisibleChange();
								}
							}
						}}
						dropdownRender={(menu) => {
							return (
								<>
									{!item.loading ? menu : null}
									{item.loading ? (
										<Flex
											justify="center"
											align="center"
											style={{ padding: "24px" }}
										>
											<Spin />
										</Flex>
									) : null}
								</>
							);
						}}
					/>
				);
			case "inputNumber":
				return (
					<InputNumber
						placeholder={item.placeholder}
						min={item.min}
						max={item.max}
						style={{ ...item.style, ...childStyle }}
						className={item.className}
					/>
				);
			case "treeSelect":
				return (
					<TreeSelect
						loading={item.loading}
						showSearch
						placeholder={item.placeholder}
						allowClear
						style={{ ...item.style, ...childStyle }}
						className={item.className}
						treeDefaultExpandAll
						treeData={item.treeData}
						treeNodeFilterProp={item.treeNodeFilterProp}
						onDropdownVisibleChange={(e) => {
							if (e) {
								if (item.onDropdownVisibleChange) {
									item.onDropdownVisibleChange();
								}
							}
						}}
						dropdownRender={(menu) => {
							return (
								<>
									{!item.loading ? menu : null}
									{item.loading ? (
										<Flex
											justify="center"
											align="center"
											style={{ padding: "24px" }}
										>
											<Spin />
										</Flex>
									) : null}
								</>
							);
						}}
					/>
				);
			case "radioGroup":
				return (
					<Radio.Group
						onChange={item.onChange}
						style={{ ...item.style, ...childStyle }}
						className={item.className}
					>
						{item.itemType === "button"
							? item.options?.map((child, index) => {
									return (
										<Radio.Button key={index} value={child.value}>
											{child.label}
										</Radio.Button>
									);
							  })
							: item.options?.map((child, index) => {
									return (
										<Radio key={index} value={child.value}>
											{child.label}
										</Radio>
									);
							  })}
					</Radio.Group>
				);
			case "inputPassword":
				return (
					<Input.Password
						placeholder={item.placeholder}
						allowClear
						autoComplete={item.autoComplete}
						visibilityToggle={item.visibilityToggle}
						style={{ ...item.style, ...childStyle }}
						className={item.className}
						disabled={item.disabled}
					/>
				);
			case "textArea":
				return (
					<TextArea
						autoSize={{ minRows: item.rows, maxRows: item.rows }}
						placeholder={item.placeholder}
						allowClear
						disabled={item.disabled}
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
			case "upload":
				return (
					<Upload
						className="w-full"
						beforeUpload={() => {
							return false;
						}}
						listType={
							item.uploadButtonType === "image" ? "picture-card" : undefined
						}
						maxCount={item.maxCount}
						accept={
							item.accept
								? item.accept
								: item.uploadButtonType === "image"
								? ".jpeg, .jpg, .png, .gif, .svg, .webp, .bmp, .ico"
								: undefined
						}
						onPreview={async (e: UploadFile<any>) => {
							if (e) {
								if (item.uploadButtonType === "image") {
									const fileSrc = await getBase64(e.originFileObj);
									setPictureShow(true);
									setPictureShowSrc(fileSrc);
								}
							}
						}}
					>
						{item.uploadButtonType === "image" ? (
							<button style={{ border: 0, background: "none" }} type="button">
								<PlusOutlined />
								<div style={{ marginTop: 8 }}>
									{item.uploadButtonText ? item.uploadButtonText : "点击上传"}
								</div>
							</button>
						) : (
							<Button icon={item.uploadButtonIcon}>
								{item.uploadButtonText ? item.uploadButtonText : "点击上传"}
							</Button>
						)}
					</Upload>
				);
			case "switch":
				return (
					<Switch
						checkedChildren={item.checkedText}
						unCheckedChildren={item.uncheckedText}
					/>
				);
			default:
				return null;
		}
	}

	const showFields = useMemo(() => {
		return fields.map((item, index) => {
			if (item.type === "children") {
				return (
					<Flex gap={item.gap ? item.gap : 12} key={`children-group-${index}`}>
						{/* 自定义渲染children的逻辑，例如使用递归组件来渲染嵌套的表单项 */}
						{item.children.map((childItem, index2) => {
							if (childItem.type === "component") {
								return (
									<div key={`child-component-${index2}`}>
										{childItem.component}
									</div>
								);
							} else {
								return showItem(childItem);
							}
						})}
					</Flex>
				);
			} else if (item.type === "label") {
				const children: React.ReactNode = (
					<div className="flex w-full items-center justify-between">
						<p className="m-0">{item.label}</p>
						<div className="text-sm">
							{item.link ? (
								<a
									onClick={() => {
										navigator(`${item.link}`);
									}}
									className=" cursor-pointer font-semibold text-blue-600 hover:text-blue-500"
								>
									{item.linkText}
								</a>
							) : null}
						</div>
					</div>
				);
				return item.componentType && item.componentType === "tag" ? (
					<Tag
						icon={item.tagIcon}
						key={`label-${index}`}
						className="flex w-full px-4 py-1 mb-2"
					>
						{children}
					</Tag>
				) : (
					<div key={`label-${index}`} className="mb-2">
						{children}
					</div>
				);
			} else if (item.type === "component") {
				return <div key={`component-${index}`}>{item.component}</div>;
			} else {
				return showItem(item);
			}
		});
	}, [fields]);

	return (
		<>
			{fields.length > 0 && permissionKey ? (
				hasPermission(permissionsList, permissionKey)
			) : true ? (
				<>
					<Form
						size={size}
						autoComplete={autoComplete}
						key={formKey}
						id={id}
						form={form ? form : myForm}
						name={name}
						disabled={disabled}
						labelCol={{ flex: `${labelWidth}px` }}
						initialValues={initialValues}
						onFinish={(e) => {
							if (onFinish) onFinish(removeEmptyValues(e));
						}}
						onValuesChange={(e) => {
							if (autoValidRules) {
								form ? form.validateFields() : myForm.validateFields();
							}
							if (onValuesChange) onValuesChange(e, form);
						}}
						className={className}
					>
						{showFields}
						{!showCancel && !showOk && !extra ? null : (
							<Space
								wrap
								direction={footerDirection}
								style={footerButtonStyleShow}
							>
								{extra ? extra : null}
								<Space
									wrap
									direction={footerDirection}
									style={footerButtonStyleShow}
								>
									{showCancel ? (
										<Button
											loading={cancelLoading}
											onClick={onCancel}
											className={
												footerButtonStyle === "full" ? "w-full" : undefined
											}
											style={
												footerButtonStyle !== "full"
													? footerButtonStyle
													: undefined
											}
										>
											{cancelText}
										</Button>
									) : null}
									{showOk ? (
										<Button
											type="primary"
											htmlType="submit"
											loading={okLoading}
											className={
												footerButtonStyle === "full" ? "w-full" : undefined
											}
											style={
												footerButtonStyle !== "full"
													? footerButtonStyle
													: undefined
											}
										>
											{okText}
										</Button>
									) : null}
								</Space>
							</Space>
						)}
					</Form>
					<Image
						width={0}
						height={0}
						src={pictureShowSrc}
						preview={{
							visible: pictureShow,
							onVisibleChange: (e) => {
								setPictureShow(e);
							},
						}}
					/>
				</>
			) : null}
		</>
	);
}
