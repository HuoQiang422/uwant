import { Space } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { MenuRedux } from "../../redux/menu";
import { hasPermission } from "../../utils/controllerUtils";

interface PageHeaderSpaceProps {
	permissions?: string[] | string;
	children: React.ReactNode;
}

export default function PageHeaderSpace(props: PageHeaderSpaceProps) {
	const { permissions, children } = props;
	const permissionsList = useSelector(
		(state: { menuRedux: MenuRedux }) => state.menuRedux.permissionsList
	);

	return (
		<Space
			className={
				permissions
					? hasPermission(permissionsList, permissions)
						? "mb-3"
						: ""
					: "mb-3"
			}
		>
			{children}
		</Space>
	);
}
