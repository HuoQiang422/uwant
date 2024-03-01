import { Store } from "antd/es/form/interface";
import { Rule } from "rc-field-form/lib/interface";
import React from "react";

interface CommonFieldProps {
	label?: string;
	name: string;
	rules?: Rule[]; // 假设 Rule 是您想要的规则类型
	style?: React.CSSProperties;
	required?: boolean;
	className?: string;
	dependencies?: string[] | string;
	valuePropName?: string;
	getValueFromEvent?: (e: any) => any;
}

interface InputFieldConfig extends CommonFieldProps {
	type: "input";
	placeholder?: string;
	disabled?: string[] | string | boolean;
}

interface SelectFieldConfig extends CommonFieldProps {
	type: "select";
	placeholder?: string;
	selectOptions?: DefaultOptionType[];
	optionRender?: (option: DefaultOptionType) => React.ReactNode;
	onDropdownVisibleChange?: () => void;
	loading?: boolean;
}

interface InputNumberConfig extends CommonFieldProps {
	type: "inputNumber";
	placeholder?: string;
	min?: number;
	max?: number;
}

interface InputPasswordConfig extends CommonFieldProps {
	type: "inputPassword";
	placeholder?: string;
	autoComplete?: "off" | "new-password";
	visibilityToggle?: boolean;
	disabled?: boolean;
}

interface ComponentConfig extends CommonFieldProps {
	type: "component";
	component: React.ReactNode;
}

interface ChildrenConfig<T extends CommonFieldProps> {
	type: "children";
	children: T[];
	gap?: number;
}

interface LabelConfig<T extends CommonFieldProps> {
	type: "label";
	label: string;
	link?: string;
	linkText?: string;
	componentType?: "div" | "tag";
	tagIcon?: React.ReactNode;
}

interface TreeSelectConfig extends CommonFieldProps {
	type: "treeSelect";
	loading?: boolean;
	treeData?: DefaultOptionType[];
	onDropdownVisibleChange?: () => void;
	treeNodeFilterProp?: string;
	placeholder?: string;
	disabled?: boolean;
}

interface RadioGroupConfig extends CommonFieldProps {
	type: "radioGroup";
	onChange?: (e: RadioChangeEvent) => void;
	itemType?: "button";
	options?: {
		value: string | number;
		label: string;
	}[];
}

interface SwitchConfig extends CommonFieldProps {
	type: "switch";
	checkedText?: string;
	uncheckedText?: string;
}

interface TextAreaConfig extends CommonFieldProps {
	type: "textArea";
	rows?: number;
	placeholder?: string;
	disabled?: boolean;
}

interface RangePickerConfig extends CommonFieldProps {
	type: "rangePicker";
}

interface UploadConfig extends CommonFieldProps {
	type: "upload";
	uploadButtonText?: string;
	uploadButtonType?: "button" | "image";
	uploadButtonIcon?: React.ReactNode;
	accept?: string;
	maxCount?: number;
	templateFileUrl?: string;
}

export interface MyFormProps<T extends CommonFieldProps = CommonFieldProps> {
	fields: Array<T | ChildrenConfig<T> | LabelConfig<T>>;
	onFinish?: (values: any) => void;
	permissionKey?: string;
	rows?: number;
	name?: string;
	cancelLoading?: boolean;
	onCancel?: () => void;
	okLoading?: boolean;
	onOk?: () => void;
	okText?: string | React.ReactNode;
	cancelText?: string | React.ReactNode;
	initialValues?: Store;
	onValuesChange?: (e: any, form: FormInstance) => void;
	childStyle?: React.CSSProperties;
	footerStyle?: "end" | "center" | "start" | "between" | "around" | "evenly";
	footerButtonStyle?: "full" | React.CSSProperties;
	footerDirection?: "horizontal" | "vertical";
	showOk?: boolean;
	showCancel?: boolean;
	form?: FormInstance;
	id?: string;
	formKey?: string;
	autoComplete?: "off";
	size?: "small" | "middle" | "large";
	disabled?: boolean;
	className?: string;
	autoValidRules?: boolean;
	labelWidth?: number;
	extra?: React.ReactNode;
}
