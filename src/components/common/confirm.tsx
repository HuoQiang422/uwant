import { Popconfirm } from "antd";
import ButtonPermission from "../../controller/buttonPermission";

interface ConfirmProps {
	buttonText: string;
	buttonType?: "primary" | "text" | "link" | "default" | "dashed";
	danger?: boolean;
	confirmTitle: string;
	description?: string;
	onConfirm: () => void;
	loading?: boolean;
	disabled?: boolean;
	size?: "small" | "middle" | "large";
	permissionKey?: string;
}
export default function Confirm(props: ConfirmProps) {
	const {
		buttonText,
		buttonType = "link",
		danger,
		confirmTitle,
		onConfirm,
		loading,
		disabled,
		size = "small",
		permissionKey,
		description,
	} = props;
	return (
		<>
			<Popconfirm
				title={confirmTitle}
				onConfirm={onConfirm}
				okText="确认"
				cancelText="取消"
				description={description}
			>
				<ButtonPermission
					permissionKey={permissionKey}
					disabled={disabled}
					loading={loading}
					size={size}
					type={buttonType}
					danger={danger}
				>
					{buttonText}
				</ButtonPermission>
			</Popconfirm>
		</>
	);
}
