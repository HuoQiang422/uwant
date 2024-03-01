import { Button } from "antd";
import { useSelector } from "react-redux";
import { MenuRedux } from "../../redux/menu";

interface ButtonPermissionProps {
	permissionKey?: string | string[];
	onClick?: () => void;
	size?: "small" | "middle" | "large";
	type?: "primary" | "default" | "dashed" | "link" | "text";
	children?: React.ReactNode;
	disabled?: boolean;
	loading?: boolean;
	icon?: React.ReactNode;
	ghost?: boolean;
	block?: boolean;
	danger?: boolean;
	className?: string;
}
export default function ButtonPermission(props: ButtonPermissionProps) {
	const permissionsList = useSelector(
		(state: { menuRedux: MenuRedux }) => state.menuRedux.permissionsList
	);
	const {
		permissionKey, // 权限key，用于判断按钮是否显示，如果不传，则不显示按钮
		onClick,
		size,
		type,
		children,
		disabled,
		loading,
		icon,
		ghost,
		block,
		danger,
		className,
	} = props;

	return (
		<>
			{permissionKey &&
			!permissionsList?.some((item) =>
				(Array.isArray(permissionKey)
					? permissionKey
					: [permissionKey]
				).includes(item.perms)
			) ? null : (
				<Button
					block={block}
					disabled={disabled}
					loading={loading}
					icon={icon}
					ghost={ghost}
					type={type}
					size={size}
					danger={danger}
					onClick={onClick}
					className={className}
				>
					{children}
				</Button>
			)}
		</>
	);
}
