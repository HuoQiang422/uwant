import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { SettingsProps } from "../../redux/settings";
import { homeUrl } from "../../utils/generateAuthList";

interface ContainerCardProps {
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

export default function ContainerCard(props: ContainerCardProps) {
	const homeHasBg = useSelector(
		(state: { settings: SettingsProps }) => state.settings.homeHasBg
	);
	const { children, className, style } = props;
	const location = useLocation();

	return (
		<div
			className={`${
				homeHasBg
					? "flex flex-col bg-white p-3 rounded-md border"
					: location.pathname === homeUrl || location.pathname === "/"
					? ""
					: "flex flex-col bg-white p-3 rounded-md border"
			} ${className}`}
			style={style}
		>
			{children}
		</div>
	);
}
